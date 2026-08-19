import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ReusableButton from '../ReusableButton/ReusableButton';
import AnimatedScreen from '../../layout/AnimatedScreen';
import ScreenWrapper from '../../layout/ScreenWrapper';
import { SansText } from '../Text/SansText';
import { SatoshiText } from '../Text/SatoshiText';

type ButtonItem = {
  title: string;
  onPress: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'error';
};

type Props = {
  title: string;
  description?: string;
  image?: any;
  buttons?: ButtonItem[];
  children?: React.ReactNode;
};

const SuccessScreen = ({
  title,
  description,
  image,
  children,
  buttons = [],
}: Props) => {
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          {/* Center Content */}
          <View style={styles.centerContent}>
            {/* Image */}
            <Image
              source={image || require('@/assets/images/tick.png')}
              style={styles.image}
            />

            {/* Title */}
            <SatoshiText style={styles.title}>{title}</SatoshiText>

            {/* Description */}
            {description && (
              <SansText style={styles.description}>{description}</SansText>
            )}

            {/* Children */}
            {children}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <ReusableButton
                key={index}
                title={button.title}
                onPress={button.onPress}
                variant={button.variant || 'solid'}
              />
            ))}
          </View>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5B5B5B',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
});
