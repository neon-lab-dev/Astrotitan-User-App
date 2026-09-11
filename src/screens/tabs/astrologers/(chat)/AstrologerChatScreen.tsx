import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
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
import { SansText } from '../../../../components/reusable/Text/SansText';

const AstrologerChatScreen = () => {
  const route = useRoute<any>();
  const {
    id: consultationId,
    profilePicture,
    name,
    consultationFor,
  } = route.params || {};

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Refs
  const inputRef = useRef<TextInput>(null);
  const hasInitializedRef = useRef(false);
  const hasMarkedReadRef = useRef(false);
  const messagesRef = useRef<any[]>([]);
  const flatListRef = useRef<FlatList>(null);

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

  const { data, isLoading, refetch } = useGetConsultationMessagesQuery(
    consultationId,
    { skip: !consultationId },
  );

  useFocusEffect(
    useCallback(() => {
      if (consultationId) {
        refetch();
      }
    }, [consultationId, refetch]),
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
  }, [
    consultationId,
    isConnected,
    markConsultationMessagesRead,
    markMessagesAsRead,
  ]);

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
          }),
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
    if (
      !message.trim() ||
      !consultationId ||
      !participant ||
      !currentUser ||
      !isConnected
    ) {
      console.warn('⚠️ Cannot send message');
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)}`;

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
      }),
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
      dispatch(clearSelectedConsultation());
      navigation.navigate('SessionDetails', {
        id: consultationId,
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  // Render message
  const renderMessage = ({ item }: { item: any }) => {
    const senderId =
      typeof item.sender === 'string' ? item.sender : item.sender?._id;
    const isOwn = senderId === currentUser?.account?._id;

    return <ChatMessage item={item} isOwn={isOwn} />;
  };

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);

      await Promise.all([refetch().unwrap()]);
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetch]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }
  }, [messages.length]);

  if (isLoading) {
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
          handleEndSession={handleEndSession}
          isLoading={endSessionLoading}
        />

        {/* Messages */}
        <View style={styles.container}>
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <SansText style={styles.emptyText}>No messages yet</SansText>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item?._id}
              renderItem={renderMessage}
              contentContainerStyle={styles.chatContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#816B22"
                  colors={['#816B22']}
                  progressBackgroundColor="#FBF7EB"
                />
              }
            />
          )}
        </View>

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
  emptyText: {
    fontSize: 16,
    color: '#272727',
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AstrologerChatScreen;
