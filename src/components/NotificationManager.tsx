// src/components/NotificationManager.tsx
import React, { useEffect } from 'react';
import { useFCMToken, setupNotificationListeners } from '../hooks/useFCMToken';

export const NotificationManager: React.FC = () => {
  const { fcmToken, permissionGranted } = useFCMToken();

  useEffect(() => {
    const unsubscribe = setupNotificationListeners();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (fcmToken) {
      console.log('✅ App is ready with FCM token:', fcmToken);
    }
  }, [fcmToken]);

  return null;
};