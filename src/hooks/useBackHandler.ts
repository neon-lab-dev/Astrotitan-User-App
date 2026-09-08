// src/hooks/useBackHandler.ts
import { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useBackHandler = (shouldHandle: boolean = true) => {
  const navigation = useNavigation();
  const backPressedOnce = useRef(false);
  const timeoutRef = useRef<any | null>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // If we shouldn't handle back press (not on home screen)
        if (!shouldHandle) {
          return false;
        }

        // Check if we can go back in navigation
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }

        // Handle exit app logic
        if (backPressedOnce.current) {
          // Exit the app
          BackHandler.exitApp();
          return true;
        } else {
          // Show toast message
          if (Platform.OS === 'android') {
            ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          } else {
            Alert.alert('Exit', 'Press back again to exit');
          }
          
          backPressedOnce.current = true;

          // Reset back pressed state after 2 seconds
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            backPressedOnce.current = false;
          }, 2000);

          return true;
        }
      }
    );

    return () => {
      backHandler.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigation, shouldHandle]);
};