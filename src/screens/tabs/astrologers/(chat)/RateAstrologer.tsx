import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAddReviewMutation } from '../../../../redux/features/consultation/consultationApi';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import AppBar from '../../../../components/reusable/AppBar/AppBar';
import { NavigationProp } from '../../../../components/shared/AppHeader/AppHeader';

const RateAstrologer = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const consultationId = route.params?.consultationId;
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    try {
      const payload = {
        rating,
        review,
      };
      const response = await addReview({
        id: consultationId,
        data: payload,
      }).unwrap();
      if (response?.success) {
        navigation.navigate('SessionDetails', { id: consultationId });
      }
    } catch (error) {
      console.log(error, 'TT');
    }
  };
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar
          title="Rate Astrologer"
          onPressBack={() =>
            navigation.navigate('SessionDetails', { id: consultationId })
          }
        />
        <View style={styles.container}>
          <Text style={styles.title}>Share your session experience</Text>

          {/* Star Rating */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Text
                  style={[
                    styles.starIcon,
                    star <= rating ? styles.starActive : styles.starInactive,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingText}>
            {rating > 0 ? `${rating} out of 5` : 'Tap a star to rate'}
          </Text>

          {/* Review Text Area */}
          <TextInput
            style={styles.reviewInput}
            placeholder="Write your review..."
            placeholderTextColor="#999999"
            multiline
            numberOfLines={5}
            value={review}
            onChangeText={setReview}
            textAlignVertical="top"
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              //   onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 20,
  },

  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },

  starButton: {
    paddingHorizontal: 6,
  },

  starIcon: {
    fontSize: 36,
  },

  starActive: {
    color: '#D4AF37', // Your primary gold color
  },

  starInactive: {
    color: '#CCCCCC',
  },

  ratingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },

  reviewInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    color: '#111111',
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },

  submitButton: {
    backgroundColor: '#D4AF37', // Your primary gold color
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RateAstrologer;
