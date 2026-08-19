/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationProp } from '../../shared/AppHeader/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { FlatList, View } from 'react-native';
import { INTENTS } from '../../../data/intents';
import IntentCard from '../../tabs/ecommerce/ecommerce/IntentCard/IntentCard';
import ProductCardSkeleton from '../../tabs/ecommerce/ecommerce/ProductCard/ProductCardSkeleton';
import PoojaCard from '../PoojaCard/PoojaCard';

const Poojas = ({ poojas, isLoading }:any) => {
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
          title="Book Poojas Aligned With Your Energy"
          description="Discover rituals and spiritual practices based on your planetary positions and life intentions."
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

      <FlatList
        data={isLoading ? [1, 2, 3] : poojas}
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
