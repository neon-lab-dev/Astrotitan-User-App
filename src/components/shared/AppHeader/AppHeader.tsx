/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import { SansText } from '../../reusable/Text/SansText';
import { getTimeBasedGreeting } from '../../../utils/greetings';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import IconButton from '../../reusable/IconButton/IconButton';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/features/auth/authSlice';
import CrownIcon from '@/assets/icons/navigation/crown.svg';
import NotificationIcon from '@/assets/icons/navigation/notifications.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useGetMyNotificationsQuery } from '../../../redux/features/notification/notificationApi';

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const AppHeader = () => {
  const user = useSelector(selectUser);
  const navigation = useNavigation<NavigationProp>();

  const { data: myNotifications } = useGetMyNotificationsQuery({});
  const unreadCount = myNotifications?.data?.filter(
    (notification: any) => !notification.isRead,
  ).length;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 16,
      }}
    >
      <View
        style={{
          flex: 1,
          gap: 3,
        }}
      >
        <SansText
          style={{
            fontSize: 12,
            color: '#4A4A4A',
          }}
        >
          {getTimeBasedGreeting()},
        </SansText>

        <SatoshiText
          style={{
            fontSize: 16,
            color: '#0D0D0D',
            fontFamily: 'Satoshi-Bold',
          }}
        >
          {user?.profile?.firstName} {user?.profile?.lastName}
        </SatoshiText>
      </View>

      {/* RIGHT */}

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <IconButton
          Icon={NotificationIcon}
          iconColor="#0D0D0D"
          onPress={() => {
            navigation.navigate('NotificationScreen');
          }}
          update={unreadCount > 0}
          updateCount={unreadCount}
        />

        <IconButton
          Icon={CrownIcon}
          iconColor="#0D0D0D"
          onPress={() => {
            navigation.navigate('SubscriptionScreen');
          }}
        />
      </View>
    </View>
  );
};

export default AppHeader;
