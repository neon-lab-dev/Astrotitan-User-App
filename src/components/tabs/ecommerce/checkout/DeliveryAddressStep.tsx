import React, {
  useEffect,
  useState,
} from "react";

import { Text, View } from "react-native";

import AddressCard from "../../profile/address/AddressCard";
import CheckoutAddressForm from "../../profile/address/CheckoutAddressForm";
import AddressSelectionSheet from "../../../reusable/BottomSheet/AddressSelectionSheet";

import BottomSheetService from "../../../../redux/features/ui/GlobalSheet/BottomSheetService";

import { useGetMyAddressesQuery } from "../../../../redux/features/address/addressApi";

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
    if (
      value?.addressId &&
      addresses.length > 0
    ) {
      const found =
        addresses.find(
          (item: any) =>
            item._id ===
            value.addressId
        );

      if (found) {
        setSelectedAddress(found);
        return;
      }
    }

    if (
      addresses.length > 0 &&
      !selectedAddress
    ) {
      setSelectedAddress(addresses[0]);

      setValue({
        addressId: addresses[0]._id,
      });
    }
  }, [addresses, value?.addressId]);

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
        />,
        {
          height: 600,
          hasGradient: true,
        }
      );
    };

  if (isLoading) {
    return null;
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
            <View style={{ flex: 1,
        paddingHorizontal: 16,  }}>
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
              <Text>okkdnvjfvn</Text></View>,
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