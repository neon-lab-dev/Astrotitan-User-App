/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SansText } from '../../reusable/Text/SansText';
import { formatMessageDate } from '../../../utils/validators/dateValidators';

type ChatMessageProps = {
  item: any;
  isOwn: boolean;
};

const ChatMessage = ({ item, isOwn }: ChatMessageProps) => {
  return (
    <View
      style={[
        styles.messageContainer,
        isOwn ? styles.userContainer : styles.receiverContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isOwn ? styles.userBubble : styles.receiverBubble,
        ]}
      >
        <SansText style={styles.messageText}>{item.content}</SansText>

        <View
          style={[
            styles.timeRow,
            isOwn
              ? { justifyContent: 'flex-end' }
              : { justifyContent: 'flex-start' },
          ]}
        >
          <SansText style={styles.time}>
            {formatMessageDate(item.createdAt)}{' '}
          </SansText>

          {item?.isTemp && (
            <SansText style={styles.sendingText}>⌛ Sending...</SansText>
          )}
          {isOwn && !item?.isTemp && item?.status === 'read' && (
            <SansText style={styles.readText}>✓✓ Read</SansText>
          )}
          {isOwn && !item?.isTemp && item?.status === 'sent' && (
            <SansText style={styles.sentText}>✓ Sent</SansText>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 24,
  },
  receiverContainer: {
    alignItems: 'flex-start',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  receiverBubble: {
    backgroundColor: '#E6D18B',
    borderColor: '#DBBD59',
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: '#FBF7EB',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  time: {
    fontSize: 10,
    color: '#777',
  },
  sendingText: {
    fontSize: 10,
    color: '#D4AF37',
  },
  readText: {
    fontSize: 10,
    color: '#22C55E',
  },
  sentText: {
    fontSize: 10,
    color: '#A3A3A3',
  },
});

export default ChatMessage;
