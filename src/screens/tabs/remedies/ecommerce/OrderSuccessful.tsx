import React from "react";
import { View } from "react-native";
import SuccessScreen from "../../../../components/reusable/successScreen/successScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { SansText } from "../../../../components/reusable/Text/SansText";


const OrderSuccessful = () => {
  const route = useRoute<any>();
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const { slug } = route.params || {};

  return (
    <SuccessScreen
      title="Address Added Successfully"
      description="Your order has been successfully placed."

      buttons={[
        {
          title: "Continue Shopping",

          variant: "outline",

          onPress: () => {
            navigation.navigate("RemediesScreen")
          },
        },

        {
          title: "View Saved Address",

          onPress: () => {
            navigation.replace(
              "OrdersScreen"
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
            fontFamily: "GeneralSans-Bold",
            fontSize: 14,
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

export default OrderSuccessful;