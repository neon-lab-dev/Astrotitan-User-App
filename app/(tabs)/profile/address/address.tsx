import LocationIcon from "@/assets/icons/navigation/location.svg";
import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import DeleteAddressSection from "@/components/reusable/BottomSheet/DeleteAddressSectoin";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";
import { SansText } from "@/components/reusable/Text/SansText";
import AddressCard from "@/components/tabs/profile/address/AddressCard";

import {
    useDeleteAddressMutation,
    useGetMyAddressesQuery,
} from "@/redux/features/address/addressApi";

import BottomSheetService from "@/redux/features/ui/GlobalSheet/BottomSheetService";

import { router } from "expo-router";

import React from "react";

import {
    RefreshControl,
    ScrollView,
    View,
} from "react-native";

const Address = () => {
  /* =======================================================
   * API
   * ======================================================= */

  const {
    data,
    isLoading,
    refetch,
    isFetching
  } = useGetMyAddressesQuery({});

  const [
    deleteAddress,
    {
      isLoading:
        deleteLoading,
    },
  ] = useDeleteAddressMutation();

  /* =======================================================
   * STATES
   * ======================================================= */

  const [refreshing, setRefreshing] =
    React.useState(false);

  const addresses =
    data?.data || [];

  /* =======================================================
   * REFRESH
   * ======================================================= */

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      await refetch();
    } catch (error) {
      console.log(
        "REFETCH ERROR:",
        error
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* =======================================================
   * DELETE
   * ======================================================= */

  const onPressDelete = (
    id: string
  ) => {
    BottomSheetService.open(
      <DeleteAddressSection
        onCancel={
          BottomSheetService.close
        }
        onDelete={async () => {
          try {
            await deleteAddress(
              id
            ).unwrap();

            BottomSheetService.close();
          } catch (error) {
            console.log(
              "DELETE ADDRESS ERROR:",
              error
            );
          }
        }}
      />,
      {
        height: 400,
        hasGradient: true,
      }
    );
  };

  /* =======================================================
   * SKELETON LOADER
   * ======================================================= */

  if (isLoading || isFetching) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppHeader>
            <AuthTitle title="Saved Address" />
          </AppHeader>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              padding: 16,
              gap: 18,
              paddingBottom: 24,
            }}
          >
            {[1, 2, 3].map(
              (item) => (
                 <View
                 key={item}
      style={{
        gap: 14,
      }}
    >
      {/* CARD */}
      <View
        style={{
          backgroundColor: "#FBF7EB",

          borderRadius: 16,

          padding: 16,

          borderWidth: 1,

          borderColor: "#D4AF37",

          gap: 14,
        }}
      >
        {/* NAME ROW */}
        <View
          style={{
            flexDirection: "row",

            alignItems: "flex-start",

            justifyContent:
              "space-between",

            gap: 12,
          }}
        >
          {/* LEFT */}
          <View
            style={{
              flexDirection: "row",

              alignItems: "center",

              gap: 10,

              flex: 1,
            }}
          >
            {/* USER ICON */}
            <SkeletonLoader
              width={18}
              height={18}
              borderRadius={999}
              array={[1]}
            />

            {/* NAME */}
            <SkeletonLoader
              width="58%"
              height={16}
              borderRadius={8}
              array={[1]}
            />
          </View>

          {/* TYPE BADGE */}
          <SkeletonLoader
            width={68}
            height={28}
            borderRadius={999}
            array={[1]}
          />
        </View>

        {/* PHONE */}
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",

            gap: 10,
          }}
        >
          {/* CALL ICON */}
          <SkeletonLoader
            width={18}
            height={18}
            borderRadius={999}
            array={[1]}
          />

          {/* PHONE TEXT */}
          <SkeletonLoader
            width="42%"
            height={14}
            borderRadius={8}
            array={[1]}
          />
        </View>

        {/* ADDRESS */}
        <View
          style={{
            flexDirection: "row",

            gap: 10,
          }}
        >
          {/* LOCATION ICON */}
          <SkeletonLoader
            width={18}
            height={18}
            borderRadius={999}
            array={[1]}
          />

          {/* ADDRESS LINES */}
          <View
            style={{
              flex: 1,

              gap: 10,
            }}
          >
            <SkeletonLoader
              width="95%"
              height={14}
              borderRadius={8}
              array={[1]}
            />

            <SkeletonLoader
              width="78%"
              height={14}
              borderRadius={8}
              array={[1]}
            />

            <SkeletonLoader
              width="55%"
              height={14}
              borderRadius={8}
              array={[1]}
            />
          </View>
        </View>
      </View>

      {/* BUTTONS */}
      <View
        style={{
          flexDirection: "row",

          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <SkeletonLoader
            width="100%"
            height={52}
            borderRadius={999}
            array={[1]}
          />
        </View>

        <View style={{ flex: 1 }}>
          <SkeletonLoader
            width="100%"
            height={52}
            borderRadius={999}
            array={[1]}
          />
        </View>
      </View>
    </View>
              )
            )}
          </ScrollView>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  /* =======================================================
   * MAIN UI
   * ======================================================= */

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        {/* HEADER */}
        <AppHeader>
          <AuthTitle
            title={
              addresses.length <
              1
                ? "No saved addresses"
                : "Saved Address"
            }
          >
            {addresses.length <
              1 && (
              <SansText>
                Add an address
                for deliveries,
                prasad, or home
                pooja.
              </SansText>
            )}
          </AuthTitle>
        </AppHeader>

        <View
          style={{
            flex: 1,

            paddingHorizontal: 16,

            paddingBottom: 16,
          }}
        >
          {/* EMPTY STATE */}
          {addresses.length <
          1 ? (
            <View
              style={{
                flex: 1,

                justifyContent:
                  "center",

                alignItems:
                  "center",

                paddingHorizontal: 20,
              }}
            >
              <LocationIcon
                height={124}
                width={124}
              />

              <SansText
                style={{
                  marginTop: 18,

                  textAlign:
                    "center",

                  lineHeight: 24,

                  color:
                    "#6B6B6B",
                }}
              >
                No saved
                addresses found.
              </SansText>
            </View>
          ) : (
            <ScrollView
              style={{
                flex: 1,
              }}
              showsVerticalScrollIndicator={
                false
              }
              refreshControl={
                <RefreshControl
                  refreshing={
                    refreshing
                  }
                  onRefresh={
                    onRefresh
                  }
                  tintColor="#D4AF37"
                />
              }
              contentContainerStyle={{
                paddingVertical: 24,

                gap: 18,

                paddingBottom: 32,
              }}
            >
              {addresses.map(
                (
                  item: any
                ) => (
                  <AddressCard
                    key={
                      item._id
                    }
                    data={item}
                    onEdit={() => {
                      router.push(
                        {
                          pathname:
                            "/(tabs)/profile/address/add-address",

                          params:
                            {
                              mode:
                                "edit",

                              data: JSON.stringify(
                                item
                              ),
                            },
                        }
                      );
                    }}
                    onDelete={() =>
                      onPressDelete(
                        item._id
                      )
                    }
                    showActions
                  />
                )
              )}
            </ScrollView>
          )}

          {/* ADD BUTTON */}
          <ReusableButton
            title="Add New Address"
            onPress={() => {
              router.push(
                "/(tabs)/profile/address/add-address"
              );
            }}
            disabled={
              deleteLoading
            }
          />
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default Address;