/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { INTENTS } from '../../../data/intents';
import IntentCard from '../../tabs/ecommerce/ecommerce/IntentCard/IntentCard';
import ProductCardSkeleton from '../../tabs/ecommerce/ecommerce/ProductCard/ProductCardSkeleton';
import ProductCard from '../ProductCard/ProductCard';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';

const Products = ({ products, isLoading }: any) => {
  // Check if there are no products and not loading
  const hasNoProducts = !isLoading && (!products || products.length === 0);

  return (
    <View style={styles.container}>
      <View
        style={{
          gap: 24,
          marginTop: 10,
        }}
      >
        <FlatList
          data={INTENTS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            marginTop: 12,
            paddingHorizontal: 16,
          }}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item }) => (
            <IntentCard title={item.title} icon={item.icon} />
          )}
        />
      </View>

      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        {!hasNoProducts && (
          <SatoshiText
            style={{
              fontSize: 16,
              color: '#1a1a2e',
              fontFamily: 'Satoshi-Bold',
            }}
          >
            Astro Essentials
          </SatoshiText>
        )}

        {hasNoProducts ? (
          <View style={styles.emptyContainer}>
            <SatoshiText style={styles.emptyTitle}>
              No Products Available
            </SatoshiText>
            <SansText style={styles.emptySubText}>
              No products are currently available. Please check back later.
            </SansText>
          </View>
        ) : (
          <FlatList
            data={isLoading ? [1, 2, 3] : products}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) =>
              isLoading ? index.toString() : item._id
            }
            contentContainerStyle={{
              marginTop: 12,
            }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => {
              if (isLoading) {
                return <ProductCardSkeleton />;
              }

              return <ProductCard key={item?._id} item={item} />;
            }}
          />
        )}
      </View>
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
    paddingVertical: 40,
    minHeight: 200,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1A1A1A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: 'GeneralSans-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Products;
