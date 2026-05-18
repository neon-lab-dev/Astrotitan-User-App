import SuccessScreen from "@/components/reusable/successScreen/successScreen";
import { SansText } from "@/components/reusable/Text/SansText";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";


const AddressSuccess = () => {
  const { slug } = useLocalSearchParams();

  return (
    <SuccessScreen
      title="Address Added Successfully"
      description="Your order has been successfully placed."

      buttons={[
        {
          title: "Continue Shopping",

          variant: "outline",

          onPress: () => {
            router.replace(
              "/(tabs)/remedies"
            );
          },
        },

        {
          title: "View Saved Address",

          onPress: () => {
            router.replace(
              "/(tabs)/remedies/(orders)/orders"
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

export default AddressSuccess;