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
          title: "Back To Pooja's",
          variant: "outline",
          onPress: () => {
            navigation.getParent()?.reset({
              index: 0,
              routes: [
                {
                  name: "RemediesTab",
                  state: {
                    routes: [{ name: "RemediesScreen" }],
                  },
                },
              ],
            });
          },
        },
        {
          title: "View Requested Consultations",

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