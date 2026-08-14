/* eslint-disable react-native/no-inline-styles */

import React, { useCallback, useEffect } from 'react';
import {
  BackHandler,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
type Props = {
  showBack?: boolean;
  onPressBack?: () => void;

  backText?: React.ReactNode;
  backgroundColor?: string;
  showBorder?: boolean;
  borderColor?: string;

  children?: React.ReactNode;
};

const AppHeader = ({
  showBack = true,
  onPressBack,
  backText,
  backgroundColor = '#EDDEAD',
  showBorder = true,
  borderColor = '#E6D18B',
  children,
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
            backgroundColor,
            borderBottomWidth: showBorder ? 1 : 0,
            borderBottomColor: borderColor,
          },
        ]}
      >
        {/* 🔥 TOP ROW */}
        {showBack && (
          <View style={styles.backRow}>
            <TouchableOpacity
              onPress={() => {
                if (onPressBack) {
                  onPressBack();
                } else {
                  navigation.goBack();
                }
              }}
              style={{ padding: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color="#0D0D0D" />
            </TouchableOpacity>

            {/* TEXT */}
            <View style={{ flex: 1 }}>{backText}</View>
          </View>
        )}

        {/* 🔥 CONTENT BELOW */}
        <View style={styles.childrenContainer}>{children}</View>
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
    gap: 12,
  },

  childrenContainer: {
    justifyContent: 'space-between', // optional
  },
});
