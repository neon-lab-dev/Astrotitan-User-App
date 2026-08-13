import React, {
  useEffect,
  useState,
} from "react";

import { ScrollView, View } from "react-native";

import AddressCard from "../../profile/address/AddressCard";
import CheckoutAddressForm from "../../profile/address/CheckoutAddressForm";
import AddressSelectionSheet from "../../../reusable/BottomSheet/AddressSelectionSheet";

import BottomSheetService from "../../../../redux/features/ui/GlobalSheet/BottomSheetService";

import { useGetMyAddressesQuery } from "../../../../redux/features/address/addressApi";
import AddressCardSkeleton from "../../profile/address/AddressCardSkeleton/AddressCardSkeleton";

type FormType = {
  addressId: string;
};

interface Props {
  value: FormType;
  setValue: (
    data: FormType
  ) => void;
}

const DeliveryAddressStep = ({
  value,
  setValue,
}: Props) => {
  const {
    data,
    isLoading,
    refetch,
  } = useGetMyAddressesQuery({});

  const addresses =
    data?.data || [];

  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState<any>(null);

 useEffect(() => {
  if (addresses.length === 0) return;

  // If parent already has an address, sync it
  if (value?.addressId) {
    const found = addresses.find(
      (item: any) => item._id === value.addressId
    );

    if (found) {
      setSelectedAddress(found);
      return;
    }
  }

  // Otherwise select the first address by default
  const firstAddress = addresses[0];

  setSelectedAddress(firstAddress);

  setValue({
    addressId: firstAddress._id,
  });
}, [addresses]);

  const openAddressBottomSheet =
    () => {
      BottomSheetService.open(
        <AddressSelectionSheet
          addresses={
            addresses
          }
          selectedId={
            selectedAddress?._id
          }
          onSelect={(
            address: any
          ) => {
            setSelectedAddress(
              address
            );

            setValue({
              addressId:
                address._id,
            });

            BottomSheetService.close();
          }}
          onPress={() => {
            BottomSheetService.close();

            BottomSheetService.open(
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                }}
              >
                <CheckoutAddressForm
                  onSuccess={(address) => {
                    setSelectedAddress(address);

                    setValue({
                      addressId: address._id,
                    });

                    refetch();

                    BottomSheetService.close();
                  }}
                />
              </View>,
              {
                height: 700,
                hasGradient: true,
              }
            );
          }}
        />,
        {
          height: 600,
          hasGradient: true,
        }
      );
    };

  if (isLoading) {
    return (<ScrollView
      showsVerticalScrollIndicator={
        false
      }
      contentContainerStyle={{
        paddingVertical: 16,
        gap: 18,
        paddingBottom: 24,
      }}
    >
      {[1].map(
        (item) => (
          <AddressCardSkeleton
            key={item}
          />
        )
      )}
    </ScrollView>);
  }

  if (
    addresses.length === 0
  ) {
    return (

      <CheckoutAddressForm
        onSuccess={(
          address
        ) => {
          setSelectedAddress(
            address
          );

          setValue({
            addressId:
              address._id,
          });

          refetch();
        }}
      />



    );
  }

  if (!selectedAddress) {
    return null;
  }

  return (
    <View style={{ paddingTop: 16 }}>
      <AddressCard
        data={selectedAddress}
        showChangeButton
        onChangeAddress={() => {
          if (
            addresses.length > 1
          ) {
            openAddressBottomSheet();
            return;
          }

          BottomSheetService.open(
            <View style={{
              flex: 1,
              paddingHorizontal: 16,
            }}>
              <CheckoutAddressForm
                onSuccess={(
                  address
                ) => {
                  setSelectedAddress(
                    address
                  );

                  setValue({
                    addressId:
                      address._id,
                  });

                  refetch();

                  BottomSheetService.close();
                }}
              />
            </View>,
            {
              height: 700,
              hasGradient: true,
            }
          );
        }}
      />
    </View>
  );
};

export default DeliveryAddressStep;