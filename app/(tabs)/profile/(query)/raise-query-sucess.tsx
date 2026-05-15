import SuccessScreen from "@/components/reusable/successScreen/successScreen";
import { SansText } from "@/components/reusable/Text/SansText";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";


const RaiseQuerySuccess = () => {
   const { slug } = useLocalSearchParams();
  return (
    <SuccessScreen
      title="Query submitted"

      buttons={[

        {
          title: "Back To Profile",

          onPress: () => {
            router.replace(
              "/(tabs)/profile"
            );
          },
        },
      ]}
    >
      <View
  style={{
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  }}
>
  <SansText
    style={{
      fontSize: 14,
      color: "#6B6B6B",
      textAlign: "center",
    }}
  >
    Ticket ID
  </SansText>

  
    <SansText
      style={{
        fontFamily: "SansBold",
        fontSize: 16,
        color: "#0D0D0D",
        letterSpacing: 0.4,
        textAlign: "center",
      }}
    >
      {slug}
    </SansText>
</View>
    </SuccessScreen>
  );
};

export default RaiseQuerySuccess;