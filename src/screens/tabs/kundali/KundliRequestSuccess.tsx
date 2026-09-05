/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import SuccessScreen from '../../../components/reusable/successScreen/successScreen';
import { SansText } from '../../../components/reusable/Text/SansText';
import { useNavigation } from '@react-navigation/native';

const KundliRequestSuccess = () => {
  const navigation = useNavigation<any>();
  const handleGoToRequests = () => {
    navigation.navigate('KundliScreen');
  };

  return (
    <SuccessScreen
      title="Request Submitted Successfully!"
      description="Your kundli request has been received. Our expert astrologers will analyze your details and provide you with a detailed kundli report soon."
      buttons={[
        {
          title: 'Go to My Requests',
          onPress: handleGoToRequests,
        },
      ]}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 8,
          gap: 6,
        }}
      >
        <SansText
          style={{
            fontSize: 14,
            color: '#6B6B6B',
            textAlign: 'center',
          }}
        >
          You will be notified once your request is processed.
        </SansText>

        <SansText
          style={{
            fontFamily: 'GeneralSans-Bold',
            fontSize: 14,
            color: '#D4AF37',
            textAlign: 'center',
          }}
        >
          Thank you for choosing us!
        </SansText>
      </View>
    </SuccessScreen>
  );
};

export default KundliRequestSuccess;
