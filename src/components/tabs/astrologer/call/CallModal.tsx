// components/CallModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTwilio } from '../../../../hooks/useTwilio';

interface CallModalProps {
  isVisible: boolean;
  onClose: () => void;
  callStatus: 'incoming' | 'ringing' | 'connected' | 'ended';
  callerName: string;
  callerImage?: string;
  twilioToken?: string;
  roomName?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onEnd?: () => void;
  duration?: number;
}

const CallModal: React.FC<CallModalProps> = ({
  isVisible,
  onClose,
  callStatus,
  callerName,
  callerImage,
  twilioToken = '',
  roomName = '',
  onAccept,
  onReject,
  onEnd,
  duration = 0,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(duration);

  const {
    connectToRoom,
    disconnect,
    toggleMute,
    toggleSpeaker,
    isConnected,
    isMuted: twilioMuted,
  } = useTwilio({
    token: twilioToken,
    roomName: roomName,
    onConnected: () => {
      console.log('✅ Twilio connected!');
    },
    onDisconnected: () => {
      console.log('❌ Twilio disconnected');
    },
    onError: (error) => {
      console.error('❌ Twilio error:', error);
    },
  });

  // Connect to room when call is accepted
  useEffect(() => {
    if (callStatus === 'connected' && twilioToken && roomName) {
      connectToRoom();
    }
  }, [callStatus, twilioToken, roomName]);

  // Disconnect when call ends
  useEffect(() => {
    if (callStatus === 'ended') {
      disconnect();
    }
  }, [callStatus]);

  // Sync mute state
  useEffect(() => {
    setIsMuted(twilioMuted);
  }, [twilioMuted]);

  // Timer for active call
  useEffect(() => {
    let interval: any;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else if (callStatus === 'ended' || callStatus === 'incoming' || callStatus === 'ringing') {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [callStatus]);

  // Reset duration when call starts ringing
  useEffect(() => {
    if (callStatus === 'ringing' || callStatus === 'incoming') {
      setCallDuration(0);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMute = () => {
    toggleMute();
    setIsMuted(!isMuted);
  };

  const handleSpeaker = () => {
    toggleSpeaker();
    setIsSpeakerOn(!isSpeakerOn);
  };

  // Render Incoming Call UI
  const renderIncomingCall = () => {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            {callerImage ? (
              <Image source={{ uri: callerImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{callerName?.charAt(0) || '?'}</Text>
              </View>
            )}
          </View>
          <Text style={styles.callerName}>{callerName || 'Unknown Caller'}</Text>
          <Text style={styles.callStatus}>
            {callStatus === 'ringing' ? 'Calling...' : 'Incoming Call...'}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={onReject}>
              <Icon name="call-outline" size={32} color="#fff" />
            </TouchableOpacity>
            {callStatus === 'incoming' && (
              <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={onAccept}>
                <Icon name="call" size={32} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Render Active Call UI
  const renderActiveCall = () => {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            {callerImage ? (
              <Image source={{ uri: callerImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{callerName?.charAt(0) || '?'}</Text>
              </View>
            )}
          </View>
          <Text style={styles.callerName}>{callerName || 'Unknown Caller'}</Text>
          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Call Duration</Text>
            <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
          </View>
          <Text style={styles.connectionStatus}>
            {isConnected ? '🔊 Call connected' : '🔇 Connecting...'}
          </Text>
          <View style={styles.controlContainer}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.activeControl]}
              onPress={handleMute}
            >
              <Icon name={isMuted ? 'mic-off' : 'mic'} size={24} color="#fff" />
              <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, isSpeakerOn && styles.activeControl]}
              onPress={handleSpeaker}
            >
              <Icon name={isSpeakerOn ? 'volume-high' : 'volume-off'} size={24} color="#fff" />
              <Text style={styles.controlLabel}>{isSpeakerOn ? 'Speaker' : 'Earpiece'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.endCallButton} onPress={onEnd}>
            <Icon name="call-outline" size={28} color="#fff" />
            <Text style={styles.endCallText}>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render Call Ended UI
  const renderCallEnded = () => {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.endedIconContainer}>
            <Icon name="call-outline" size={48} color="#666" />
          </View>
          <Text style={styles.endedTitle}>Call Ended</Text>
          <Text style={styles.endedDuration}>Duration: {formatDuration(callDuration)}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (callStatus === 'incoming' || callStatus === 'ringing') {
      return renderIncomingCall();
    }
    if (callStatus === 'connected') {
      return renderActiveCall();
    }
    if (callStatus === 'ended') {
      return renderCallEnded();
    }
    return null;
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>{renderContent()}</SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#d4af37',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  callStatus: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  durationLabel: {
    fontSize: 14,
    color: '#999',
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  connectionStatus: {
    fontSize: 12,
    color: '#666',
    marginBottom: 30,
  },
  controlContainer: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControl: {
    backgroundColor: '#d4af37',
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  endCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
  },
  endCallText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  endedIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  endedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  endedDuration: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
  },
  closeButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CallModal;