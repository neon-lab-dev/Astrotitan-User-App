/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';

import {SansText} from '../Text/SansText';

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
  showStep = true,
  title,
  description,
}: Props) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBack = useCallback(() => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }

    return true;
  }, [onPressBack, navigation]);

  useEffect(() => {
    if (!showBack) return;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => subscription.remove();
  }, [showBack, handleBack]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 13,
        },
      ]}>
      
      <StatusBar
        barStyle="light-content"
        backgroundColor="#715700"
      />

      <View style={styles.backRow}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}

        {showStep && (
          <SansText style={styles.text}>
            <SansText style={styles.bold}>
              Step {(step ?? 0) + 1}
            </SansText>{' '}
            of {totalSteps}
          </SansText>
        )}
      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      {!!description && (
        <SansText style={styles.description}>
          {description}
        </SansText>
      )}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#715700',

    paddingHorizontal: 20,
    paddingBottom: 13,

    borderBottomWidth: 1,
    borderBottomColor: '#EDDEAD',
  },

  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  backButton: {
    marginRight: 12,
  },

  title: {
    fontFamily: 'Satoshi-Medium',
    letterSpacing: -0.32,
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },

  description: {
    fontSize: 16,
    color: '#D5D5D5',
  },

  text: {
    color: '#D5D5D5',
    fontSize: 14,
  },

  bold: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
  },
});