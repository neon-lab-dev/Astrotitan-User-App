// hooks/useTwilio.ts
import { useEffect, useRef, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { Voice, Call, VoiceEvent } from '@twilio/voice-react-native-sdk';

interface UseTwilioProps {
  token: string;
  roomName: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: any) => void;
}

export const useTwilio = ({ token, roomName, onConnected, onDisconnected, onError }: UseTwilioProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceInstance, setVoiceInstance] = useState<Voice | null>(null);
  const callRef = useRef<Call | null>(null);

  // ✅ Initialize Voice instance
  useEffect(() => {
    const voice = new Voice();
    setVoiceInstance(voice);
    
    // ✅ Set up event listeners
    const onDeviceReady = () => {
      console.log('✅ Twilio Voice device ready');
    };

    const onDeviceNotReady = () => {
      console.log('❌ Twilio Voice device not ready');
    };

    const onCallInvite = (callInvite: any) => {
      console.log('📞 Incoming call invite:', callInvite);
      // Handle incoming call here
    };

    voice.on('deviceReady', onDeviceReady);
    voice.on('deviceNotReady', onDeviceNotReady);
    voice.on('callInvite', onCallInvite);

    return () => {
      voice.off('deviceReady', onDeviceReady);
      voice.off('deviceNotReady', onDeviceNotReady);
      voice.off('callInvite', onCallInvite);
      voice.destroy();
    };
  }, []);

  // ✅ Request microphone permission (Android)
  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to make calls.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true; // iOS permission is handled in Info.plist
  };

  // Connect to room
  const connectToRoom = async (): Promise<void> => {
    if (!token || !roomName) {
      console.error('❌ Token or room name missing');
      if (onError) onError(new Error('Token or room name missing'));
      return;
    }

    if (isConnected || isConnecting) {
      console.log('⚠️ Already connected or connecting');
      return;
    }

    console.log('🔑 Token available:', !!token);
    console.log('🏠 Room Name:', roomName);
    setIsConnecting(true);

    try {
      // ✅ Request microphone permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Microphone access is required for calls.');
        setIsConnecting(false);
        if (onError) onError(new Error('Microphone permission denied'));
        return;
      }

      // ✅ Register device with Twilio Voice
      if (voiceInstance) {
        try {
          await voiceInstance.register(token);
          console.log('✅ Device registered with Twilio');
        } catch (registerError) {
          console.error('❌ Registration error:', registerError);
          // Continue anyway - the call might still work
        }
      }

      // ✅ Connect to the call
      console.log('🔗 Connecting to room:', roomName);
      
      // For React Native Voice SDK
      const connectOptions = {
        accessToken: token,
        params: {
          to: roomName,
        },
      };

      const call = await voiceInstance?.connect(connectOptions);

      if (call) {
        callRef.current = call;
        setIsConnected(true);
        setIsConnecting(false);
        console.log('✅ Connected to call!');

        // ✅ Event listeners for the call
        const onCallConnected = () => {
          console.log('📞 Call connected');
          setIsConnected(true);
          if (onConnected) onConnected();
        };

        const onCallDisconnected = () => {
          console.log('📞 Call disconnected');
          setIsConnected(false);
          setIsConnecting(false);
          if (onDisconnected) onDisconnected();
        };

        const onCallError = (error: any) => {
          console.error('❌ Call error:', error);
          setError(error.message);
          if (onError) onError(error);
        };

        const onCallRinging = () => {
          console.log('🔔 Call ringing');
        };

        const onCallAccept = () => {
          console.log('✅ Call accepted');
        };

        const onCallReject = () => {
          console.log('❌ Call rejected');
          setIsConnected(false);
        };

        call.on('connected', onCallConnected);
        call.on('disconnected', onCallDisconnected);
        call.on('error', onCallError);
        call.on('ringing', onCallRinging);
        call.on('accept', onCallAccept);
        call.on('reject', onCallReject);

        // Store cleanup functions
        const cleanup = () => {
          call.off('connected', onCallConnected);
          call.off('disconnected', onCallDisconnected);
          call.off('error', onCallError);
          call.off('ringing', onCallRinging);
          call.off('accept', onCallAccept);
          call.off('reject', onCallReject);
        };

        // Attach cleanup to call object
        (call as any).cleanup = cleanup;

      } else {
        throw new Error('Failed to create call');
      }

    } catch (error: any) {
      console.error('❌ Failed to connect to call:', error);
      setIsConnecting(false);
      setError(error.message);
      if (onError) onError(error);
      Alert.alert('Call Error', error.message || 'Failed to connect to call');
    }
  };

  // Disconnect from call
  const disconnect = (): void => {
    console.log('📞 Disconnecting from call...');
    if (callRef.current) {
      try {
        // Clean up event listeners
        if ((callRef.current as any).cleanup) {
          (callRef.current as any).cleanup();
        }
        callRef.current.disconnect();
        callRef.current = null;
        setIsConnected(false);
        setIsConnecting(false);
        console.log('✅ Disconnected');
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
  };

  // Mute/Unmute
  const toggleMute = (): void => {
    if (callRef.current) {
      try {
        if (isMuted) {
          callRef.current.unmute();
          setIsMuted(false);
          console.log('🔊 Unmuted');
        } else {
          callRef.current.mute();
          setIsMuted(true);
          console.log('🔇 Muted');
        }
      } catch (error) {
        console.error('Error toggling mute:', error);
      }
    } else {
      console.warn('⚠️ No call to mute/unmute');
    }
  };

  // Speaker toggle
  const toggleSpeaker = (): void => {
    if (callRef.current) {
      try {
        // Toggle speakerphone if available
        const newSpeakerState = !isSpeakerOn;
        // @ts-ignore - setSpeakerphone might not be in types
        callRef.current.setSpeakerphone?.(newSpeakerState);
        setIsSpeakerOn(newSpeakerState);
        console.log(`🔊 Speaker ${newSpeakerState ? 'ON' : 'OFF'}`);
      } catch (error) {
        console.error('Error toggling speaker:', error);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up Twilio hook');
      disconnect();
      if (voiceInstance) {
        voiceInstance.destroy();
      }
    };
  }, []);

  return {
    connectToRoom,
    disconnect,
    toggleMute,
    toggleSpeaker,
    isConnected,
    isConnecting,
    isMuted,
    isSpeakerOn,
    error,
    call: callRef.current,
    voiceInstance,
  };
};