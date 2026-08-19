/* eslint-disable react-native/no-inline-styles */
import StarIcon from '@/assets/icons/visual/star.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import {
  useGetAllProductsQuery,
  useGetSingleProductByIdQuery,
} from '../../../../redux/features/product/productsApi';
import { RootState } from '../../../../redux/store';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import { SansText } from '../../../../components/reusable/Text/SansText';
import { SatoshiText } from '../../../../components/reusable/Text/SatoshiText';
import Ionicons from '@react-native-vector-icons/ionicons';
import { IconName, ICONS } from '../../../../assets/svg';
import ContentSection from '../../../../components/reusable/ContentSectoin/ContentSection';
import ReviewCard from '../../../../components/tabs/ecommerce/ecommerce/ReviewCard/ReviewCard';
import ReusableButton from '../../../../components/reusable/ReusableButton/ReusableButton';
import {
  addToCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
} from '../../../../redux/features/cart/cartSlice';
import { resetCheckout } from '../../../../redux/features/checkout/checkoutSlice';
import AppBar from '../../../../components/reusable/AppBar/AppBar';
import IconButton from '../../../../components/reusable/IconButton/IconButton';
import CartIcon from '@/assets/icons/navigation/cart.svg';
import ProductDetailsPageSkeleton from '../../../../components/Loaders/ProductDetailsPageSkeleton/ProductDetailsPageSkeleton';
import ProductImages from '../../../../components/ProductDetailsPage/ProductImages/ProductImages';
import ProductCard from '../../../../components/PoojaAndProductsPage/ProductCard/ProductCard';

const ProductDetails = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const [refreshing, setRefreshing] = useState(false);
  const id = Array.isArray(route.params?.id)
    ? route.params.id[0]
    : route.params?.id;

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [whoExpanded, setWhoExpanded] = useState(true);

  const [howExpanded, setHowExpanded] = useState(true);

  const dispatch = useDispatch();

  const {
    data: productResponse,
    isLoading,
    refetch,
    isError,
  } = useGetSingleProductByIdQuery(id);

  const product = productResponse?.data;

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find(item => item.id === product?._id),
  );
  const onRefresh = async () => {
    try {
      setRefreshing(true);

      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const quantity = cartItem?.quantity || 0;

  const { data: relatedProductsResponse } = useGetAllProductsQuery({
    category: product?.category,
    limit: 4,
  });

  const relatedProducts =
    relatedProductsResponse?.data?.data?.filter(
      (item: any) => item._id !== product?._id,
    ) || [];

  if (isLoading) {
    return <ProductDetailsPageSkeleton />;
  }

  if (isError || !product) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SansText>Product not found</SansText>
      </View>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar
          title="Product Details"
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

        <ScrollView
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
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          style={{
            flex: 1,
            position: 'relative',
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          >
            {/* IMAGE CAROUSEL */}
            <ProductImages imageUrls={product?.imageUrls} />

            {/* CONTENT */}
            <View style={styles.contentContainer}>
              {/* TITLE */}
              <SansText style={styles.productName}>{product?.name}</SansText>

              <SansText style={styles.productDescription}>
                {product?.description}
              </SansText>

              {/* PRICE */}
              <View style={styles.priceRow}>
                <View>
                  <View style={styles.priceContainer}>
                    <SatoshiText style={styles.price}>
                      ₹{product?.discountedPrice}
                    </SatoshiText>

                    <SansText style={styles.oldPrice}>
                      ₹{product?.basePrice}
                    </SansText>
                  </View>

                  <SansText style={styles.taxText}>Incl. of all taxes</SansText>
                </View>

                <View style={styles.ratingContainer}>
                  <StarIcon height={16} width={16} color="#D4A017" />

                  <SansText style={styles.ratingText}>
                    {product?.rating >= 4 ? `${product?.rating}` : `4`}
                  </SansText>
                </View>
              </View>

              {/* WHY THIS WORKS */}
              <View style={{ marginTop: 24 }}>
                <Pressable
                  style={styles.sectionHeader}
                  onPress={() => setWhoExpanded(!whoExpanded)}
                >
                  <SatoshiText style={styles.sectionTitle}>
                    Why This Works?
                  </SatoshiText>

                  <Ionicons
                    name={whoExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#111"
                  />
                </Pressable>

                {whoExpanded && (
                  <SansText style={[styles.smallDesc, { marginBottom: 24 }]}>
                    {product?.whyThisWork}
                  </SansText>
                )}
              </View>

              <View
                style={{
                  backgroundColor: '#E6D18B',
                  height: 1,
                  marginVertical: 16,
                }}
              />

              {/* WHO SHOULD USE */}
              <View>
                <Pressable
                  style={styles.sectionHeader}
                  onPress={() => setWhoExpanded(!whoExpanded)}
                >
                  <SatoshiText style={styles.sectionTitle}>
                    Who Should Use This?
                  </SatoshiText>

                  <Ionicons
                    name={whoExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#111"
                  />
                </Pressable>

                {whoExpanded && (
                  <View style={styles.bulletContainer}>
                    {product?.targetAudience
                      ?.split(',')
                      ?.map((item: string, index: number) => (
                        <View key={index} style={styles.bulletRow}>
                          <View style={styles.dot} />

                          <SansText style={styles.bulletText}>
                            {item.trim()}
                          </SansText>
                        </View>
                      ))}
                  </View>
                )}
              </View>

              <View
                style={{
                  backgroundColor: '#E6D18B',
                  height: 1,
                  marginVertical: 16,
                }}
              />

              {/* HOW TO USE */}
              <View>
                <Pressable
                  style={styles.sectionHeader}
                  onPress={() => setHowExpanded(!howExpanded)}
                >
                  <SatoshiText style={styles.sectionTitle}>
                    How To Use
                  </SatoshiText>

                  <Ionicons
                    name={howExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#111"
                  />
                </Pressable>

                {howExpanded && (
                  <View style={styles.bulletContainer}>
                    {product?.howToUse
                      ?.split(',')
                      ?.map((item: string, index: number) => (
                        <View key={index} style={styles.bulletRow}>
                          <View style={styles.dot} />

                          <SansText style={styles.bulletText}>
                            {item.trim()}
                          </SansText>
                        </View>
                      ))}
                  </View>
                )}
              </View>

              <View
                style={{
                  backgroundColor: '#E6D18B',
                  height: 1,
                  marginVertical: 24,
                }}
              />

              {/* FEATURES */}
              <View style={styles.featureRow}>
                {[
                  {
                    icon: 'ValidationIcon',
                    title: 'Certified\nMaterial',
                  },
                  {
                    icon: 'MedalFirstIcon',
                    title: 'Quality\nChecked',
                  },
                  {
                    icon: 'FileVerifiedIcon',
                    title: '25 Days\nReturn',
                  },
                ].map((item, index) => {
                  const IconComponent = ICONS[item.icon as IconName];

                  return (
                    <View key={index} style={styles.featureCard}>
                      <View style={styles.iconWrapper}>
                        <IconComponent width={22} height={22} />
                      </View>

                      <SansText style={styles.featureTitle}>
                        {item.title}
                      </SansText>
                    </View>
                  );
                })}
              </View>

              {/* REVIEWS */}
              {product?.reviews.length > 0 && (
                <View style={styles.reviewSection}>
                  <ContentSection
                    title="Reviews & Ratings"
                    titleFontSize={24}
                  />

                  {product?.reviews
                    ?.slice(0, 2)
                    .map((review: any, index: number, arr: any[]) => {
                      const isLast = index === arr.length - 1;

                      return (
                        <View
                          key={index}
                          style={{
                            borderBottomWidth: isLast ? 0 : 1,

                            borderBottomColor: '#D8C48E',
                          }}
                        >
                          <ReviewCard
                            review={review.review}
                            rating={review.rating}
                            reviewerName="Verified Customer"
                            images={review.images}
                          />
                        </View>
                      );
                    })}

                  {product?.reviews.length > 2 && (
                    <ReusableButton
                      title="View All Reviews"
                      variant="outline"
                      onPress={() => {
                        navigation.navigate('ProductReview', {
                          id: product?._id,
                        });
                      }}
                      style={{
                        marginTop: 20,
                        height: 48,
                        borderRadius: 999,
                      }}
                    />
                  )}
                </View>
              )}

              {/* RELATED */}
              <View style={styles.reviewSection}>
                <ContentSection title="Pairs Well With" titleFontSize={18} />

                <FlatList
                  scrollEnabled={false}
                  data={relatedProducts}
                  numColumns={2}
                  keyExtractor={item => item._id}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                  }}
                  contentContainerStyle={{
                    paddingTop: 20,
                    paddingBottom: 40,
                    rowGap: 12,
                  }}
                  renderItem={({ item }) => <ProductCard item={item} />}
                />
              </View>
            </View>
          </ScrollView>
        </ScrollView>

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          {quantity === 0 ? (
            <>
              <ReusableButton
                title="Add To Cart"
                variant="outline"
                onPress={() =>
                  dispatch(
                    addToCart({
                      id: product?._id,
                      name: product?.name,
                      price: product?.discountedPrice,
                      image: product?.imageUrls?.[0],
                      quantity: 1,
                    }),
                  )
                }
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 999,
                }}
                iconName="AddIcon"
                iconPosition="left"
              />

              <ReusableButton
                title="Buy Now"
                variant="solid"
                onPress={() => {
                  dispatch(
                    addToCart({
                      id: product?._id,
                      name: product?.name,
                      price: product?.discountedPrice,
                      image: product?.imageUrls?.[0],
                      quantity: 1,
                    }),
                  );

                  dispatch(resetCheckout());
                  navigation.navigate('CartScreen');
                }}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 999,
                  backgroundColor: '#D4AF37',
                }}
              />
            </>
          ) : (
            <>
              <View style={styles.qtyContainer}>
                <ReusableButton
                  iconName="RemoveIcon"
                  variant="outline"
                  onPress={() => {
                    if (quantity > 1) {
                      dispatch(decreaseQty(product?._id));
                    } else {
                      dispatch(removeFromCart(product?._id));
                    }
                  }}
                  style={styles.qtyBtn}
                />

                <SansText style={styles.qtyCount}>{quantity}</SansText>

                <ReusableButton
                  iconName="AddIcon"
                  variant="outline"
                  onPress={() => dispatch(increaseQty(product?._id))}
                  style={styles.qtyBtn}
                />
              </View>

              <ReusableButton
                title="Go to Cart"
                variant="solid"
                onPress={() => {
                  dispatch(resetCheckout());
                  navigation.navigate('CartScreen');
                }}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 999,
                  backgroundColor: '#D4AF37',
                }}
              />
            </>
          )}
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  imageContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },

  productImage: {
    width: Dimensions.get('window').width - 32,
    height: 380,
    borderRadius: 12,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  productName: {
    fontSize: 21,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  productDescription: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#0D0D0D',
  },

  priceRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  price: {
    fontSize: 24,
    color: '#0D0D0D',
    fontFamily: 'Satoshi',
    fontWeight: '700',
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#e80606',
    fontSize: 16,
  },

  taxText: {
    marginTop: 2,
    fontSize: 14,
    color: '#0D0D0D',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
  },

  ratingText: {
    fontFamily: 'Satoshi-Bold',
    color: '#777',
    fontSize: 14,
  },

  buttonRow: {
    backgroundColor: '#FBF7EB',
    flexDirection: 'row',
    gap: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 20,
  },

  smallDesc: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 26,
    color: '#0D0D0D',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  bulletContainer: {
    marginTop: 12,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#111',
    marginTop: 8,
    marginRight: 10,
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 26,
    color: '#0D0D0D',
  },

  reviewSection: {
    marginTop: 34,
  },

  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 20,
    paddingVertical: 22,
    backgroundColor: '#FBF7EB',
  },

  featureCard: {
    flex: 1,
    alignItems: 'center',
  },

  iconWrapper: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  featureTitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
    color: '#0D0D0D',
    fontFamily: 'Satoshi-Medium',
  },

  qtyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderRadius: 999,
    height: 52,
    backgroundColor: '#FBF7EB',
  },

  qtyBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
  },

  qtyCount: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  skeletonImageContainer: {
    width: Dimensions.get('window').width - 32,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    backgroundColor: '#FBF7EB',
    borderRadius: 12,
    marginHorizontal: 'auto',
    overflow: 'hidden',
  },
});
