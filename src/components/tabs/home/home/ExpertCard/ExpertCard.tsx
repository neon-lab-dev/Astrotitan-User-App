/* eslint-disable react-native/no-inline-styles */
import StarIcon from '@/assets/icons/visual/star.svg';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SansText } from '../../../../reusable/Text/SansText';
import { SatoshiText } from '../../../../reusable/Text/SatoshiText';

type Props = {
  _id: string;
  name: string;
  experience: string;
  description: string;
  tags: string[];
  rating: number;
  image: any;
};

const ExpertCard = ({ _id, name, experience, tags, rating, image }: Props) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.getParent()?.navigate('AstrologersTab', {
          screen: 'AstrologerDetailsScreen',
          params: {
            id: _id,
          },
        });
      }}
      style={styles.card}
      activeOpacity={0.9}
    >
      <View style={styles.avatarWrapper}>
        <Image
          source={
            image
              ? {
                  uri: image,
                }
              : require('@/assets/images/user-profile-placeholder.png')
          }
          style={styles.avatar}
        />

        <View style={styles.ratingBadge}>
          <StarIcon height={10} width={10} />
          <SansText style={styles.ratingText}>{rating}</SansText>
        </View>
      </View>

      <View style={{ alignItems: 'center', gap: 4 }}>
        <SatoshiText style={styles.name}>{name}</SatoshiText>
        <SansText style={styles.exp}>{experience} Years Experience</SansText>
        <SansText style={styles.tags}>
          {tags
            .slice(0, 2)
            .map(t => `• ${t}`)
            .join('  ')}
          {tags.length > 2 && '  ...'}
        </SansText>
      </View>
    </TouchableOpacity>
  );
};

export default ExpertCard;

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    backgroundColor: '#FBF7EB',
    paddingVertical: 20,
    alignItems: 'center',
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },

  avatar: {
    width: 94,
    height: 94,
    borderRadius: 100,
    backgroundColor: '#F0E8CD',
  },

  ratingBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    color: '#F5F5F5',
    fontSize: 12,
  },

  name: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#4A4A4A',
    textAlign: 'center',
  },

  exp: {
    fontSize: 12,
    fontFamily: 'Satoshi-SemiBold',
    color: '#4A4A4A',
    letterSpacing: 0.28,
  },

  tags: {
    fontSize: 12,
    color: '#4A4A4A',
    textAlign: 'center',
    letterSpacing: 0.38,
  },
});
