import SuccessScreen from "@/components/reusable/successScreen/successScreen";
import { router } from "expo-router";
import React from "react";


const AddressSuccess = () => {
  return (
    <SuccessScreen
      title="Form submitted"
      description="Your consultation form has been submitted and our experts will reach out to you."

      buttons={[
       

        {
          title: "Back To Pooja Section",

          onPress: () => {
            router.replace(
              "/(tabs)/remedies"
            );
          },
        },
      ]}
    />
  );
};

export default AddressSuccess;