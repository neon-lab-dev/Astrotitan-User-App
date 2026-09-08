/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationProp } from '../../shared/AppHeader/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { FlatList, View, StyleSheet } from 'react-native';
import ProductCardSkeleton from '../../tabs/ecommerce/ecommerce/ProductCard/ProductCardSkeleton';
import PoojaCard from '../PoojaCard/PoojaCard';
import { useGetAllCategoriesByAreaNameQuery } from '../../../redux/features/categories/categoriesApi';
import Categories from '../../reusable/Categories/Categories';
import { SansText } from '../../reusable/Text/SansText';
import { SatoshiText } from '../../reusable/Text/SatoshiText';

const Poojas = ({
  poojas,
  isLoading,
  selectedCategory,
  setSelectedCategory,
}: any) => {
  const navigation = useNavigation<NavigationProp>();
  /* CATEGORIES */
  const { data: categories, isLoading: isCategoryLoading, isFetching: isCategoryFetching } =
    useGetAllCategoriesByAreaNameQuery('Puja');

  // Check if there are no poojas and not loading
  const hasNoPoojas = !isLoading && (!poojas || poojas.length === 0);

  return (
    <View style={styles.container}>
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
          isLoading={isCategoryLoading || isCategoryFetching}
        />
      </View>

      {hasNoPoojas ? (
        <View style={styles.emptyContainer}>
          <SatoshiText style={styles.emptyTitle}>No Poojas Available</SatoshiText>
          <SansText style={styles.emptySubText}>
            {selectedCategory && selectedCategory !== 'All'
              ? `No poojas found in "${selectedCategory}" category. Try selecting a different category.`
              : 'No poojas are currently available. Please check back later.'}
          </SansText>
        </View>
      ) : (
        <FlatList
          data={isLoading ? [1, 2, 3] : poojas}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) =>
            isLoading ? index.toString() : item._id
          }
          contentContainerStyle={{
            marginTop: 6,
            paddingHorizontal: 16,
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: 'GeneralSans-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Poojas;