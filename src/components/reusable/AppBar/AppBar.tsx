/* eslint-disable react-native/no-inline-styles */

import React, { useCallback, useEffect, useState } from 'react';
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

import NotificationIcon from '@/assets/icons/navigation/notifications.svg';
import { SatoshiText } from '../Text/SatoshiText';
import { IconName } from '../../../assets/svg';
import IconButton from '../IconButton/IconButton';
import { useGetMyNotificationsQuery } from '../../../redux/features/notification/notificationApi';
import { connectSocket, disconnectSocket } from '../../../socket/socket';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/features/auth/authSlice';

type Props = {
  showBack?: boolean;
  onPressBack?: () => void;

  title?: string;

  backgroundColor?: string;
  showBorder?: boolean;
  borderColor?: string;
  showRightIcon?: boolean;
  rightIcon?: IconName;
  rightIconSize?: number;
  onPressRightIcon?: () => void;
  children?: React.ReactNode;
  isNotificationIconVisible?: boolean;
};

const AppBar = ({
  showBack = true,
  onPressBack,

  title,

  backgroundColor = '#715700',
  showBorder = true,
  borderColor = '#E6D18B',
  isNotificationIconVisible = true,
  children,
}: Props) => {
  const navigation = useNavigation<any>();
const user = useSelector(selectUser) as any;
  const [notifications, setNotifications] = useState<any[]>([]);
  const { data: myNotifications } = useGetMyNotificationsQuery({});

    useEffect(() => {
      if (myNotifications?.data) {
        const sorted = [...myNotifications.data].sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setNotifications(sorted);
      }
    }, [myNotifications?.data]);
  
    // --- Socket for live notifications ---
    useEffect(() => {
      if (!user?.account?._id) {
        console.log('⚠️ No user, skipping socket connection');
        return;
      }
  
      // console.log("🔌 Connecting socket for user:", user?.account?._id);
  
      const socket = connectSocket(user?.account?._id);
      // console.log("📡 Socket instance:", socket);
      // console.log("📡 Socket connected:", socket?.connected);
  
      if (!socket) {
        console.error('❌ Failed to create socket');
        return;
      }
  
      const onConnect = () => {
        console.log('🔌 Socket connected:', socket.id);
      };
  
      const onNotification = (data: any) => {
        // console.log("🔔 New notification:", data);
        setNotifications(prev => [data, ...prev]);
      };
  
      const onOnlineUsers = (users: string[]) => {
        console.log('👥 Online users:', users);
      };
  
      socket.on('connect', onConnect);
      socket.on('new-notification', onNotification);
      socket.on('onlineUsers', onOnlineUsers);
  
      if (socket.connected) {
        console.log('Socket already connected:', socket.id);
      }
  
      return () => {
        // console.log("🧹 Cleaning up socket listeners");
        socket.off('connect', onConnect);
        socket.off('new-notification', onNotification);
        socket.off('onlineUsers', onOnlineUsers);
        disconnectSocket();
      };
    }, [user?.account?._id]);


  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;


  const handleBack = useCallback(() => {
    if (onPressBack) {
      onPressBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }

    return true;
  }, [onPressBack, navigation]);
  useEffect(() => {
    if (!showBack) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => {
      subscription.remove();
    };
  }, [showBack, handleBack]);

  return (
    <SafeAreaView
      style={[
        styles.mainContainer,
        {
          backgroundColor,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

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
        {/* -------------------------------- */}
        {/* LEFT - BACK BUTTON */}
        {/* -------------------------------- */}
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.iconButton}
            activeOpacity={0.7}
            hitSlop={{
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          /*
           * Keeps the title centered when
           * the back button is hidden.
           */
          <View style={styles.sidePlaceholder} />
        )}

        {/* -------------------------------- */}
        {/* CENTER - TITLE */}
        {/* -------------------------------- */}
        {title ? (
          <View pointerEvents="none" style={styles.titleContainer}>
            <SatoshiText style={styles.title}>{title}</SatoshiText>
          </View>
        ) : null}

        {
          isNotificationIconVisible && 
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <IconButton
            size={35}
            Icon={NotificationIcon}
            iconColor="#0D0D0D"
            onPress={() => {
              navigation.navigate('NotificationScreen');
            }}
            update={unreadCount > 0}
            updateCount={unreadCount}
          />
          {children && <View>{children}</View>}
        </View>
        }
      </View>
    </SafeAreaView>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },

  // --------------------------------
  // APP BAR
  // --------------------------------
  container: {
    position: 'relative',

    width: '100%',

    paddingHorizontal: 20,
    paddingVertical: 8,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // --------------------------------
  // LEFT / RIGHT ICON BUTTON
  // --------------------------------
  iconButton: {
    width: 20,
    height: 20,

    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 2,
  },

  // --------------------------------
  // PLACEHOLDER
  // --------------------------------
  sidePlaceholder: {
    width: 40,
    height: 40,
  },

  // --------------------------------
  // CENTER TITLE
  // --------------------------------
  titleContainer: {
    position: 'absolute',

    left: 0,
    right: 0,

    top: 0,
    bottom: 0,

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 1,

    paddingHorizontal: 70,
  },

  title: {
    fontSize: 18,
    lineHeight: 28,

    fontFamily: 'Satoshi-Medium',

    letterSpacing: -0.32,

    color: '#fefcfc',

    textAlign: 'center',
  },
});
