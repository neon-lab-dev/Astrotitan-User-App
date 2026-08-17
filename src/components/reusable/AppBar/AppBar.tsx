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

import NotificationIcon from '@/assets/icons/navigation/notifications.svg';
import { SatoshiText } from '../Text/SatoshiText';
import { IconName } from '../../../assets/svg';
import IconButton from '../IconButton/IconButton';
import { useGetMyNotificationsQuery } from '../../../redux/features/notification/notificationApi';
import { NavigationProp } from '../../shared/AppHeader/AppHeader';

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
};

const AppBar = ({
  showBack = true,
  onPressBack,

  title,

  backgroundColor = '#EDDEAD',
  showBorder = true,
  borderColor = '#E6D18B',
  showRightIcon = true,
  children,
}: Props) => {

  const navigation = useNavigation<NavigationProp>();

  const { data: myNotifications } = useGetMyNotificationsQuery({});
  const unreadCount = myNotifications?.data?.filter(
    (notification: any) => !notification.isRead,
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
      />

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
            <Ionicons
              name="arrow-back"
              size={24}
              color="#0D0D0D"
            />
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
          <View
            pointerEvents="none"
            style={styles.titleContainer}
          >
            <SatoshiText style={styles.title}>
              {title}
            </SatoshiText>
          </View>
        ) : null}

        {children ? (
          <View >{children}</View>
        ) : (
          <IconButton
            Icon={NotificationIcon}
            iconColor="#0D0D0D"
            onPress={() => {
              navigation.navigate('NotificationScreen');
            }}
            update={unreadCount > 0}
            updateCount={unreadCount}
          />
        )}
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
    minHeight: 66,

    paddingHorizontal: 20,
    paddingVertical: 13,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // --------------------------------
  // LEFT / RIGHT ICON BUTTON
  // --------------------------------
  iconButton: {
    width: 40,
    height: 40,

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
    fontSize: 21,
    lineHeight: 28,

    fontFamily: 'Satoshi-Medium',

    letterSpacing: -0.32,

    color: '#0D0D0D',

    textAlign: 'center',
  },
});