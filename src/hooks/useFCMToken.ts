// src/hooks/useFCMToken.ts
import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
// Import modular Firebase APIs
import { firebase } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  onTokenRefresh,
  hasPermission,
  deleteToken,
  AuthorizationStatus
} from '@react-native-firebase/messaging';
import { useUpdatePushTokenMutation } from '../redux/features/auth/authApi';

// Get the Firebase app instance
const app = firebase.app();

export const useFCMToken = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatePushToken] = useUpdatePushTokenMutation();

  // Request user permission for notifications (Modular API)
  const requestUserPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const messaging = getMessaging(app);
      const authStatus = await requestPermission(messaging);

      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('✅ Notification permission granted');
        setPermissionGranted(true);
        setPermissionDenied(false);
        // Get token after permission is granted
        await getAndRegisterToken();
      } else {
        console.log('❌ Notification permission denied');
        setPermissionGranted(false);
        setPermissionDenied(true);
        // Show alert to user
        Alert.alert(
          'Notifications Disabled',
          'Please enable notifications in your device settings to receive important updates.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                // Open app settings
                if (Platform.OS === 'ios') {
                  // iOS - open settings
                  // You can use Linking.openURL('app-settings:')
                } else {
                  // Android - open settings
                  // You can use IntentLauncher
                }
              }
            }
          ]
        );
      }
      setIsLoading(false);
      return enabled;
    } catch (error) {
      console.error('Error requesting permission:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Get FCM token and send to backend (Modular API)
  const getAndRegisterToken = async () => {
    try {
      const messaging = getMessaging(app);
      const token = await getToken(messaging);

      if (token) {
        console.log('📱 FCM Token:', token);
        setFcmToken(token);

        // Send token to backend
        try {
          const payload = { pushToken: token };
          await updatePushToken(payload).unwrap();
          console.log('✅ Token sent to backend');
        } catch (error) {
          console.error('❌ Failed to send token to backend:', error);
        }
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  };

  // Handle token refresh (Modular API)
  const setupTokenRefreshListener = () => {
    const messaging = getMessaging(app);
    return onTokenRefresh(messaging, async (newToken) => {
      console.log('🔄 Token refreshed:', newToken);
      setFcmToken(newToken);

      // Send new token to backend
      try {
        const payload = { pushToken: newToken };
        await updatePushToken(payload).unwrap();
        console.log('✅ Refreshed token sent to backend');
      } catch (error) {
        console.error('❌ Failed to send refreshed token:', error);
      }
    });
  };

  // Setup notification channels (Android only)
  const setupNotificationChannels = async () => {
    if (Platform.OS === 'android') {
      try {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        });

        await notifee.createChannel({
          id: 'promotions',
          name: 'Promotions',
          importance: AndroidImportance.DEFAULT,
        });

        console.log('✅ Notification channels created');
      } catch (error) {
        console.error('Error creating notification channels:', error);
      }
    }
  };

  // Main setup on component mount
  useEffect(() => {
    const setup = async () => {
      // Check existing permission first
      const messaging = getMessaging(app);
      const existingPermission = await hasPermission(messaging);

      const isEnabled =
        existingPermission === AuthorizationStatus.AUTHORIZED ||
        existingPermission === AuthorizationStatus.PROVISIONAL;

      if (isEnabled) {
        console.log('✅ Permission already granted');
        setPermissionGranted(true);
        await setupNotificationChannels();
        await getAndRegisterToken();
        const unsubscribeRefresh = setupTokenRefreshListener();
        return unsubscribeRefresh;
      } else {
        // Permission not granted, ask for it
        console.log('⚠️ Permission not granted, requesting...');
        await requestUserPermission();
      }
    };

    const unsubscribe = setup();

    return () => {
      if (unsubscribe) {
        unsubscribe.then((unsub: any) => {
          if (unsub) unsub();
        });
      }
    };
  }, []);

  // Function to retry permission request (exposed to component)
  const retryRequestPermission = async () => {
    return await requestUserPermission();
  };

  return {
    fcmToken,
    permissionGranted,
    permissionDenied,
    isLoading,
    refreshToken: getAndRegisterToken,
    retryRequestPermission,
  };
};

// Setup notification listeners (Modular API)
export const setupNotificationListeners = () => {
  const messaging = getMessaging(app);

  // Create notification channel for Android
  const createChannel = async () => {
    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };
  createChannel();

  // Foreground message handler (Modular API)
  const unsubscribeForeground = onMessage(messaging, async (remoteMessage) => {
    console.log('📨 Message received in foreground:', remoteMessage);

    try {
      const title = remoteMessage.notification?.title || remoteMessage.data?.title || 'New Notification';
      const body = remoteMessage.notification?.body || remoteMessage.data?.body || 'You have a new notification';

      await notifee.displayNotification({
        title: title,
        body: body,
        data: remoteMessage.data || {},
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
          color: '#000000', // Black background
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Error displaying foreground notification:', error);
    }
  });

  // Handle notification tap
  const handleNotificationTap = async () => {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log('App opened from notification:', initialNotification);
    }
  };
  handleNotificationTap();

  return unsubscribeForeground;
};

// Helper: Check if notification permission is granted (Modular API)
export const checkNotificationPermission = async () => {
  try {
    const messaging = getMessaging(app);
    const authStatus = await hasPermission(messaging);
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

// Helper: Delete FCM token (for logout) (Modular API)
export const deleteFCMToken = async () => {
  try {
    const messaging = getMessaging(app);
    await deleteToken(messaging);
    console.log('FCM token deleted');
  } catch (error) {
    console.error('Error deleting FCM token:', error);
  }
};