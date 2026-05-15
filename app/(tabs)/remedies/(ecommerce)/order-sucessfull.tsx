import SuccessScreen from "@/components/reusable/successScreen/successScreen";
import { router } from "expo-router";
import React from "react";


const AddressSuccess = () => {
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
    />
  );
};

export default AddressSuccess;