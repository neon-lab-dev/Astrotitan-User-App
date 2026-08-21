import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { SansText } from '../../reusable/Text/SansText';
import ReusableButton from '../../reusable/ReusableButton/ReusableButton';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { ICONS } from '../../../assets/svg';

interface Props {
  visible: boolean;
  onClose: () => void;
  onNavigateToSubscription: () => void;
}

const PremiumRequiredModal = ({
  visible,
  onClose,
  onNavigateToSubscription,
}: Props) => {
    const PremiumIcon = ICONS.PremiumIcon;
    const TickMarkIcon = ICONS.TickIcon;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={e => e.stopPropagation()}
        >
          {/* Premium Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <PremiumIcon width={50} height={50} />
            </View>
          </View>

          {/* Title */}
          <SatoshiText style={styles.title}>Premium Feature</SatoshiText>

          {/* Description */}
          <SansText style={styles.description}>
            This feature is exclusively available for our premium users. Upgrade
            to premium and unlock unlimited access to:
          </SansText>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
             <TickMarkIcon width={20} height={24} />
              <SansText style={styles.featureText}>
                Live consultation with top astrologers
              </SansText>
            </View>

            <View style={styles.featureRow}>
             <TickMarkIcon width={20} height={24} />
              <SansText style={styles.featureText}>
                Personalized horoscope & predictions
              </SansText>
            </View>

            <View style={styles.featureRow}>
             <TickMarkIcon width={20} height={24} />
              <SansText style={styles.featureText}>
                Unlimited access to all premium content
              </SansText>
            </View>

            <View style={styles.featureRow}>
             <TickMarkIcon width={20} height={24} />
              <SansText style={styles.featureText}>
                Priority support & exclusive offers
              </SansText>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <SansText style={styles.cancelText}>Maybe Later</SansText>
            </TouchableOpacity>

            <ReusableButton
              title="Upgrade to Premium"
              onPress={onNavigateToSubscription}
              width="60%"
              variant="solid"
            />
          </View>

          {/* Footer Text */}
          <SansText style={styles.footerText}>
            Cancel anytime • No hidden charges
          </SansText>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default PremiumRequiredModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },

  iconContainer: {
    marginTop: -48,
    marginBottom: 16,
  },

  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  title: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 8,
    textAlign: 'center',
  },

  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  featuresContainer: {
    width: '100%',
    marginBottom: 24,
    backgroundColor: '#F8F6F0',
    borderRadius: 16,
    padding: 16,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  featureText: {
    marginLeft: 12,
    fontSize: 13,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },

  cancelText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Satoshi-Medium',
  },

  footerText: {
    fontSize: 11,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});
