import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AddressCard from "@/components/reusable/AddressCard/AddressCard";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";

import { Image } from "expo-image";

import { router } from "expo-router";

import React from "react";

import {
    StyleSheet,
    View,
} from "react-native";

/* ---------------- STATUS CONFIG ---------------- */

const cancelOrder = () => {
    console.log("CANCEL ORDER");
};

const trackShipment = () => {
    console.log("TRACK SHIPMENT");
};

const writeReview = () => {
    router.push("/");
};

const reorder = () => {
    console.log("REORDER");
};

export const ORDER_STATUS_CONFIG = {
    placed: {
        title: "Order Placed",

        subtitle:
            "Your order has been placed successfully.",

        color: "#816B22",

        buttonText: "Cancel Order",

        disableButton: false,

        footer:
            "Order can be cancelled before shipping",

        onPress: cancelOrder,
    },

    processing: {
        title: "Order Processing",

        subtitle:
            "Your order is being prepared.",

        color: "#5E5ADB",

        buttonText: "Cancel Order",

        disableButton: false,

        footer:
            "Order can be cancelled before shipping",

        onPress: cancelOrder,
    },

    shipped: {
        title: "Order Shipped",

        subtitle:
            "Your order has been shipped.",

        color: "#111111",

        buttonText: "Track Shipment",

        disableButton: false,

        footer:
            "Expected delivery in 2-3 days",

        onPress: trackShipment,
    },

    out_for_delivery: {
        title: "Out for delivery",

        subtitle:
            "Your order will be delivered today.",

        color: "#1D7A34",

        buttonText: "Out For Delivery",

        disableButton: true,

        footer:
            "Order cannot be cancelled now",

        onPress: () => { },
    },

    delivered: {
        title: "Order Delivered",

        subtitle:
            "Your order was delivered on 1 May 2026.",

        color: "#1D7A34",

        buttonText: "Write a Review",

        disableButton: false,

        footer:
            "Thank you for shopping with us",

        onPress: writeReview,
    },

    cancelled: {
        title: "Order Cancelled",

        subtitle:
            "Your order has been cancelled.",

        color: "#C2371E",

        buttonText: "Reorder",

        disableButton: false,

        footer:
            "Refund will be processed shortly",

        onPress: reorder,
    },
};

const OrderDetails = () => {
    const order = {
        id: "#AT-483921",

        title: "5 Mukhi Rudraksha Mala",

        status: "placed",

        image: require("@/assets/images/dummy/gems/gems1.png"),

        delivery: {
            user: {
                name: "Rohan Deshmukh",

                phone: "+91 9370305059",
            },

            location: {
                line1:
                    "Flat no. 302",

                line2:
                    "Sai Residency, 3rd Floor",

                city:
                    "Pune",

                pincode:
                    "27",
            },
        },
    };

    const statusConfig =
        ORDER_STATUS_CONFIG[
        order.status as keyof typeof ORDER_STATUS_CONFIG
        ];

    return (
        <AnimatedScreen>
            <ScreenWrapper>
                <View style={styles.container}>
                    {/* HEADER */}

                    <AppHeader
                        onPressBack={() => {
                            router.back();
                        }}
                    >
                        <View style={styles.productRow}>
                            <Image
                                source={order.image}
                                style={styles.image}
                                contentFit="cover"
                            />

                            <View style={{ flex: 1 }}>
                                <SatoshiText
                                    style={
                                        styles.productTitle
                                    }
                                >
                                    {order.title}
                                </SatoshiText>

                                <SansText
                                    style={styles.orderId}
                                >
                                    {order.id}
                                </SansText>
                            </View>
                        </View>
                    </AppHeader>

                    {/* STATUS */}
                    <View style={{ paddingHorizontal: 16 }}>
                        <View style={styles.section}>
                            <SatoshiText
                                style={[
                                    styles.statusTitle,
                                    {
                                        color:
                                            statusConfig.color,
                                    },
                                ]}
                            >
                                {statusConfig.title}
                            </SatoshiText>

                            <SansText
                                style={
                                    styles.statusSubtitle
                                }
                            >
                                {statusConfig.subtitle}
                            </SansText>
                        </View>

                        {/* DIVIDER */}

                        <View style={styles.divider} />

                        {/* ADDRESS */}

                        <View style={styles.section}>
                            <SatoshiText
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Delivery details
                            </SatoshiText>

                            <AddressCard
                                data={order.delivery}
                            />
                        </View>

                        {/* BOTTOM */}

                        <View
                            style={
                                styles.bottomContainer
                            }
                        >
                            <ReusableButton
                                title={statusConfig.buttonText}
                                variant="outline"
                                borderColor="#D4AF37"
                                textColor="#8A6B00"
                                onPress={statusConfig.onPress}
                                width="100%"
                                disabled={statusConfig.disableButton}
                            />

                            <SansText
                                style={
                                    styles.footerText
                                }
                            >
                                {statusConfig.footer}
                            </SansText>
                        </View></View>

                </View>
            </ScreenWrapper>
        </AnimatedScreen>
    );
};

export default OrderDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 18,

        color: "#0d0d0d",

        lineHeight: 22,

        fontFamily: "SatoshiBold",
    },

    orderId: {
        marginTop: 2,

        fontSize: 18,

        color: "#0d0d0d",

        fontFamily: "SatoshiBold",
    },

    section: {
        marginTop: 26,
    },

    statusTitle: {
        fontSize: 24,

        lineHeight: 28,

        fontFamily: "SatoshiBold",
    },

    statusSubtitle: {
        marginTop: 4,

        fontSize: 18,

        color: "#0d0d0d",

        lineHeight: 22,
    },

    divider: {
        height: 1,

        backgroundColor: "#E4D7AE",

        marginTop: 22,
    },

    sectionTitle: {
        fontSize: 24,

        color: "#111111",

        fontFamily: "SatoshiBold",

        marginBottom: 14,
    },

    bottomContainer: {
        marginTop: 12,

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