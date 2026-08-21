import React, { RefObject } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import SentIcon from '@/assets/icons/actions/sent.svg';
import IconButton from '../../reusable/IconButton/IconButton';

type ChatInputProps = {
  message: string;
  setMessage: (text: string) => void;
  onSend: () => void;
  inputRef: RefObject<TextInput>;
};

const ChatInput = ({
  message,
  setMessage,
  onSend,
  inputRef,
}: ChatInputProps) => {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          placeholder="Type your question here..."
          placeholderTextColor="#9A9A9A"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Enter') {
              onSend();
            }
          }}
        />
      </View>

      <IconButton
        Icon={SentIcon}
        bgColor="#E6D18B"
        size={72}
        iconColor="#0D0D0D"
        onPress={onSend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#EDDEAD',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 14,
  },
  input: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'GeneralSans-Regular',
  },
});

export default ChatInput;
