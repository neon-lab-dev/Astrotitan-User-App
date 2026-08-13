import LocationIcon from "@/assets/icons/navigation/location.svg";
  import React from "react";

import {
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useDeleteAddressMutation, useGetMyAddressesQuery } from "../../../../redux/features/address/addressApi";
import BottomSheetService from "../../../../redux/features/ui/GlobalSheet/BottomSheetService";
import DeleteAddressSection from "../../../../components/reusable/BottomSheet/DeleteAddressSectoin";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/types";
import AddressCardSkeleton from "../../../../components/tabs/profile/address/AddressCardSkeleton/AddressCardSkeleton";
import AddressCard from "../../../../components/tabs/profile/address/AddressCard";

const AddressScreen = () => {

  const {
    data,
    isLoading,
    refetch,
    isFetching
  } = useGetMyAddressesQuery({});
 type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const [
    deleteAddress,
    {
      isLoading:
      deleteLoading,
    },
  ] = useDeleteAddressMutation();


  const [refreshing, setRefreshing] =
    React.useState(false);

  const addresses =
    data?.data || [];

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
                <AddressCardSkeleton
                  key={item}
                />
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
                <SansText> Add an address for deliveries, prasad, or home pooja.
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
                  textAlign:"center",
                  lineHeight: 24,
                  color:"#6B6B6B",
                }}
              >
                No saved addresses found.
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
                      navigation.navigate("AddAddress",{mode:"edit" ,data: JSON.stringify(item)})
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
              navigation.navigate("AddAddress",{mode:"add"})
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

export default AddressScreen;