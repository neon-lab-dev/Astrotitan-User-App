
import React from "react";
import {
  View,
} from "react-native";
import {
  useSelector,
} from "react-redux";

import CartItemCard from "../ecommerce/CartItemCard/CartItemCard";
import { RootState } from "../../../../redux/store";
import ContentSection from "../../../reusable/ContentSectoin/ContentSection";
import { SatoshiText } from "../../../reusable/Text/SatoshiText";
import AddressCard from "../../profile/address/AddressCard";
import { SansText } from "../../../reusable/Text/SansText";
import { useGetMyAddressesQuery } from "../../../../redux/features/address/addressApi";
import AddressCardSkeleton from "../../profile/address/AddressCardSkeleton/AddressCardSkeleton";


interface Props {
  value: any;
  setValue: (data: any) => void;
}

const OrderReviewStep = ({
  value,
  setValue,
}: Props) => {
  const cartItems = useSelector(
    (state: RootState) =>
      state.cart.items
  );

  const {
    data,
    isLoading,
    refetch,
  } = useGetMyAddressesQuery({});

  const deliveryAddress = useSelector(
    (state: RootState) =>
      state.checkout.answers.deliveryAddress
  );;

  const address = data?.data?.find(
    (item: any) => item._id === deliveryAddress?.addressId
  );
  const subtotal =
    cartItems.reduce(
      (acc, item) =>
        acc +
        item.price *
        item.quantity,
      0
    );

  const shipping =
    cartItems.length > 0
      ? 100
      : 0;

  const total =
    subtotal + shipping;

  return (
    <View

    >



      {/* PRODUCTS */}
      <View
        style={{
          marginTop: 16,
          gap: 14,
        }}
      >
        {cartItems.map(
          (item) => (
            <CartItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              quantity={
                item.quantity
              }
              mode="review"
            />
          )
        )}
      </View>
      <View style={{ backgroundColor: "#E6D18B", height: 1, marginVertical: 24 }}></View>
      {/* ADDRESS */}
      <View
      >
        <ContentSection titleFontSize={16} sectionStyle={{ marginBottom: 12 }}
          title="Deliver To"
        />

        {isLoading ? (
          <>
            {[1].map((item) => (
              <AddressCardSkeleton key={item} />
            ))}
          </>
        ) : address ? (
          <AddressCard
            data={{
              _id: address._id,
              type: address.type,
              fullName: address.fullName,
              phoneNumber: address.phoneNumber,
              alternativePhoneNumber:
                address.alternativePhoneNumber,
              addressLine1:
                address.addressLine1,
              addressLine2:
                address.addressLine2,
              city: address.city,
              state: address.state,
              pinCode: address.pinCode,
              country: address.country,
            }}
          />
        ) : (
          <SansText
            style={{
              color: "#777",
              textAlign: "center",
              marginTop: 12,
            }}
          >
            Address not found
          </SansText>
        )}
      </View>

      {/* PRICE SUMMARY */}
      <View style={{ backgroundColor: "#E6D18B", height: 1, marginVertical: 24 }}></View>
      <ContentSection titleFontSize={16} sectionStyle={{ marginBottom: 12 }}
        title="Payment Summery"
      />
      <View
        style={{

          backgroundColor: "#FBF7EB",
          padding: 16,
          borderColor: "#D4AF37",
          borderWidth: 1,
          borderRadius: 12
        }}
      >


        <View
          style={{
            marginTop: 12,
            gap: 10,
          }}
        >
          <Row
            label="Subtotal"
            value={`₹ ${subtotal}/-`}
          />

          <Row
            label="Shipping Charges"
            value={`₹ ${shipping}/-`}
          />

        </View>k

        <View
          style={{
            height: 1,
            backgroundColor:
              "#E6D18B",
            marginVertical: 14,
          }}
        />

        <Row
          label="Total"
          value={`₹ ${total}/-`}
        />
      </View>
    </View>
  );
};

export default OrderReviewStep;

const Row = ({
  label,
  value,
  bold,
}: any) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    }}
  >
    <SansText
      style={
        bold
          ? {
            fontFamily:
              "Satoshi-Bold",
            fontSize: 14,
            color: "#0D0D0D"
          }
          : {}
      }
    >
      {label}
    </SansText>

    <SansText
      style={{
        fontFamily:
          "Satoshi-Bold",
        fontSize: 16
      }}
    >
      {value}
    </SansText>
  </View>
);