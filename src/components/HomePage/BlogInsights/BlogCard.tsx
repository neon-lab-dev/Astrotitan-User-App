/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ArrowIcon from '@/assets/icons/actions/arrow.svg';
import LinearGradient from 'react-native-linear-gradient';
import { SansText } from '../../reusable/Text/SansText';
import { SatoshiText } from '../../reusable/Text/SatoshiText';

type Props = {
  title: string;
  ctaText?: string;
  image: any;
  onPress?: () => void;
  height?: number;
};

const BlogCard = ({
  title,
  ctaText,
  image,
  onPress,
  height,
}: Props) => {
  
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <ImageBackground
        source={image}
        style={[styles.container, { height: height || 256 }]}
        imageStyle={styles.image}
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.84)']}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={styles.overlay}
        />

        {/* Content - Left Bottom */}
        <View style={styles.content}>
          <View style={styles.bottomContent}>
            <SatoshiText style={styles.title}>
              {title.slice(0, 50)}
              {title.length > 50 ? '...' : ''}
            </SatoshiText>

            {ctaText && (
              <View style={styles.ctaRow}>
                <SansText style={styles.cta}>{ctaText}</SansText>
                <ArrowIcon width={24} height={24} style={{ marginLeft: 8 }} />
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default BlogCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },

  image: {
    borderRadius: 16,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
  },

  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
  },

  bottomContent: {
    gap: 6,
    alignItems: 'flex-start',
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    lineHeight: 20,
    textAlign: 'left',
  },

  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  cta: {
    color: '#fff',
    textDecorationLine: 'underline',
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.28,
  },
});