/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useGetMyAddressesQuery } from "../../../../redux/features/address/addressApi";
import AddressCardSkeleton from "../../profile/address/AddressCardSkeleton/AddressCardSkeleton";
import LocationIcon from '@/assets/icons/navigation/location.svg';
import { SansText } from "../../../reusable/Text/SansText";
import AddressCard from "../../profile/address/AddressCard";

type FormType = {
  addressId: string;
};

interface Props {
  value: FormType;
  setValue: (data: FormType) => void;
}

const DeliveryAddressStep = ({ value, setValue }: Props) => {
  const { data, isLoading, refetch } = useGetMyAddressesQuery({});
  const addresses = data?.data || [];
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Set default selected address
  useEffect(() => {
    if (addresses.length === 0) return;

    // If parent has an address, use it
    if (value?.addressId) {
      const found = addresses.find((item: any) => item._id === value.addressId);
      if (found) {
        setSelectedAddressId(value.addressId);
        return;
      }
    }

    // Otherwise select the first address
    const firstAddress = addresses[0];
    setSelectedAddressId(firstAddress._id);
    setValue({ addressId: firstAddress._id });
  }, [addresses]);

  // Handle address selection
  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    setValue({ addressId });
  };

  if (isLoading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 16,
          gap: 18,
          paddingBottom: 24,
        }}
      >
        {[1, 2].map((item) => (
          <AddressCardSkeleton key={item} />
        ))}
      </ScrollView>
    );
  }

  if (addresses.length === 0) {
    return (
      <View style={{ paddingTop: 16, alignItems: 'center' }}>
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <LocationIcon width={40} height={40} color="#D4AF37" />
          </View>
          <SansText style={{ fontSize: 16, color: '#1a1a2e', marginTop: 12, fontFamily: 'Satoshi-Bold' }}>
            No Address Found
          </SansText>
          <SansText style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center', marginTop: 4 }}>
            Please add a delivery address to continue
          </SansText>
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: 16 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
        }}
      >
        {addresses.map((address: any) => {
          const isSelected = selectedAddressId === address._id;

          return (
            <AddressCard
              key={address._id}
              data={address}
              showSelectOption={true}
              selected={isSelected}
              onSelect={() => handleSelectAddress(address._id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default DeliveryAddressStep;