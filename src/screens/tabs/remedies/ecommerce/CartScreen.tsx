import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { decreaseQty, increaseQty, removeFromCart } from "../../../../redux/features/cart/cartSlice";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import { useNavigation } from "@react-navigation/native";
import CartItemCard from "../../../../components/tabs/ecommerce/ecommerce/CartItemCard/CartItemCard";
import SectionTitle from "../../../../components/reusable/SectionTitle/SectionTitle";
import { setCheckoutItems } from "../../../../redux/features/checkout/checkoutSlice";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";

const CartScreen = () => {

  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const updateQty = (
    id: string,
    type: "inc" | "dec"
  ) => {
    const item = cartItems.find(
      (item) => item.id === id
    );

    if (!item) return;

    if (type === "inc") {
      dispatch(increaseQty(id));
    } else {
      if (item.quantity === 1) {
        dispatch(removeFromCart(id));
      } else {
        dispatch(decreaseQty(id));
      }
    }
  };
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = cartItems.length > 0 ? 100 : 0;
  const total = subtotal + shipping;

  return (<AnimatedScreen>
    <ScreenWrapper>

      <AppHeader >
        <AuthTitle title="Cart">
          <SansText style={{ fontSize: 18 }}>
            Total Items - {cartItems.length}
          </SansText>
        </AuthTitle>
      </AppHeader>

      <View style={{ flex: 1 }}>

        {/* 🔥 EMPTY STATE */}
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <SansText style={styles.emptyText}>
              Your cart is empty
            </SansText>

            <ReusableButton
              title="Explore Products"
              onPress={() => navigation.replace("RemediesScreen")}
              width="60%"
            />
          </View>
        ) : (
          <>
            {/* CART ITEMS */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ padding: 16 }}>
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    quantity={item.quantity}
                    mode="cart"
                    onIncrease={() => updateQty(item.id, "inc")}
                    onDecrease={() => updateQty(item.id, "dec")}
                    onRemove={() => dispatch(removeFromCart(item.id))}
                  />
                ))}
              </View>
            </ScrollView>

            {/* SUMMARY */}
            <View style={styles.summary}>
              <SectionTitle title='Order Summary' titleFontSize={18} />

              <View style={{ marginTop: 12, gap: 12 }}>
                <Row label="Subtotal" value={`₹ ${subtotal}/-`} />
                <Row label="Shipping Charges" value={`₹ ${shipping}/-`} />
                <Row label="Discount Applied" value="NA" />
              </View>

              <View style={styles.divider} />

              <Row label="Total" value={`₹ ${total}/-`} bold />

              <View style={{ padding: 16 }}>
                <ReusableButton
                  title="Proceed To Checkout"
                  onPress={() => {
                    dispatch(
                      setCheckoutItems(
                        cartItems
                      )
                    );

                    navigation.navigate("CheckoutScreen")
                  }}
                  width="100%"
                />
              </View>
            </View>
          </>
        )}

      </View>

    </ScreenWrapper></AnimatedScreen>
  );
};

export default CartScreen;

/* ---------- ROW ---------- */

const Row = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <View style={styles.rowBetween}>
    <SansText style={bold ? styles.bold : styles.normal}>
      {label}
    </SansText>
    <SansText style={styles.bold}>
      {value}
    </SansText>
  </View>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({

  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
    marginBottom: 12,
  },

  image: {
    width: 86,
    height: 86,
    borderRadius: 10,
  },

  right: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  title: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
    color: "#0D0D0D",
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },

  price: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
    color: "#0D0D0D",
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 10,
  },

  qtyBtn: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
  },

  qtyText: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
  },

  summary: {
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#E6D18B",
    marginVertical: 10,
  },

  bold: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
  },

  normal: {
    color: "#000",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  emptyText: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
  },

});