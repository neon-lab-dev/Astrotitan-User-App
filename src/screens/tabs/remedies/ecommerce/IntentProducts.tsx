/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import { RefreshControl, View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { useGetAllCategoriesByAreaNameQuery } from '../../../../redux/features/categories/categoriesApi';
import { useGetAllProductsQuery } from '../../../../redux/features/product/productsApi';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import { SansText } from '../../../../components/reusable/Text/SansText';
import Categories from '../../../../components/reusable/Categories/Categories';
import RemedyCardSkeleton from '../../../../components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCardSkeleton';
import ProductCard from '../../../../components/PoojaAndProductsPage/ProductCard/ProductCard';
import AppBar from '../../../../components/reusable/AppBar/AppBar';
import IconButton from '../../../../components/reusable/IconButton/IconButton';
import CartIcon from '@/assets/icons/navigation/cart.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { resetCheckout } from '../../../../redux/features/checkout/checkoutSlice';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../../../components/shared/AppHeader/AppHeader';
import { ICONS } from '../../../../assets/svg';

const IntentProducts = () => {
  const route = useRoute<any>();
  const slug = Array.isArray(route.params?.slug)
    ? route.params.slug[0]
    : route.params?.slug ?? '';

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const cartItems = useSelector((state: RootState) => state.cart.items);

   const cartCount = cartItems.length;

  const [selectedCategory, setSelectedCategory] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  /* CATEGORIES */
  const { data: categories, isLoading: isCategoryLoading } =
    useGetAllCategoriesByAreaNameQuery('Product');

  const {
    data: productsResponse,
    isLoading: isProductLoading,
    isFetching,
    refetch,
  } = useGetAllProductsQuery({
    limit: 20,
    skip: 0,
    category: selectedCategory,
    intent: slug,
  });

  const products = productsResponse?.data?.data || [];

  /* REFRESH */
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await refetch();
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const EmptyIcon = ICONS.EmptyFile;

  // how empty state when no products
  if (!isProductLoading && products.length === 0) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppBar
            title={slug}
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

          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <EmptyIcon width={48} height={48} />
            </View>
            <SansText style={styles.emptyTitle}>No Products Found</SansText>
            <SansText style={styles.emptySubtext}>
              We couldn't find any products in this category.
              Please check back later.
            </SansText>
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar
          title={slug}
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

        <View style={{ flex: 1 }}>
          {/* CATEGORIES */}
          <Categories
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            allCategories={categories?.data || []}
            isLoading={isCategoryLoading}
          />

          {/* PRODUCTS */}
          <FlatList
            data={isProductLoading ? [1, 2, 3, 4] : products}
            numColumns={2}
            refreshControl={
              <RefreshControl
                refreshing={refreshing || isFetching}
                onRefresh={onRefresh}
                tintColor="#D4AF37"
                colors={['#D4AF37']}
                progressBackgroundColor="#FBF7EB"
              />
            }
            keyExtractor={(item, index) =>
              isProductLoading ? index.toString() : item._id
            }
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}
            contentContainerStyle={{
              paddingTop: 24,
              paddingBottom: 40,
              rowGap: 16,
            }}
            renderItem={({ item }) => {
              if (isProductLoading) {
                return <RemedyCardSkeleton />;
              }
              return <ProductCard item={item} />;
            }}
          />
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default IntentProducts;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});