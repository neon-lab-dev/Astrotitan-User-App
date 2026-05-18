import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import KeyboardSafeSection from "@/components/layout/KeyboardSafeSection";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import FormInput from "@/components/reusable/InputField/FormInput";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";

import {
  useAddAddressMutation,
  useUpdateAddressMutation,
} from "@/redux/features/address/addressApi";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import React, {
  useEffect,
} from "react";

import { useForm } from "react-hook-form";

import {
  TouchableOpacity,
  View
} from "react-native";

type FormType = {
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

const AddAddress = () => {
  const params = useLocalSearchParams();

  const isEdit =
    params.mode === "edit";

  const parsedData =
    params.data
      ? JSON.parse(
        params.data as string
      )
      : null;

  const [
    addAddress,
    {
      isLoading: addLoading,
    },
  ] = useAddAddressMutation();

  const [
    updateAddress,
    {
      isLoading: updateLoading,
    },
  ] = useUpdateAddressMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<FormType>({
    defaultValues: {
      fullName: "",

      phoneNumber: "",

      alternativePhoneNumber:
        "",

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

  /* =======================================================
   * PREFILL EDIT DATA
   * ======================================================= */

  useEffect(() => {
    if (
      isEdit &&
      parsedData
    ) {
      reset({
        fullName:
          parsedData.fullName ||
          "",

        phoneNumber:
          parsedData.phoneNumber ||
          "",

        alternativePhoneNumber:
          parsedData.alternativePhoneNumber ||
          "",

        addressLine1:
          parsedData.addressLine1 ||
          "",

        addressLine2:
          parsedData.addressLine2 ||
          "",

        city:
          parsedData.city || "",

        state:
          parsedData.state || "",

        pinCode:
          parsedData.pinCode ||
          "",

        country:
          parsedData.country ||
          "India",

        type:
          parsedData.type ||
          "home",
      });
    }
  }, []);

  /* =======================================================
   * SUBMIT
   * ======================================================= */

  const onSubmit = async (
    data: FormType
  ) => {
    try {
      if (isEdit) {
        await updateAddress({
          id: parsedData?._id,

          body: data,
        }).unwrap();
      } else {
        await addAddress(
          data
        ).unwrap();
      }

      router.replace(
        "/(tabs)/profile/address/address"
      );
    } catch (err) {
      console.log(
        "ADDRESS ERROR:",
        err
      );
    }
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        {/* HEADER */}
        <AppHeader>
          <AuthTitle
            title={
              isEdit
                ? "Edit Address"
                : "Delivery Address"
            }
          />
        </AppHeader>

        <View
          style={{
            flex: 1,
            justifyContent:
              "space-between",

            padding: 16,
          }}
        >
          <KeyboardSafeSection
            contentContainerStyle={{
              gap: 16,
              paddingBottom: 24,
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
                  marginBottom: 8,
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
          </KeyboardSafeSection>

          {/* BUTTON */}
          <ReusableButton
            title={
              isEdit
                ? "Update Address"
                : "Add Address"
            }
            onPress={handleSubmit(
              onSubmit
            )}
            loading={
              addLoading ||
              updateLoading
            }
            disabled={
              !isValid ||
              addLoading ||
              updateLoading
            }
            style={{
              marginTop: 24,
            }}
          />
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default AddAddress;