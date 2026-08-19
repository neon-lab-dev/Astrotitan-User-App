import React, { useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const ProductImages = ({ imageUrls }: { imageUrls?: string[] }) => {
  const [activeImage, setActiveImage] = useState(0);
  return (
    <>
      <View style={styles.imageContainer}>
        <FlatList
          data={imageUrls || []}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          onScroll={e => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                (Dimensions.get('window').width - 32),
            );

            setActiveImage(index);
          }}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.productImage} />
          )}
        />
      </View>

      <View style={styles.indicatorContainer}>
        {imageUrls?.map((_: any, index: number) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeImage === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </>
  );
};

export default ProductImages;

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

  indicatorContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E6D18B',
  },

  activeIndicator: {
    width: 12,
    height: 12,
    backgroundColor: '#D4AF37',
  },
});
