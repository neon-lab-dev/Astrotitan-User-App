import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import SectionTitle from "@/components/reusable/SectionTitle/SectionTitle";

import { SansText } from "@/components/reusable/Text/SansText";
import { selectToken } from "@/redux/features/auth/authSlice";
import { useCheckoutMutation } from "@/redux/features/product/productsApi";
import { RootState } from "@/redux/store";
import axios from "axios";

import React, { useEffect, useState } from "react";

import { Pressable, StyleSheet, View } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { useSelector } from "react-redux";

interface Props {
  value: any;
  setValue: (data: any) => void;
}

const PaymentStep = ({ value, setValue }: Props) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const token = useSelector(selectToken);
  const [selected, setSelected] = useState(value?.paymentMethod || "cod");

  // 🔥 SYNC TO PARENT
  useEffect(() => {
    setValue({
      paymentMethod: selected,
    });
  }, [selected]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const [checkout] = useCheckoutMutation();

  const shipping = cartItems.length > 0 ? 100 : 0;

  const total = subtotal + shipping;

  const handleCheckout = async () => {
    try {
      // 1. Get Razorpay Key
      const keyData = await axios.get(
        "https://astrotitan-server.onrender.com/api/v1/get-key",
      );

      // 2. Create Order
      const payload = { amount: total };
      const response = await checkout(payload).unwrap();

      // 3. Razorpay Options
      const order = response.data;
      console.log("api response", order);

      const options = {
        key: keyData.data.key,
        amount: order.amount,
        order_id: order.id,
        currency: "INR",
        name: "MITRA Consultancy",
        description: "Course Purchase",
        image: "https://i.ibb.co.com/fzB3sKkh/mitr-consultancy.png",
        prefill: {
          email: "prernabadwane@gmail.com",
          name: "prerna",
        },
        theme: {
          color: "#0099FF",
        },
      };

      // 4. Open Razorpay Native Window
      RazorpayCheckout.open(options)
        .then(async (data) => {
          // SUCCESS

          console.log("Payment Success", data);

          /*
          data contains:
          razorpay_payment_id
          razorpay_order_id
          razorpay_signature
        */

          // OPTIONAL:
          // verify payment manually from frontend

          await axios.post(
            "https://astrotitan-server.onrender.com/api/v1/product-order/verify-payment",
            {
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_order_id: data.razorpay_order_id,
              razorpay_signature: data.razorpay_signature,
            },
          );
        })
        .catch((error) => {
          // FAILED / CANCELLED

          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        paddingTop: 12,
      }}
    >
      {/* PRICE SUMMARY */}
      <View style={styles.summaryCard}>
        <SectionTitle title="Price Summary" titleFontSize={16} />

        <View
          style={{
            marginTop: 14,
            gap: 10,
          }}
        >
          <Row label="Subtotal" value={`₹ ${subtotal}/-`} />

          <Row label="Shipping Charges" value={`₹ ${shipping}/-`} />

          <Row label="Discount Applied" value="NA" />

          <View style={styles.divider} />

          <Row label="Total" value={`₹ ${total}/-`} />
        </View>
      </View>

      {/* PAYMENT OPTIONS */}
      {/* <View
        style={{
          marginTop: 24,
          gap: 14,
        }}
      >
        <PaymentOption
          title="Proceed to Payment"
          selected={
            selected === "online"
          }
          onPress={() =>
            handleCheckout()
          }
        />

      </View> */}

      <ReusableButton
        title={"Proceed to Pay"}
        variant="solid"
        onPress={handleCheckout}
      />
    </View>
  );
};

export default PaymentStep;

/* ------------------------- */
/* PAYMENT OPTION */
/* ------------------------- */

const PaymentOption = ({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionCard, selected && styles.activeOption]}
    >
      <SansText style={styles.optionText}>{title}</SansText>

      <View style={[styles.radio, selected && styles.radioActive]} />
    </Pressable>
  );
};

/* ------------------------- */
/* SUMMARY ROW */
/* ------------------------- */

const Row = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <View style={styles.row}>
    <SansText style={bold ? styles.bold : styles.normal}>{label}</SansText>

    <SansText style={styles.bold}>{value}</SansText>
  </View>
);

/* ------------------------- */
/* STYLES */
/* ------------------------- */

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#FBF7EB",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E6D18B",
  },

  divider: {
    height: 1,

    backgroundColor: "#E6D18B",

    marginVertical: 4,
  },

  row: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  bold: {
    fontFamily: "SatoshiBold",

    fontSize: 18,
  },

  normal: {
    color: "#444",
  },

  optionCard: {
    backgroundColor: "#FBF7EB",

    borderRadius: 16,

    padding: 24,

    borderWidth: 1,

    borderColor: "#D4AF37",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  activeOption: {
    borderColor: "#D4AF37",

    backgroundColor: "#FFF8E1",
  },

  optionText: {
    fontSize: 15,

    fontFamily: "SatoshiMedium",
  },

  radio: {
    width: 18,

    height: 18,

    borderRadius: 999,

    borderWidth: 1.5,

    borderColor: "#D4AF37",
  },

  radioActive: {
    backgroundColor: "#D4AF37",
  },
});
