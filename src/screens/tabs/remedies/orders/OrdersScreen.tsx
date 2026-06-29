import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import SkeletonLoader from "../../../../components/reusable/SkeletonLoader/SkeletonLoade";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import { SansText } from "../../../../components/reusable/Text/SansText";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import OrderCard from "../../../../components/tabs/ecommerce/orders/OrderCard/OrderCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useGetMyProductOrdersQuery } from "../../../../redux/features/orders/orderApi";

/* ---------------- ORDER CARD SKELETON ---------------- */

const OrderCardSkeleton = () => {
  return (
    <View style={styles.skeletonCard}>
      {/* IMAGE */}

      <SkeletonLoader
        width={88}
        height={88}
        borderRadius={16}
        array={[1]}
      />

      {/* RIGHT */}

      <View
        style={{
          flex: 1,
          justifyContent:
            "space-between",
        }}
      >
        {/* TITLE */}

        <SkeletonLoader
          width="82%"
          height={18}
          borderRadius={8}
          array={[1]}
        />

        {/* STATUS */}

        <SkeletonLoader
          width={120}
          height={32}
          borderRadius={999}
          array={[1]}
        />

        {/* DATE */}

        <SkeletonLoader
          width="48%"
          height={14}
          borderRadius={6}
          array={[1]}
        />
      </View>
    </View>
  );
};

const OrdersScreen = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] =
    useState(false);

  /* ---------------- API ---------------- */

  const {
    data: ordersResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMyProductOrdersQuery({
  });

  /* ---------------- DATA ---------------- */

  const orders = useMemo(
    () =>
      ordersResponse?.data
        ?.orders || [],
    [ordersResponse]
  );
  console.log(orders)

  const onRefresh =
    useCallback(
      async () => {
        try {
          setRefreshing(
            true
          );

          await refetch();
        } catch (
        error
        ) {
          console.log(
            "REFRESH ERROR:",
            error
          );
        } finally {
          setRefreshing(
            false
          );
        }
      },
      [refetch]
    );

  /* ---------------- ERROR ---------------- */

  if (isError) {
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
              Failed to load
              orders
            </SansText>
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        {/* HEADER */}

        <AppHeader
          onPressBack={() => {
            navigation.goBack();
          }}
        >
          <AuthTitle title="Orders Tracking">
            <SansText
              style={{
                fontSize: 14,
              }}
            >
              Stay updated on your
              pooja or product
              order.
            </SansText>
          </AuthTitle>
        </AppHeader>

        {/* LIST */}

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing ||
                isFetching
              }
              onRefresh={
                onRefresh
              }
              tintColor="#D4AF37"
              colors={[
                "#D4AF37",
              ]}
              progressBackgroundColor="#FBF7EB"
            />
          }
          contentContainerStyle={
            styles.content
          }
        >
          {/* LOADING */}

          {isLoading ? (
            <>
              {[1, 2, 3, 4].map(
                (item) => (
                  <OrderCardSkeleton
                    key={item}
                  />
                )
              )}
            </>
          ) : orders.length >
            0 ? (
            <>
              {orders.map(
                (
                  item: any
                ) => (
                  <OrderCard
                    key={item._id}
                    title={
                      item?.orderedItems?.[0]
                        ?.productId?.name ||
                      "Order"
                    }
                    image={
                      item?.orderedItems?.[0]
                        ?.productId
                        ?.imageUrls?.[0]
                    }
                    status={
                      item.status || "pending"
                    }
                    date={new Date(
                      item.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",

                        month:
                          "long",

                        year: "numeric",
                      }
                    )}
                    onPress={() => {
                      navigation.navigate(
                        "OrdersDetails", { order: JSON.stringify(item), },
                      );
                    }}
                  />
                )
              )}
            </>
          ) : (
            /* EMPTY */

            <View
              style={{
                paddingTop: 100,

                alignItems:
                  "center",
              }}
            >
              <SansText
                style={{
                  fontSize: 16,

                  color:
                    "#777",
                }}
              >
                No orders found
              </SansText>
            </View>
          )}
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,

    paddingTop: 14,

    paddingBottom: 40,

    gap: 12,
  },

  skeletonCard: {
    backgroundColor:
      "#FBF7EB",

    borderWidth: 1,

    borderColor: "#D4AF37",

    borderRadius: 18,

    padding: 14,

    flexDirection: "row",

    gap: 14,
  },
});