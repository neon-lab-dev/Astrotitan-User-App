/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';
import { ICONS } from '../../../assets/svg';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

type ProductCardProps = {
  item: {
    _id: string;
    name: string;
    imageUrls?: string[];
    discountedPrice?: number;
    basePrice?: number;
    rating?: number;
    reviews?: { length: number };
    intent?: string;
    category?: string;
  };
  onPress?: (item: any) => void;
};

const ProductCard = ({ item, onPress }: ProductCardProps) => {
  const {
    name,
    imageUrls,
    discountedPrice,
    basePrice,
    rating = 0,
    reviews = { length: 0 },
  } = item;

  const hasDiscount =
    discountedPrice && basePrice && discountedPrice < basePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
    : 0;

  const StarIcon = ICONS.StarIcon;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item)}
      activeOpacity={0.8}
    >
      {/* Image Container - No padding */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrls?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="cover"
        />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <SansText style={styles.discountText}>
              -{discountPercentage}%
            </SansText>
          </View>
        )}
      </View>

      {/* Content - Flex grow to push button to bottom */}
      <View style={styles.contentContainer}>
        {/* Product Name */}
        <SatoshiText style={styles.productName} numberOfLines={2}>
          {name}
        </SatoshiText>

        {/* Price */}
        <View style={styles.priceContainer}>
          {hasDiscount ? (
            <>
              <SatoshiText style={styles.discountedPrice}>
                ₹{discountedPrice?.toFixed(2)}
              </SatoshiText>
              <SansText style={styles.basePrice}>
                ₹{basePrice?.toFixed(2)}
              </SansText>
            </>
          ) : (
            <SatoshiText style={styles.price}>
              ₹{basePrice?.toFixed(2)}
            </SatoshiText>
          )}
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <StarIcon width={12} height={12} fill="#FFB800" />
          <SansText style={styles.reviewCount}>{rating}</SansText>
          <SansText style={[styles.reviewCount, { marginLeft: 4 }]}>
            ({reviews?.length || 0})
          </SansText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    height: 250,
  },
  imageContainer: {
    height: 150,
    backgroundColor: '#F8F8F8',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Bold',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between', // ✅ Pushes button to bottom
  },
  productName: {
    fontSize: 13,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewCount: {
    fontSize: 10,
    color: '#8E8E93',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  price: {
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
  },
  discountedPrice: {
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
    color: '#D4AF37',
  },
  basePrice: {
    fontSize: 12,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
});

export default ProductCard;
