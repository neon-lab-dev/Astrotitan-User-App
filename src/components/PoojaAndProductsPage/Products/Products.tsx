/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationProp } from '../../shared/AppHeader/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Text, View } from 'react-native';
import { INTENTS } from '../../../data/intents';
import IntentCard from '../../tabs/ecommerce/ecommerce/IntentCard/IntentCard';
import ProductCardSkeleton from '../../tabs/ecommerce/ecommerce/ProductCard/ProductCardSkeleton';
import ProductCard from '../ProductCard/ProductCard';

const Products = ({ products, isLoading }: any) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={{ paddingHorizontal: 16 }}>
      {/* <View
        style={{
          paddingHorizontal: 16,
          marginTop: 12,
        }}
      >
        <ECommerceFeatureCard
          image={require('@/assets/images/consmos1.png')}
          title="Find What Actually Works for You"
          description="Get remedy suggestions based on your birth chart and current planetary phase."
        />
      </View> */}

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
          }}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item }) => (
            <IntentCard title={item.title} icon={item.icon} />
          )}
        />
      </View>

      <View style={{ marginTop: 24 }}>
        <Text
          style={{
            fontSize: 16,
            color: '#1a1a2e',
            fontFamily: 'Satoshi-Bold',
          }}
        >
          Career Growth
        </Text>

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

            return (
              <ProductCard
                item={item}
                onPress={() => {
                  navigation.navigate('PujaDetails', { id: item?._id });
                }}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default Products;
