/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationProp } from '../../shared/AppHeader/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { FlatList, View } from 'react-native';
import ProductCardSkeleton from '../../tabs/ecommerce/ecommerce/ProductCard/ProductCardSkeleton';
import PoojaCard from '../PoojaCard/PoojaCard';
import { useGetAllCategoriesByAreaNameQuery } from '../../../redux/features/categories/categoriesApi';
import Categories from '../../reusable/Categories/Categories';

const Poojas = ({ poojas, isLoading, selectedCategory, setSelectedCategory }: any) => {
  const navigation = useNavigation<NavigationProp>();
  /* CATEGORIES */
  const { data: categories, isLoading: isCategoryLoading } =
    useGetAllCategoriesByAreaNameQuery('Puja');
  return (
    <View>
      {/* <View
        style={{
          paddingHorizontal: 16,
          marginTop: 12,
        }}
      >
        <ECommerceFeatureCard
          image={require('@/assets/images/consmos1.png')}
          title="Book Poojas Aligned With Your Energy"
          description="Discover rituals and spiritual practices based on your planetary positions and life intentions."
        />
      </View> */}

      <View
        style={{
          gap: 24,
          marginTop: 6,
        }}
      >
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          allCategories={categories?.data || []}
          isLoading={isCategoryLoading}
        />
      </View>

      <FlatList
        data={isLoading ? [1, 2, 3] : poojas}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) =>
          isLoading ? index.toString() : item._id
        }
        contentContainerStyle={{
          marginTop: 6,
          paddingHorizontal: 16
        }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => {
          if (isLoading) {
            return <ProductCardSkeleton />;
          }

          return (
            <PoojaCard
              item={item}
              onPress={() => {
                navigation.navigate('PujaDetails', { id: item?._id });
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default Poojas;
