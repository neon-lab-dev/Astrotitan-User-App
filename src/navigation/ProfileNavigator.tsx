import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/tabs/profile/ProfileScreen';
import BirthDetails from '../screens/tabs/profile/birthDetails/BirthDetails';
import PersonalInformation from '../screens/tabs/profile/PersonalInformation';
import SubscriptionScreen from '../screens/tabs/profile/subscription/SubscriptionScreen';
import AddAddress from '../screens/tabs/profile/address/AddAddress';
import AddressScreen from '../screens/tabs/profile/address/AddressScreen';
import QueryDetails from '../screens/tabs/profile/query/QureriesDetails';
import RaiseQuery from '../screens/tabs/profile/query/RaiseQuery';
import RaiseQuerySuccess from '../screens/tabs/profile/query/RaiseQuerySuccess';
import Queries from '../screens/tabs/profile/query/Queries';
import OrdersScreen from '../screens/tabs/remedies/orders/OrdersScreen';
import AstrologerChatScreen from '../screens/tabs/astrologers/(chat)/AstrologerChatScreen';
import OrdersDetails from '../screens/tabs/remedies/orders/OrdersDetails';
import RequestedSessions from '../screens/tabs/astrologers/(chat)/RequestedSessions';
import SessionHistory from '../screens/tabs/astrologers/(chat)/SessionHistory';
import SessionDetails from '../screens/tabs/astrologers/(chat)/SessionDetails';

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

      {/* ARTICLE */}

      <Stack.Screen name="BirthDetails" component={BirthDetails} />

      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformation}
      />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="QueryDetails" component={QueryDetails} />
      <Stack.Screen name="Queries" component={Queries} />
      <Stack.Screen name="RaiseQuery" component={RaiseQuery} />
      <Stack.Screen name="RaiseQuerySuccess" component={RaiseQuerySuccess} />
      <Stack.Screen name="SessionHistory" component={SessionHistory} />
      <Stack.Screen name="SessionDetails" component={SessionDetails} />
      <Stack.Screen
        name="AstrologerChatScreen"
        component={AstrologerChatScreen}
      />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />

      <Stack.Screen name="OrdersDetails" component={OrdersDetails} />

      <Stack.Screen name="RequestedSessions" component={RequestedSessions} />
    </Stack.Navigator>
  );
}
