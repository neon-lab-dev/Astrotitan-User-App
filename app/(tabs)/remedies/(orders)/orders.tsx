import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import { SansText } from "@/components/reusable/Text/SansText";

import OrderCard from "@/components/tabs/ecommerce/orders/OrderCard/OrderCard";

import { router } from "expo-router";

import React from "react";

import {
  ScrollView,
  StyleSheet
} from "react-native";

/* ---------------- DUMMY DATA ---------------- */

const ORDERS = [
  {
    id: "1",

    title: "5 Mukhi Rudraksha Mala",

    status: "out_for_delivery",

    date: "18 March 2026",

    image: require("@/assets/images/dummy/gems/gems1.png"),
  },

  {
    id: "2",

    title: "Blue Sapphire (Neelam)",

    status: "shipped",

    date: "18 March 2026",

    image: require("@/assets/images/dummy/gems/gems2.png"),
  },

  {
    id: "3",

    title: "Hanuman Pooja - Temple",

    status: "scheduled",

    date: "19 March 2026",

    image: require("@/assets/images/dummy/gems/gems1.png"),
  },

  {
    id: "4",

    title: "Maha Laxmi Yantra",

    status: "delivered",

    date: "20 March 2026",
    image: require("@/assets/images/dummy/gems/gems2.png"),
  },

  {
    id: "5",

    title: "Protection Bracelet",

    status: "cancelled",

    date: "21 March 2026",

    image: require("@/assets/images/dummy/gems/gems1.png"),
  },
];

const Orders = () => {
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        {/* HEADER */}

        <AppHeader
          onPressBack={() => {
            router.back();
          }}
        >
          <AuthTitle title="Orders Tracking">
            <SansText
              style={{
                fontSize: 16,
              }}
            >
              Stay updated on your pooja or
              product order.
            </SansText>
          </AuthTitle>
        </AppHeader>

        {/* LIST */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.content
          }
        >
          {ORDERS.map((item) => (
            <OrderCard
              key={item.id}
              title={item.title}
              image={item.image}
              status={item.status as any}
              date={item.date}
              onPress={() => {
                router.push(
                  `/(tabs)/remedies/(orders)/${item.id}`
                )
              }}
            />
          ))}
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default Orders;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,

    paddingTop: 14,

    paddingBottom: 40,

    gap: 12,
  },
});