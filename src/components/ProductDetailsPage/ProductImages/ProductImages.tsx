import React, { useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const ProductImages = ({ imageUrls }: { imageUrls?: string[] }) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400' }}
          style={styles.productImage}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.imageContainer}>
        <FlatList
          data={imageUrls}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          onScroll={e => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImage(index);
          }}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.productImage} />
          )}
        />
      </View>

      {/* Indicators */}
      {imageUrls.length > 1 && (
        <View style={styles.indicatorContainer}>
          {imageUrls.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                activeImage === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default ProductImages;

const styles = StyleSheet.create({
  imageContainer: {
  },
  productImage: {
    width: width, // Full width of screen
    height: 380,
  },
  indicatorContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E6D18B',
  },
  activeIndicator: {
    width: 12,
    height: 12,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
  },
});
