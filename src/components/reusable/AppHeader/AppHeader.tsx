/* eslint-disable react-native/no-inline-styles */

import React, { useCallback, useEffect } from 'react';
import {
  BackHandler,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { SansText } from '../Text/SansText';
type Props = {
  showBack?: boolean;
  onPressBack?: () => void;
  showStep?: boolean;
  step?: number;
  totalSteps?: number;
  title?: string;
  description?: string;
};

const AppHeader = ({
  showBack = true,
  onPressBack,
  step,
  totalSteps,
  showStep=true,
  title,
  description,
}: Props) => {
  const navigation = useNavigation();

  const handleBack = useCallback(() => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }

    return true;
  }, [onPressBack, navigation]);

  // 🔥 SYSTEM BACK CONTROL
  useEffect(() => {
    if (!showBack) return;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => subscription.remove();
  }, [showBack, handleBack]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View
        style={[
          styles.container,
          {
            backgroundColor: '#715700',
            borderBottomWidth: 1,
            borderBottomColor: '#EDDEAD',
          },
        ]}
      >
        <View style={styles.backRow}>
          <TouchableOpacity
            onPress={() => {
              if (handleBack) {
                handleBack();
              } else {
                navigation.goBack();
              }
            }}
            style={{ padding: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fcfcfc" />
          </TouchableOpacity>

          {/* TEXT */}
          {showStep && (
            <SansText style={styles.text}>
              <SansText style={styles.bold}>Step {step && step + 1} </SansText>{' '}
              of {totalSteps}
            </SansText>
          )}
        </View>

        {/*CONTENT BELOW */}
        <Text style={styles.title}>{title}</Text>
        <SansText
          style={{
            fontSize: 16,
            color: '#d5d5d5',
          }}
        >
          {description}
        </SansText>
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  mainContainer: { backgroundColor: '#FFFFFF' },
  container: {
    backgroundColor: '#EDDEAD',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingVertical: 13,
  },

  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  title: {
    fontFamily: 'Satoshi-Medium',
    letterSpacing: -0.32,
    fontSize : 20,
    color: '#ffffff',
    marginBottom : 4,
  },

  text: {
    color: '#d5d5d5',
    fontSize: 14,
  },
  bold: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
  },

  childrenContainer: {
    justifyContent: 'space-between', // optional
  },
});
