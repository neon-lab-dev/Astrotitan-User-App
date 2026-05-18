import SuccessScreen from "@/components/reusable/successScreen/successScreen";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";


const RaiseQuerySuccess = () => {
  const { slug } = useLocalSearchParams();
  return (
    <SuccessScreen
      title="Profile completed!"
      description="Your personalized astrology experience is ready."
      image={require("@/assets/images/profile-verified.png")}
      buttons={[

        {
          title: "Go To Dashboard",

          onPress: () => {
            router.replace(
              "/home"
            );
          },
        },
      ]}
    >
    </SuccessScreen>
  );
};

export default RaiseQuerySuccess;