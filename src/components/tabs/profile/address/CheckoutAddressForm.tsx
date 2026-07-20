import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";

import FormInput from "../../../reusable/InputField/FormInput";
import ReusableButton from "../../../reusable/ReusableButton/ReusableButton";
import { SansText } from "../../../reusable/Text/SansText";

import { useAddAddressMutation } from "../../../../redux/features/address/addressApi";
import KeyboardSafeSection from "../../../layout/KeyboardSafeSection";

type AddressFormType = {
  fullName: string;
  phoneNumber: string;
  alternativePhoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  type: "home" | "office";
};

type Props = {
  onSuccess: (address: any) => void;
};

const CheckoutAddressForm = ({
  onSuccess,
}: Props) => {
  const [addAddress, { isLoading }] =
    useAddAddressMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<AddressFormType>({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      alternativePhoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      type: "home",
    },
    mode: "onChange",
  });

  const selectedType =
    watch("type");

  const onSubmit = async (
    data: AddressFormType
  ) => {
    try {
      const response =
        await addAddress(
          data
        ).unwrap();

      onSuccess(
        response.data
      );
    } catch (error) {
      console.log(
        "ADD ADDRESS ERROR",
        error
      );
    }
  };

  return (
    <View
      style={{
        gap: 16,
      }}
    >
      <KeyboardSafeSection
        contentContainerStyle={{
          gap: 16,
          paddingTop: 16
        }}
      >
        {/* FULL NAME */}
        <FormInput
          control={control}
          name="fullName"
          label="Full Name"
          placeholder="Enter full name"
          rules={{
            required:
              "Required",
          }}
        />

        {/* PHONE */}
        <FormInput
          control={control}
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter phone number"
          keyboardType="numeric"
          rules={{
            required:
              "Required",
          }}
        />

        {/* ALT PHONE */}
        <FormInput
          control={control}
          name="alternativePhoneNumber"
          label="Alternative Phone Number"
          placeholder="Enter alternative number"
          keyboardType="numeric"
        />

        {/* ADDRESS LINE 1 */}
        <FormInput
          control={control}
          name="addressLine1"
          label="Flat / Apartment / Floor"
          placeholder="Enter address"
          rules={{
            required:
              "Required",
          }}
        />

        {/* ADDRESS LINE 2 */}
        <FormInput
          control={control}
          name="addressLine2"
          label="Area / Locality"
          placeholder="Enter locality"
          rules={{
            required:
              "Required",
          }}
        />

        {/* CITY */}
        <FormInput
          control={control}
          name="city"
          label="City"
          placeholder="Enter city"
          rules={{
            required:
              "Required",
          }}
        />

        {/* STATE + PINCODE */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          <View
            style={{ flex: 1 }}
          >
            <FormInput
              control={control}
              name="state"
              label="State"
              placeholder="Enter state"
              rules={{
                required:
                  "Required",
              }}
            />
          </View>

          <View
            style={{ flex: 1 }}
          >
            <FormInput
              control={control}
              name="pinCode"
              label="Pincode"
              placeholder="Enter pincode"
              keyboardType="numeric"
              rules={{
                required:
                  "Required",

                pattern: {
                  value:
                    /^[0-9]{6}$/,

                  message:
                    "Invalid pincode",
                },
              }}
            />
          </View>
        </View>

        {/* COUNTRY */}
        {/* <FormInput
              control={control}
              name="country"
              label="Country"
              placeholder="Enter country"
              rules={{
                required:
                  "Required",
              }}
            /> */}

        <View
          style={{
            height: 1,
            backgroundColor:
              "#E6D18B",
          }}
        />

        {/* ADDRESS TYPE */}
        <View>
          <SansText
            style={{
            }}
          >
            Save Address Type As
          </SansText>

          <View
            style={{
              flexDirection:
                "row",

              gap: 12,
            }}
          >
            {[
              "home",
              "office",
            ].map((type) => {
              const isSelected =
                selectedType ===
                type;

              return (
                <TouchableOpacity
                  key={type}
                  onPress={() =>
                    setValue(
                      "type",
                      type as
                      | "home"
                      | "office"
                    )
                  }
                  style={{
                    paddingVertical: 12,

                    flexDirection:
                      "row",

                    gap: 8,

                    alignItems:
                      "center",

                    paddingHorizontal: 18,

                    borderRadius: 12,

                    borderWidth: 1,

                    borderColor:
                      "#D4AF37",

                    backgroundColor:
                      isSelected
                        ? "#D4AF37"
                        : "#FBF7EB",
                  }}
                >
                  <SansText
                    style={{
                      color:
                        "#0D0D0D",
                    }}
                  >
                    {type}
                  </SansText>

                  <View
                    style={{
                      height: 12,

                      width: 12,

                      borderWidth: 1,

                      borderRadius: 12,

                      borderColor:
                        isSelected
                          ? "#FBF7EB"
                          : "#D4AF37",

                      backgroundColor:
                        "#FBF7EB",
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <ReusableButton
          title="Save Address"
          onPress={handleSubmit(
            onSubmit
          )}
          loading={isLoading}
          disabled={
            !isValid ||
            isLoading
          }
        />
      </KeyboardSafeSection>

    </View>
  );
};

export default CheckoutAddressForm;