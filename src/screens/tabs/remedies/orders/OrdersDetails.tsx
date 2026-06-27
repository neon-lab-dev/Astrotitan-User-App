import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import { SansText } from "../../../../components/reusable/Text/SansText";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import AddressCard from "../../../../components/tabs/profile/address/AddressCard";

/* ---------------- ACTIONS ---------------- */

const cancelOrder = () => {
  console.log(
    "CANCEL ORDER"
  );
};

const trackShipment =
  () => {
    console.log(
      "TRACK SHIPMENT"
    );
  };

const writeReview =
  () => {
    console.log(
      "WRITE REVIEW"
    );
  };

const reorder = () => {
  console.log("REORDER");
};

/* ---------------- STATUS CONFIG ---------------- */

export const ORDER_STATUS_CONFIG =
{
  pending: {
    title: "Order Pending",

    subtitle:
      "Your order is awaiting confirmation.",

    color: "#B38A00",

    buttonText:
      "Cancel Order",

    disableButton:
      false,

    footer:
      "Order can be cancelled before processing",

    onPress:
      cancelOrder,
  },

  placed: {
    title:
      "Order Placed",

    subtitle:
      "Your order has been placed successfully.",

    color: "#816B22",

    buttonText:
      "Cancel Order",

    disableButton:
      false,

    footer:
      "Order can be cancelled before shipping",

    onPress:
      cancelOrder,
  },

  processing: {
    title:
      "Order Processing",

    subtitle:
      "Your order is being prepared.",

    color: "#5E5ADB",

    buttonText:
      "Cancel Order",

    disableButton:
      false,

    footer:
      "Order can be cancelled before shipping",

    onPress:
      cancelOrder,
  },

  shipped: {
    title:
      "Order Shipped",

    subtitle:
      "Your order has been shipped.",

    color: "#111111",

    buttonText:
      "Track Shipment",

    disableButton:
      false,

    footer:
      "Expected delivery in 2-3 days",

    onPress:
      trackShipment,
  },

  out_for_delivery: {
    title:
      "Out for delivery",

    subtitle:
      "Your order will be delivered today.",

    color: "#1D7A34",

    buttonText:
      "Out For Delivery",

    disableButton:
      true,

    footer:
      "Order cannot be cancelled now",

    onPress: () => { },
  },

  delivered: {
    title:
      "Order Delivered",

    subtitle:
      "Your order was delivered successfully.",

    color: "#1D7A34",

    buttonText:
      "Write a Review",

    disableButton:
      false,

    footer:
      "Thank you for shopping with us",

    onPress:
      writeReview,
  },

  cancelled: {
    title:
      "Order Cancelled",

    subtitle:
      "Your order has been cancelled.",

    color: "#C2371E",

    buttonText:
      "Reorder",

    disableButton:
      false,

    footer:
      "Refund will be processed shortly",

    onPress:
      reorder,
  },
};

const OrdersDetails = () => {
  const route = useRoute<any>();

  const params = route.params || {};

  /* ---------------- GET ORDER ---------------- */

  const rawOrder =
    Array.isArray(
      params.order
    )
      ? params.order[0]
      : params.order;

  const order = rawOrder
    ? JSON.parse(rawOrder)
    : null;

  /* ---------------- NOT FOUND ---------------- */

  if (!order) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <View
            style={{
              flex: 1,

              justifyContent:
                "center",

              alignItems:
                "center",
            }}
          >
            <SansText>
              Order not found
            </SansText>
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  /* ---------------- PRODUCT ---------------- */

  const firstItem =
    order?.orderedItems?.[0];

  const product =
    firstItem?.productId;

  /* ---------------- STATUS ---------------- */

  const currentStatus =
    ORDER_STATUS_CONFIG[
    order?.status as keyof typeof ORDER_STATUS_CONFIG
    ] ||
    ORDER_STATUS_CONFIG.pending;

  /* ---------------- DELIVERY ---------------- */



  const deliveryData = {
    _id: order?.shippingAddress?._id,
    type: order?.shippingAddress?.type || "home",
    fullName: order?.shippingAddress?.fullName || "Customer",
    phoneNumber: order?.shippingAddress?.phoneNumber || "N/A",
    addressLine1: order?.shippingAddress?.address || "",
    addressLine2: order?.shippingAddress?.landmark || "",
    city: order?.shippingAddress?.city || "",
    state: order?.shippingAddress?.state || "",
    pinCode: order?.shippingAddress?.pincode || "",
    country: order?.shippingAddress?.country || "India",
  };
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View
          style={
            styles.container
          }
        >
          {/* HEADER */}

          <AppHeader>
            <AuthTitle title="Order Details">
              <SansText
                style={{
                  fontSize: 16,
                }}
              >
                Track your
                product order
                updates.
              </SansText>
            </AuthTitle>
          </AppHeader>

          {/* PRODUCT */}
          <ScrollView>
            <View
              style={
                styles.productCard
              }
            >
              <View
                style={
                  styles.productRow
                }
              >
                <Image
                  source={
                    product
                      ?.imageUrls?.[0]
                  }
                  style={
                    styles.image
                  }
                />

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <SatoshiText
                    style={
                      styles.productTitle
                    }
                  >
                    {product?.name ||
                      "Order"}
                  </SatoshiText>

                  <SansText
                    style={
                      styles.quantity
                    }
                  >
                    Quantity:{" "}
                    {
                      firstItem?.quantity
                    }
                  </SansText>

                  <SansText
                    style={
                      styles.orderId
                    }
                  >
                    {
                      order?.orderId
                    }
                  </SansText>
                </View>
              </View>
            </View>

            {/* STATUS */}

            <View
              style={{
                paddingHorizontal: 16,
              }}
            >
              <View
                style={
                  styles.section
                }
              >
                <SatoshiText
                  style={[
                    styles.statusTitle,
                    {
                      color:
                        currentStatus.color,
                    },
                  ]}
                >
                  {
                    currentStatus.title
                  }
                </SatoshiText>

                <SansText
                  style={
                    styles.statusSubtitle
                  }
                >
                  {
                    currentStatus.subtitle
                  }
                </SansText>
              </View>

              {/* DIVIDER */}

              <View
                style={
                  styles.divider
                }
              />

              {/* ADDRESS */}

              <View
                style={
                  styles.section
                }
              >
                <SatoshiText
                  style={
                    styles.sectionTitle
                  }
                >
                  Delivery
                  details
                </SatoshiText>

                <AddressCard
                  data={
                    deliveryData
                  }
                />
              </View>

              {/* TOTAL */}

              <View
                style={
                  styles.section
                }
              >
                <View
                  style={
                    styles.totalRow
                  }
                >
                  <SansText
                    style={
                      styles.totalLabel
                    }
                  >
                    Total Amount
                  </SansText>

                  <SatoshiText
                    style={
                      styles.totalAmount
                    }
                  >
                    ₹
                    {
                      order?.totalAmount
                    }
                  </SatoshiText>
                </View>
              </View>

              {/* BUTTON */}

              <View
                style={
                  styles.bottomContainer
                }
              >
                <ReusableButton
                  title={
                    currentStatus.buttonText
                  }
                  variant="outline"
                  borderColor="#D4AF37"
                  textColor="#8A6B00"
                  onPress={
                    currentStatus.onPress
                  }
                  width="100%"
                  disabled={
                    currentStatus.disableButton
                  }
                />

                <SansText
                  style={
                    styles.footerText
                  }
                >
                  {
                    currentStatus.footer
                  }
                </SansText>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default OrdersDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  productCard: {
    marginTop: 18,

    marginHorizontal: 16,

    backgroundColor:
      "#FBF7EB",

    borderWidth: 1,

    borderColor: "#D4AF37",

    borderRadius: 16,

    padding: 16,
  },

  productRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,
  },

  image: {
    width: 83,

    height: 83,

    borderRadius: 14,
  },

  productTitle: {
    fontSize: 16,

    color: "#0d0d0d",

    lineHeight: 22,

    fontFamily:
      "Satoshi-Bold",
  },

  quantity: {
    marginTop: 6,

    fontSize: 14,

    color: "#777",
  },

  orderId: {
    marginTop: 4,

    fontSize: 14,

    color: "#816B22",

    fontFamily:
      "Satoshi-Bold",
  },

  section: {
    marginTop: 26,
  },

  statusTitle: {
    fontSize: 21,

    lineHeight: 28,

    fontFamily:
      "Satoshi-Bold",
  },

  statusSubtitle: {
    marginTop: 4,

    fontSize: 14,

    color: "#0d0d0d",

    lineHeight: 22,
  },

  divider: {
    height: 1,

    backgroundColor:
      "#E4D7AE",

    marginTop: 22,
  },

  sectionTitle: {
    fontSize: 21,

    color: "#111111",

    fontFamily:
      "Satoshi-Bold",

    marginBottom: 14,
  },

  totalRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  totalLabel: {
    fontSize: 16,

    color: "#555",
  },

  totalAmount: {
    fontSize: 21,

    color: "#0D0D0D",

    fontFamily:
      "Satoshi-Bold",
  },

  bottomContainer: {
    marginTop: 24,

    paddingBottom: 24,

    gap: 10,
  },

  footerText: {
    textAlign: "center",

    fontSize: 11,

    color: "#777",

    lineHeight: 16,
  },
});