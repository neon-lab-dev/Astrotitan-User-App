/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useLazyGetMeQuery } from '../../../redux/features/auth/authApi';
import { useGetAstrologersQuery } from '../../../redux/features/astrologer/astrologerApi';
import { useGetBlogsQuery } from '../../../redux/features/blog/blogApi';
import { useGetAllProductsQuery } from '../../../redux/features/product/productsApi';
import { useGetAllPujasQuery } from '../../../redux/features/puja/pujaApi';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import { SansText } from '../../../components/reusable/Text/SansText';
import SectionTitle from '../../../components/reusable/SectionTitle/SectionTitle';
import ContentSection from '../../../components/reusable/ContentSectoin/ContentSection';
import { updateUser } from '../../../redux/features/auth/authSlice';
import { Storage } from '../../../services/storage/storage';
import FeatureCard from '../../../components/tabs/home/home/FeatureCard/FeatureCard';
import ExpertCardSkeleton from '../../../components/tabs/home/home/ExpertCard/ExpertCardSkeleton';
import ExpertCard from '../../../components/tabs/home/home/ExpertCard/ExpertCard';
import GemCardSkeleton from '../../../components/tabs/home/home/GemCard/GemCardSkeleton';
import GemCard from '../../../components/tabs/home/home/GemCard/GemCard';
import FeatureCardSkeleton from '../../../components/tabs/home/home/FeatureCard/FeatureCardSkeleton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from './../../../components/shared/AppHeader/AppHeader';
const HomeScreen = () => {

  const [refreshing, setRefreshing] = useState(false);
  const [getMe] = useLazyGetMeQuery();
  const dispatch = useDispatch();
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
 
  const {
    data: astrologersResponse,
    isLoading: astrologersLoading,
    refetch: refetchAstrologers,
    isFetching: astrologerFetching,
  } = useGetAstrologersQuery(
    {
      isIdentityVerified: true,
      country: '',
      gender: '',
      skip: 0,
      limit: 10,
      areaOfPractice: '',
      consultLanguages: '',
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );
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
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useGetAllProductsQuery({
    limit: 20,
    skip: 0,
  });

  const {
    data: pujasResponse,
    isLoading: isPujasLoading,
    isFetching: isPujasFetching,
  } = useGetAllPujasQuery({
    limit: 20,
    skip: 0,
  });
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
  const astrologers = astrologersResponse?.data?.astrologers || [];
  const blogs = blogsResponse?.data?.data || [];
  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);

      await Promise.all([
        refetchAstrologers().unwrap(),

        refetchBlogs().unwrap(),
      ]);
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetchAstrologers, refetchBlogs]);

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
          <AppHeader/>

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

            {/* HOROSCOPE */}

            <View
              style={{
                gap: 12,
                paddingHorizontal: 16,
              }}
            >
              <ContentSection title="Daily Horoscope">
                <SansText>
                  A quick overview of how today’s planetary positions may
                  influence your day.
                </SansText>
              </ContentSection>

              <FeatureCard
                title="Today's Cosmic Pulse"
                description="Tap to select your zodiac sign and reveal today’s guidance."
                ctaText="Reveal Today’s Insight"
                image={require('@/assets/images/consmos1.png')}
                onPress={() => navigation.navigate('SelectZodiacSign')}
                date={new Date()}
              />
            </View>

            {/* KUNDLI */}

            <View
              style={{
                gap: 12,
                paddingHorizontal: 16,
              }}
            >
              <ContentSection title="Kundli">
                <SansText>
                  A short insight from your birth chart based on today’s
                  planetary movement.
                </SansText>
              </ContentSection>

              <FeatureCard
                title="Today’s Chart Insight"
                description="Saturn influences discipline & patience."
                image={require('@/assets/images/consmos2.png')}
                onPress={() => {
                  navigation.getParent()?.navigate('KundaliTab');
                }}
                height={214}
              />
            </View>

            {/* ASTROLOGERS */}

            {!astrologersLoading &&
              !astrologerFetching &&
              astrologers.length !== 0 && (
                <View style={{ gap: 12 }}>
                  <View
                    style={{
                      paddingHorizontal: 16,
                    }}
                  >
                    <ContentSection title="Featured Astrologers">
                      <SansText>
                        Verified experts who help interpret charts and planetary
                        periods.
                      </SansText>
                    </ContentSection>
                  </View>

                  {astrologersLoading || astrologerFetching ? (
                    <FlatList
                      data={[1, 2, 3]}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingHorizontal: 16,
                      }}
                      ItemSeparatorComponent={() => (
                        <View
                          style={{
                            width: 12,
                          }}
                        />
                      )}
                      renderItem={() => <ExpertCardSkeleton />}
                    />
                  ) : (
                    <FlatList
                      data={astrologers}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={item => item._id}
                      contentContainerStyle={{
                        paddingHorizontal: 16,
                      }}
                      ItemSeparatorComponent={() => (
                        <View
                          style={{
                            width: 12,
                          }}
                        />
                      )}
                      renderItem={({ item }) => (
                        <ExpertCard
                          _id={item._id}
                          name={
                            item?.displayName ||
                            `${item?.firstName || ''} ${item?.lastName || ''}`
                          }
                          experience={item?.experience || '0'}
                          description={item?.bio || 'Experienced astrologer'}
                          tags={item?.areaOfPractice || []}
                          rating={item?.rating || 4.5}
                          image={{
                            uri: item?.profilePicture,
                          }}
                        />
                      )}
                    />
                  )}
                </View>
              )}

            {/* GEMS */}

            {!isProductsLoading &&
              !isProductsFetching &&
              !isPujasFetching &&
              !isPujasLoading &&
              combinedItems.length !== 0 && (
                <View style={{ gap: 12 }}>
                  <View
                    style={{
                      paddingHorizontal: 16,
                    }}
                  >
                    <ContentSection title="Recommended Remedies">
                      <SansText>
                        Spiritual tools recommended based on planetary alignment
                        and energies.
                      </SansText>
                    </ContentSection>
                  </View>
                  {isProductsLoading ||
                  isProductsFetching ||
                  isPujasFetching ||
                  isPujasLoading ? (
                    <FlatList
                      data={[1, 2, 3]}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingHorizontal: 16,
                        marginTop: 34,
                      }}
                      ItemSeparatorComponent={() => (
                        <View
                          style={{
                            width: 12,
                          }}
                        />
                      )}
                      renderItem={() => <GemCardSkeleton />}
                    />
                  ) : (
                    <FlatList
                      data={combinedItems}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={item => item.id}
                      contentContainerStyle={{
                        paddingHorizontal: 16,
                        marginTop: 30,
                      }}
                      ItemSeparatorComponent={() => (
                        <View
                          style={{
                            width: 12,
                          }}
                        />
                      )}
                      renderItem={({ item }) => (
                        <GemCard
                          title={item.title}
                          description={item.description}
                          variant={
                            item.type === 'product' ? 'product' : 'pooja'
                          }
                          id={item.id}
                          image={item.image}
                        />
                      )}
                    />
                  )}
                </View>
              )}

            {/* BLOGS */}

            <View
              style={{
                gap: 12,
                paddingHorizontal: 16,
              }}
            >
              <ContentSection title="Blog Insights">
                <SansText>
                  Short reads to help you understand ongoing planetary themes.
                </SansText>
              </ContentSection>

              {blogsLoading || blogFetching ? (
                <FlatList
                  data={[1, 2]}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 16,
                  }}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        width: 12,
                      }}
                    />
                  )}
                  renderItem={() => <FeatureCardSkeleton />}
                />
              ) : blogs?.length > 0 ? (
                blogs?.map((blog: any) => (
                  <FeatureCard
                    key={blog._id}
                    title={blog?.title || 'Untitled Blog'}
                    description={blog?.content?.slice(0, 30) + '...'}
                    image={{
                      uri: blog?.thumbnail,
                    }}
                    date={new Date(blog?.createdAt)}
                    ctaText="Read Article"
                    height={194}
                    onPress={() =>
                      navigation.navigate('ArticleScreen', { id: blog?._id })
                    }
                  />
                ))
              ) : (
                <SansText>No blogs available</SansText>
              )}
            </View>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default HomeScreen;
