import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../../navigation/types';
import SuccessScreen from '../../../../components/reusable/successScreen/successScreen';

const PujaConsultationSuccess = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  return (
    <SuccessScreen
      title="Request Received."
      description="We have received your request and our expert will reach out to you soon."
      buttons={[
        {
          title: "Back To Pooja's",
          variant: 'solid',
          onPress: () => {
            navigation.getParent()?.reset({
              index: 0,
              routes: [
                {
                  name: 'RemediesTab',
                  state: {
                    routes: [{ name: 'RemediesScreen' }],
                  },
                },
              ],
            });
          },
        },
      ]}
    />
  );
};

export default PujaConsultationSuccess;
