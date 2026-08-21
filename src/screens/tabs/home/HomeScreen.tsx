/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useLazyGetMeQuery } from '../../../redux/features/auth/authApi';
import { useGetBlogsQuery } from '../../../redux/features/blog/blogApi';
import { useGetAllProductsQuery } from '../../../redux/features/product/productsApi';
import { useGetAllPujasQuery } from '../../../redux/features/puja/pujaApi';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import SectionTitle from '../../../components/reusable/SectionTitle/SectionTitle';
import { updateUser } from '../../../redux/features/auth/authSlice';
import { Storage } from '../../../services/storage/storage';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from './../../../components/shared/AppHeader/AppHeader';
import DailyHoroscope from '../../../components/HomePage/DailyHoroscope/DailyHoroscope';
import Kundli from '../../../components/HomePage/Kundli/Kundli';
import FeaturedAstrologers from '../../../components/HomePage/FeaturedAstrologers/FeaturedAstrologers';
import RecommendedRemedies from '../../../components/HomePage/RecommendedRemedies/RecommendedRemedies';
import BlogInsights from '../../../components/HomePage/BlogInsights/BlogInsights';
import { useGetAllAstrologersQuery } from '../../../redux/features/astrologer/astrologerApi';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [getMe] = useLazyGetMeQuery();
  const dispatch = useDispatch();

  // Astrologer api call
  const {
    data: astrologersResponse,
    isLoading: astrologersLoading,
    refetch: refetchAstrologers,
    isFetching: astrologerFetching,
  } = useGetAllAstrologersQuery(
    {
      skip: 0,
      limit: 10,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Blog api call
  const {
    data: blogsResponse,
    isLoading: blogsLoading,
    refetch: refetchBlogs,
    isFetching: blogFetching,
  } = useGetBlogsQuery(
    {
      skip: 0,
      limit: 5,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Puja api call
  const {
    data: pujasResponse,
    isLoading: isPujasLoading,
    isFetching: isPujasFetching,
    refetch: refetchPujas,
  } = useGetAllPujasQuery(
    {
      limit: 20,
      skip: 0,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Product api call
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    refetch: refetchProducts,
  } = useGetAllProductsQuery(
    {
      limit: 20,
      skip: 0,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const pujas = pujasResponse?.data?.pujas || [];
  const products = productsResponse?.data?.data || [];

  const combinedItems = [
    ...(Array.isArray(pujas)
      ? pujas.map((puja: any) => ({
          id: puja?._id,
          type: 'puja',
          title: puja?.name ?? '',
          description: puja?.description ?? '',
          image: puja?.imageUrls?.[0],
        }))
      : []),

    ...(Array.isArray(products)
      ? products.map((product: any) => ({
          id: product?._id,
          type: 'product',
          title: product?.name ?? '',
          description: product?.description ?? '',
          image: product?.imageUrls?.[0],
        }))
      : []),
  ];

  // Refresh data
  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);

      await Promise.all([
        refetchAstrologers().unwrap(),
        refetchBlogs().unwrap(),
        refetchPujas().unwrap(),
        refetchProducts().unwrap(),
      ]);
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, [
    refreshing,
    refetchAstrologers,
    refetchBlogs,
    refetchPujas,
    refetchProducts,
  ]);

  const fetchLatestUser = useCallback(async () => {
    try {
      const meRes = await getMe({}).unwrap();
      const finalUser = meRes.data;
      await Storage.setUser(finalUser);
      dispatch(updateUser(finalUser));
    } catch (error) {
      console.log('GET ME ERROR:', error);
    }
  }, [getMe, dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchLatestUser();
    }, [fetchLatestUser]),
  );

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#816B22"
              colors={['#816B22']}
              progressBackgroundColor="#FBF7EB"
            />
          }
        >
          {/* HEADER */}
          <AppHeader />

          {/* CONTENT */}
          <View
            style={{
              paddingTop: 26,
              gap: 24,
              marginBottom: 40,
            }}
          >
            {/* TODAY */}
            <View
              style={{
                paddingHorizontal: 16,
              }}
            >
              <SectionTitle title="Today at a glance" />
            </View>

            <DailyHoroscope />
            <Kundli />
            <FeaturedAstrologers
              data={astrologersResponse?.data?.astrologers || []}
              isLoading={astrologersLoading || astrologerFetching}
            />
            <RecommendedRemedies
              isLoading={
                isPujasLoading ||
                isPujasFetching ||
                isProductsLoading ||
                isProductsFetching
              }
              data={combinedItems}
            />
            <BlogInsights
              isLoading={blogsLoading || blogFetching}
              data={blogsResponse?.data?.data || []}
            />
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default HomeScreen;
