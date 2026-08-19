import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

type PoojaCardProps = {
  item: {
    _id: string;
    name: string;
    imageUrls?: string[];
    intent?: string;
    basePrice?: number;
    discountedPrice?: number;
    targetAudience?: string;
  };
  onPress?: (item: any) => void;
  onBook?: (item: any) => void;
};

const PoojaCard = ({ item, onPress, onBook }: PoojaCardProps) => {
  const {
    name,
    imageUrls,
    intent,
    basePrice,
    discountedPrice,
    targetAudience,
  } = item;

  const hasDiscount = discountedPrice && basePrice && discountedPrice < basePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
    : 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item)}
      activeOpacity={0.8}
    >
      {/* Left - Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrls?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="cover"
        />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <SansText style={styles.discountText}>-{discountPercentage}%</SansText>
          </View>
        )}
      </View>

      {/* Right - Content */}
      <View style={styles.contentContainer}>
        {/* Name */}
        <SatoshiText style={styles.name} numberOfLines={2}>
          {name}
        </SatoshiText>

        {/* Intent Tag */}
        {intent && (
          <View style={styles.intentTag}>
            <SansText style={styles.intentTagText}>{intent}</SansText>
          </View>
        )}

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

        {/* Target Audience & Book Button */}
        <View style={styles.bottomRow}>
          {targetAudience && (
            <View style={styles.audienceContainer}>
              <Icon name="people-outline" size={12} color="#8E8E93" />
              <SansText style={styles.audienceText}>{targetAudience}</SansText>
            </View>
          )}
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => onBook?.(item)}
            activeOpacity={0.7}
          >
            <SansText style={styles.bookButtonText}>Book</SansText>
            <Icon name="arrow-forward" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
    alignSelf: 'center',
    height: 110,
  },
  imageContainer: {
    width: 100,
    height: '100%',
    backgroundColor: '#F8F8F8',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Bold',
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 13,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    lineHeight: 16,
  },
  intentTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  intentTagText: {
    fontSize: 9,
    color: '#D4AF37',
    fontFamily: 'Satoshi-Medium',
    textTransform: 'capitalize',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
  },
  discountedPrice: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#D4AF37',
  },
  basePrice: {
    fontSize: 10,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  audienceText: {
    fontSize: 10,
    color: '#8E8E93',
    fontFamily: 'Satoshi-Regular',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 2,
  },
  bookButtonText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Medium',
  },
});

export default PoojaCard;