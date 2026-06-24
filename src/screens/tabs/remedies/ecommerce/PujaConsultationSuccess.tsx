import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/types";
import SuccessScreen from "../../../../components/reusable/successScreen/successScreen";


const PujaConsultationSuccess = () => {
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  return (
    <SuccessScreen
      title="Consultation Form submitted"
      description="Your consultation form has been submitted and our experts will reach out to you."

      buttons={[
       

        {
          title: "Back To Pooja Section",

          onPress: () => {
            navigation.replace(
              "RemediesScreen"
            );
          },
        },
      ]}
    />
  );
};

export default PujaConsultationSuccess;