import React, { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  /**
   * Safe area
   */
  const insets = useSafeAreaInsets();

  /**
   * User
   */
  const user = useSelector(selectUser) as any;

  /**
   * Notifications
   */
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data: myNotifications } = useGetMyNotificationsQuery({});

  /**
   * Sort notifications
   */
  useEffect(() => {
    if (myNotifications?.data) {
      const sorted = [...myNotifications.data].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setNotifications(sorted);
    }
  }, [myNotifications?.data]);

  /**
   * Socket for live notifications
   */
  useEffect(() => {
    if (!user?.account?._id) {
      console.log('⚠️ No user, skipping socket connection');

      return;
    }

    const socket = connectSocket(user.account._id);

    if (!socket) {
      console.error('❌ Failed to create socket');

      return;
    }

    const onConnect = () => {
      console.log('🔌 Socket connected:', socket.id);
    };

    const onNotification = (data: any) => {
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
      socket.off('connect', onConnect);

      socket.off('new-notification', onNotification);

      socket.off('onlineUsers', onOnlineUsers);

      disconnectSocket();
    };
  }, [user?.account?._id]);

  /**
   * Unread notification count
   */
  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;

  /**
   * Back handler
   */
  const handleBack = useCallback(() => {
    if (onPressBack) {
      onPressBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }

    return true;
  }, [onPressBack, navigation]);

  /**
   * Android hardware back
   */
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
    <>
      {/* =========================================
          STATUS BAR SAFE AREA
      ========================================== */}

      <View
        style={[
          styles.safeArea,
          {
            height: insets.top,
          },
        ]}
      />

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent
      />

      {/* =========================================
          ACTUAL APP BAR
      ========================================== */}

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
        {/* =====================================
            LEFT - BACK BUTTON
        ====================================== */}

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
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          /**
           * Placeholder keeps the title centered
           */
          <View style={styles.sidePlaceholder} />
        )}

        {/* =====================================
            CENTER - TITLE
        ====================================== */}

        {title ? (
          <View pointerEvents="none" style={styles.titleContainer}>
            <SatoshiText
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </SatoshiText>
          </View>
        ) : null}

        {/* =====================================
            RIGHT SIDE
        ====================================== */}

        {isNotificationIconVisible ? (
          <View style={styles.rightContainer}>
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
        ) : (
          /**
           * Keep right side width consistent
           * when notification is hidden.
           */
          <View style={styles.rightPlaceholder} />
        )}
      </View>
    </>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  /**
   * =========================================
   * STATUS BAR AREA
   * =========================================
   *
   * This area stays WHITE.
   *
   * The colored app bar starts BELOW this.
   */
  safeArea: {
    backgroundColor: '#FFFFFF',
  },

  /**
   * =========================================
   * ACTUAL APP BAR
   * =========================================
   */
  container: {
    position: 'relative',

    width: '100%',

    minHeight: 56,

    paddingHorizontal: 20,

    paddingVertical: 8,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  /**
   * =========================================
   * BACK BUTTON
   * =========================================
   */
  iconButton: {
    width: 40,

    height: 40,

    borderRadius: 20,

    justifyContent: 'center',

    alignItems: 'center',

    zIndex: 2,
  },

  /**
   * =========================================
   * LEFT PLACEHOLDER
   * =========================================
   */
  sidePlaceholder: {
    width: 40,

    height: 40,
  },

  /**
   * =========================================
   * CENTER TITLE
   * =========================================
   */
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

    color: '#FEFCFC',

    textAlign: 'center',
  },

  /**
   * =========================================
   * RIGHT SIDE
   * =========================================
   */
  rightContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    zIndex: 2,
  },

  /**
   * Keeps layout consistent when
   * notification icon is hidden.
   */
  rightPlaceholder: {
    width: 40,

    height: 40,
  },
});
