// src/components/NotificationManager.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFCMToken, setupNotificationListeners } from '../hooks/useFCMToken';

export const NotificationManager: React.FC = () => {
  const { 
    fcmToken, 
    permissionGranted, 
    permissionDenied,
    isLoading,
    retryRequestPermission 
  } = useFCMToken();

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

  // Show permission request UI if permission is denied
  if (permissionDenied && !permissionGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📢 Enable Notifications</Text>
        <Text style={styles.message}>
          We need your permission to send you important updates about your consultations and bookings.
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={retryRequestPermission}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Requesting...' : 'Enable Notifications'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => {
            // Open device settings
            // You can implement this based on your navigation setup
          }}
        >
          <Text style={styles.secondaryButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Silent component when permission is granted
  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 999,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
});