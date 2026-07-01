// src/hooks/useFCMToken.ts
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
// ✅ Import modular Firebase APIs
import { firebase } from '@react-native-firebase/app';
import { 
  getMessaging, 
  requestPermission, 
  getToken, 
  onMessage,
  onTokenRefresh,
  hasPermission,
  deleteToken
} from '@react-native-firebase/messaging';
import { useUpdatePushTokenMutation } from '../redux/features/auth/authApi';

// ✅ Get the Firebase app instance
const app = firebase.app();

export const useFCMToken = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [updatePushToken] = useUpdatePushTokenMutation();

  // ✅ Request user permission for notifications (Modular API)
  const requestUserPermission = async (): Promise<boolean> => {
    try {
      const messaging = getMessaging(app);
      const authStatus = await requestPermission(messaging);
      
      const enabled =
        authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('✅ Notification permission granted');
        setPermissionGranted(true);
      } else {
        console.log('❌ Notification permission not granted');
        setPermissionGranted(false);
      }
      return enabled;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  // ✅ Get FCM token and send to backend (Modular API)
  const getAndRegisterToken = async () => {
    try {
      const messaging = getMessaging(app);
      const token = await getToken(messaging);
      
      if (token) {
        console.log('📱 FCM Token:', token);
        setFcmToken(token);
        
        // ✅ Send token to backend
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

  // ✅ Handle token refresh (Modular API)
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

  // ✅ Setup notification channels (Android only)
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

  // ✅ Main setup on component mount
  useEffect(() => {
    const setup = async () => {
      const granted = await requestUserPermission();
      
      if (granted) {
        await setupNotificationChannels();
        await getAndRegisterToken();
        const unsubscribeRefresh = setupTokenRefreshListener();
        return unsubscribeRefresh;
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

  return {
    fcmToken,
    permissionGranted,
    refreshToken: getAndRegisterToken,
  };
};

// ✅ Setup notification listeners (Modular API)
export const setupNotificationListeners = () => {
  const messaging = getMessaging(app);

  // ✅ Create notification channel for Android
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

  // ✅ Foreground message handler (Modular API)
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

  // ✅ Background message handler (Modular API)
  const backgroundHandler = async (remoteMessage: any) => {
    console.log('📨 Message handled in the background:', remoteMessage);
    if (remoteMessage.data) {
      console.log('📊 Background message data:', remoteMessage.data);
    }
  };

  // Set background handler
  // Note: This should be set at app level, not component level
  // For React Native, you should set this in index.js or a separate file
  
  // ✅ iOS specific - Handle notification tap
  const handleNotificationTap = async () => {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log('App opened from notification:', initialNotification);
    }
  };
  handleNotificationTap();

  return unsubscribeForeground;
};

// ✅ Helper: Check if notification permission is granted (Modular API)
export const checkNotificationPermission = async () => {
  try {
    const messaging = getMessaging(app);
    const authStatus = await hasPermission(messaging);
    return (
      authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

// ✅ Helper: Delete FCM token (for logout) (Modular API)
export const deleteFCMToken = async () => {
  try {
    const messaging = getMessaging(app);
    await deleteToken(messaging);
    console.log('✅ FCM token deleted');
  } catch (error) {
    console.error('Error deleting FCM token:', error);
  }
};