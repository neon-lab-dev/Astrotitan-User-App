/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { View, BackHandler } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { SansText } from "../../../../components/reusable/Text/SansText";
import SuccessScreen from "../../../../components/reusable/successScreen/successScreen";
import { clearCart } from "../../../../redux/features/cart/cartSlice";
import { useGetOrderStatusQuery } from "../../../../redux/features/orders/orderApi";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const OrderSuccessful = () => {
  const route = useRoute<any>();
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const { orderId } = route.params || {};
  const [counter, setCounter] = useState<number | null>(10);
  const hasRun = useRef(false);

  // ✅ Get order status
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderStatusQuery(
    orderId,
    { skip: !orderId },
  );

  // ✅ Clear cart when payment is successful
  useEffect(() => {
    if (orderData?.data?.paymentStatus === "paid" && !hasRun.current) {
      hasRun.current = true;
      clearCart();
    }
  }, [orderData, clearCart]);

  // ✅ Auto redirect countdown
  useEffect(() => {
    if (counter === null || counter === 0) {
      navigation.replace("OrdersScreen");
      return;
    }

    const timer = setTimeout(() => {
      setCounter((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter, navigation]);

  // ✅ Handle back button press (disable back navigation)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      // Prevent going back
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // ✅ Handle manual navigation
  const handleGoToOrders = () => {
    setCounter(null);
    navigation.replace("OrdersScreen");
  };

  const handleContinueShopping = () => {
    setCounter(null);
    navigation.navigate("RemediesScreen");
  };

  return (
    <SuccessScreen
      title="Payment Successful!"
      description="Your product order has been successfully placed. You can track your order status from the orders screen."
      buttons={[
        {
          title: "Continue Shopping",
          variant: "outline",
          onPress: handleContinueShopping,
        },
        {
          title: "Go to My Orders",
          onPress: handleGoToOrders,
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
        {/* ✅ Order ID */}
        {orderId && (
          <>
            <SansText
              style={{
                fontSize: 14,
                color: "#6B6B6B",
                textAlign: "center",
              }}
            >
              Order ID
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
              {orderId}
            </SansText>
          </>
        )}

        {/* ✅ Countdown Timer */}
        {counter !== null && (
          <SansText
            style={{
              fontSize: 12,
              color: "#999",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Redirecting to My Orders in{" "}
            <SansText
              style={{
                fontFamily: "GeneralSans-Bold",
                fontSize: 12,
                color: "#d4af37",
              }}
            >
              {counter}
            </SansText>{" "}
            second{counter !== 1 && "s"}...
          </SansText>
        )}
      </View>
    </SuccessScreen>
  );
};

export default OrderSuccessful;