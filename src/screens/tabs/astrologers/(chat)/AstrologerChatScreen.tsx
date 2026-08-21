import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';

// Redux
import { selectUser } from '../../../../redux/features/auth/authSlice';
import {
  addConsultationMessage,
  clearSelectedConsultation,
  selectCurrentParticipantId,
  selectSelectedConsultationMessages,
  selectSelectedParticipant,
  setSelectedConsultationMessages,
  updateConsultationMessageId,
} from '../../../../redux/features/consultation/consultationChatSlice';

// APIs & Hooks
import {
  useGetConsultationMessagesQuery,
  useMarkConsultationMessagesReadMutation,
} from '../../../../redux/features/consultation/consultationChatApi';
import { useEndConsultationSessionMutation } from '../../../../redux/features/consultation/consultationApi';
import { useConsultationSocket } from '../../../../socket/useConsultationSocket';
import ChatMessage from '../../../../components/ChatPage/ChatMessage/ChatMessage';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ChatSkeleton from '../../../../components/ChatPage/ChatSkeleton/ChatSkeleton';
import ChatHeader from '../../../../components/ChatPage/ChatHeader/ChatHeader';
import ChatInput from '../../../../components/ChatPage/ChatInput/ChatInput';

const AstrologerChatScreen = () => {
  const route = useRoute<any>();
  const {
    id: consultationId,
    profilePicture,
    name,
    consultationFor,
  } = route.params || {};

  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Refs
  const inputRef = useRef<TextInput>(null);
  const hasInitializedRef = useRef(false);
  const hasMarkedReadRef = useRef(false);
  const messagesRef = useRef<any[]>([]);

  // State
  const [message, setMessage] = useState('');

  // Redux Selectors
  const participant = useSelector(selectSelectedParticipant);
  const messages = useSelector(selectSelectedConsultationMessages);
  const currentParticipantId = useSelector(selectCurrentParticipantId);
  const currentUser = useSelector(selectUser) as any;

  // Hooks
  const {
    sendConsultationMessage,
    markConsultationMessagesRead,
    isConnected,
    socket,
  } = useConsultationSocket();

  const { data, isLoading, isFetching } = useGetConsultationMessagesQuery(
    consultationId,
    { skip: !consultationId }
  );

  const [markMessagesAsRead] = useMarkConsultationMessagesReadMutation();
  const [endConsultationSession, { isLoading: endSessionLoading }] =
    useEndConsultationSessionMutation();

  // Update ref when messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Initialize messages
  useEffect(() => {
    if (data?.data && consultationId && !hasInitializedRef.current) {
      dispatch(setSelectedConsultationMessages(data.data));
      hasInitializedRef.current = true;
    }
  }, [data, consultationId, dispatch]);

  // Reset refs on consultation change
  useEffect(() => {
    hasInitializedRef.current = false;
    hasMarkedReadRef.current = false;
  }, [consultationId]);

  // Mark messages as read
  useEffect(() => {
    if (consultationId && isConnected && !hasMarkedReadRef.current) {
      hasMarkedReadRef.current = true;
      markConsultationMessagesRead(consultationId);
      markMessagesAsRead(consultationId).catch(console.error);
    }
  }, [consultationId, isConnected, markConsultationMessagesRead, markMessagesAsRead]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (incomingMsg: any) => {
      if (incomingMsg.consultationId === consultationId) {
        dispatch(addConsultationMessage(incomingMsg));
      }
    };

    const handleMessageSent = (confirmation: any) => {
      if (
        confirmation.consultationId === consultationId &&
        confirmation.tempId
      ) {
        dispatch(
          updateConsultationMessageId({
            tempId: confirmation.tempId,
            realId: confirmation._id,
            createdAt: confirmation.createdAt,
          })
        );
      }
    };

    socket.on('receiveConsultationMessage', handleReceiveMessage);
    socket.on('consultationMessageSent', handleMessageSent);

    return () => {
      socket.off('receiveConsultationMessage', handleReceiveMessage);
      socket.off('consultationMessageSent', handleMessageSent);
    };
  }, [socket, consultationId, dispatch]);

  // Handlers
  const handleSendMessage = () => {
    if (!message.trim() || !consultationId || !participant || !currentUser || !isConnected) {
      console.warn('⚠️ Cannot send message');
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const messageData = {
      _id: tempId,
      consultationId,
      sender: currentUser?.account?._id,
      receiver: participant._id,
      content: message.trim(),
      tempId,
    };

    // Optimistically add to UI
    dispatch(
      addConsultationMessage({
        ...messageData,
        _id: tempId,
        isTemp: true,
        isRead: false,
        status: 'sent',
        createdAt: new Date().toISOString(),
      })
    );

    // Send via socket
    const sent = sendConsultationMessage(messageData);
    if (sent) {
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleEndSession = async () => {
    try {
      const response = await endConsultationSession(consultationId).unwrap();
      if (response?.success) {
        dispatch(clearSelectedConsultation());
        navigation.navigate('AstrologerScreen');
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  // Render message
  const renderMessage = ({ item }: { item: any }) => {
    const senderId = typeof item.sender === 'string' ? item.sender : item.sender?._id;
    const isOwn = senderId === currentUser?.account?._id;

    return <ChatMessage item={item} isOwn={isOwn} />;
  };

  // Show skeleton while loading
  if (isLoading || isFetching) {
    return (
      <AnimatedScreen>
        <ChatSkeleton />
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        {/* Header */}
        <ChatHeader
          profilePicture={profilePicture}
          name={name}
          consultationFor={consultationFor}
          onEndSession={handleEndSession}
          isLoading={endSessionLoading}
        />

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item?._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSend={handleSendMessage}
          inputRef={inputRef as any}
        />
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2E3',
  },
  chatContainer: {
    padding: 14,
    paddingBottom: 20,
  },
});

export default AstrologerChatScreen;