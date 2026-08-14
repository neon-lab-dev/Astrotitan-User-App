// components/RaiseKundliRequest/Step5_Review.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';
import { KundliFormData } from './types';

type Props = {
  data: KundliFormData;
  selectedFiles: any[];
};

const Step5_Review = ({ data, selectedFiles }: Props) => {
  const reviewSections = [
    {
      title: 'Request Type',
      value: data.requestType === 'generateKundli' ? 'Generate Kundli' : 'Analyze Kundli',
    },
    {
      title: 'Full Name',
      value: data.userName,
    },
    {
      title: 'Email',
      value: data.userEmail,
    },
    {
      title: 'Phone',
      value: data.userPhoneNumber,
    },
    {
      title: 'Date of Birth',
      value: data.dateOfBirth?.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    },
    {
      title: 'Time of Birth',
      value: data.timeOfBirth,
    },
    {
      title: 'Place of Birth',
      value: data.placeOfBirth,
    },
    {
      title: 'Gender',
      value: data.userGender?.charAt(0).toUpperCase() + data.userGender?.slice(1),
    },
    {
      title: 'Kundli Type',
      value: data.kundliType?.replace(/([A-Z])/g, ' $1').trim(),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SatoshiText style={styles.title}>Review Your Request</SatoshiText>
        <SansText style={styles.subtitle}>
          Please verify all details before submitting
        </SansText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionsContainer}>
          {reviewSections.map((section, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewItemLeft}>
                <SansText style={styles.reviewLabel}>{section.title}</SansText>
              </View>
              <SansText style={styles.reviewValue} numberOfLines={1}>
                {section.value || 'Not provided'}
              </SansText>
            </View>
          ))}

          {/* Files Section */}
          {selectedFiles.length > 0 && (
            <View style={styles.reviewItem}>
              <View style={styles.reviewItemLeft}>
                <Icon name="document-outline" size={20} color="#D4AF37" />
                <SansText style={styles.reviewLabel}>Uploaded Files</SansText>
              </View>
              <SansText style={styles.reviewValue}>
                {selectedFiles.length} file(s)
              </SansText>
            </View>
          )}

          {data.userNotes && (
            <View style={styles.notesContainer}>
              <SansText style={styles.notesLabel}>Concern/Query</SansText>
              <SansText style={styles.notesValue}>{data.userNotes}</SansText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  sectionsContainer: {
    gap: 4,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  reviewValue: {
    fontSize: 14,
    color: '#1a1a2e',
    fontFamily: 'Satoshi-Medium',
    maxWidth: '50%',
  },
  notesContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  notesLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  notesValue: {
    fontSize: 14,
    color: '#1a1a2e',
    lineHeight: 20,
  },
});

export default Step5_Review;