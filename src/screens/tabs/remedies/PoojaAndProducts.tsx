/* eslint-disable react-native/no-inline-styles */
import CartIcon from '@/assets/icons/navigation/cart.svg';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, RefreshControl, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetAllProductsQuery } from '../../../redux/features/product/productsApi';
import { SansText } from '../../../components/reusable/Text/SansText';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import IconButton from '../../../components/reusable/IconButton/IconButton';
import { ICONS } from '../../../assets/svg';
import { useGetAllPujasQuery } from '../../../redux/features/puja/pujaApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { resetCheckout } from '../../../redux/features/checkout/checkoutSlice';
import AppBar from '../../../components/reusable/AppBar/AppBar';
import Products from '../../../components/PoojaAndProductsPage/Products/Products';
import Poojas from '../../../components/PoojaAndProductsPage/Poojas/Poojas';
import Tabs from '../../../components/reusable/Tabs/Tabs';

const PoojaAndProducts = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('store');
  const opacity = useRef(new Animated.Value(1)).current;
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      opacity.setValue(1); // Reset opacity when screen is focused
    }, [opacity]),
  );

  const cartItems = useSelector((state: RootState) => state.cart.items);

 const cartCount = cartItems.length;

  const StoreIcon = ICONS.StoreIcon;
  const PoojaIcon = ICONS.firePitInactive;

  const tabs = [
    {
      key: 'store',
      label: 'Products',
      icon: <StoreIcon width={22} height={22} />,
    },
    {
      key: 'pooja',
      label: 'Pooja',
      icon: <PoojaIcon width={22} height={22} />,
    },
  ];

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const {
    data: productsResponse,
    isLoading,
    isError,
    refetch: refetchProducts,
  } = useGetAllProductsQuery({
    limit: 20,
    skip: 0,
  });

  const {
    data: pujasResponse,
    isLoading: isPujasLoading,
    refetch: refetchPujas,
  } = useGetAllPujasQuery({
    limit: 20,
    skip: 0,
    category: selectedCategory,
  });

  const poojas = pujasResponse?.data?.pujas || [];

  const products = productsResponse?.data?.data || [];

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      await Promise.all([refetchProducts(), refetchPujas()]);
    } finally {
      setRefreshing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'store':
        return <Products products={products} isLoading={isLoading} />;

      case 'pooja':
        return (
          <Poojas
            poojas={poojas}
            isLoading={isPujasLoading}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );

      default:
        return null;
    }
  };

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SansText>Failed to load products</SansText>
      </View>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar
          title="Pooja & Products"
          children={
            <IconButton
              Icon={CartIcon}
              iconColor="#0D0D0D"
              update={true}
              updateCount={cartCount}
              onPress={() => {
                dispatch(resetCheckout());
                navigation.navigate('CartScreen');
              }}
            />
          }
        />

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D4AF37"
              colors={['#D4AF37']}
              progressBackgroundColor="#FBF7EB"
            />
          }
        >
          <Animated.View
            style={{
              flex: 1,
              opacity,
            }}
          >
            {renderContent()}
          </Animated.View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default PoojaAndProducts;
