/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
// hooks/useTwilio.ts
import { useEffect, useRef, useState } from 'react';
import { Platform, Alert, AppState } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { Voice, Call } from '@twilio/voice-react-native-sdk';

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
  const [isVoiceReady, setIsVoiceReady] = useState<boolean>(false);
  const callRef = useRef<Call | null>(null);
  const voiceRef = useRef<Voice | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  // ✅ Initialize Voice instance - only once
  const initializeVoice = () => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    try {
      console.log('🔊 Initializing Twilio Voice...');
      const voice = new Voice();
      voiceRef.current = voice;
      setVoiceInstance(voice);

      // ✅ Set up event listeners
      const onDeviceReady = () => {
        console.log('✅ Twilio Voice device ready');
        setIsVoiceReady(true);
      };

      const onDeviceNotReady = () => {
        console.log('❌ Twilio Voice device not ready');
        setIsVoiceReady(false);
      };

      const onCallInvite = (callInvite: any) => {
        console.log('📞 Incoming call invite:', callInvite);
        // Handle incoming call here
      };

      const onError = (error: any) => {
        console.error('❌ Voice error:', error);
        setError(error.message);
      };

      voice.on('deviceReady', onDeviceReady);
      voice.on('deviceNotReady', onDeviceNotReady);
      voice.on('callInvite', onCallInvite);
      voice.on('error', onError);

      // Store cleanup
      voiceRef.current = voice;
      
      console.log('✅ Twilio Voice initialized successfully');
    } catch (error: any) {
      console.error('❌ Failed to initialize Twilio Voice:', error);
      setError(error.message);
    }
  };

  // ✅ Initialize on mount
  useEffect(() => {
    // Delay initialization to ensure native modules are ready
    const timer = setTimeout(() => {
      initializeVoice();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (voiceRef.current) {
        voiceRef.current.destroy();
      }
    };
  }, []);

  // ✅ Re-initialize when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && !voiceRef.current) {
        initializeVoice();
      }
    });

    return () => {
      subscription.remove();
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
    return true;
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

    if (!isVoiceReady) {
      console.log('⏳ Voice not ready yet, initializing...');
      initializeVoice();
      // Wait a bit for initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
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

      const voice = voiceRef.current;
      if (!voice) {
        throw new Error('Voice instance not available');
      }

      // ✅ Register device with Twilio Voice
      try {
        console.log('📱 Registering device with Twilio...');
        await voice.register(token);
        console.log('✅ Device registered with Twilio');
      } catch (registerError: any) {
        console.error('❌ Registration error:', registerError);
        if (registerError.message?.includes('already registered')) {
          console.log('⚠️ Already registered, continuing...');
        } else {
          throw registerError;
        }
      }

      // ✅ Connect to the call
      console.log('🔗 Connecting to room:', roomName);
      
      const connectOptions = {
        accessToken: token,
        params: {
          to: roomName,
        },
      };

      const call = await voice.connect(connectOptions);

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
      if (voiceRef.current) {
        voiceRef.current.destroy();
        voiceRef.current = null;
        isInitializedRef.current = false;
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
    isVoiceReady,
    error,
    call: callRef.current,
  };
};