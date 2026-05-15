import FormInput from "@/components/reusable/InputField/FormInput";
import { SansText } from "@/components/reusable/Text/SansText";

import React, {
  useEffect,
} from "react";

import {
  TouchableOpacity,
  View,
} from "react-native";

import {
  useForm,
} from "react-hook-form";

type FormType = {
  addressLine1: string;
  addressLine2: string;
  state: string;
  pincode: string;
  type: "home" | "office";
  saveForFuture: boolean;
};

interface Props {
  value: FormType;
  setValue: (data: FormType) => void;
}

const DeliveryAddressStep = ({
  value,
  setValue,
}: Props) => {
  const {
    control,
    watch,
    formState: { isValid },
    setValue: setFormValue,
  } = useForm<FormType>({
    defaultValues: {
      addressLine1:
        value?.addressLine1 || "",

      addressLine2:
        value?.addressLine2 || "",

      state: value?.state || "",

      pincode:
        value?.pincode || "",

      type:
        value?.type || "home",

      saveForFuture:
        value?.saveForFuture ||
        false,
    },

    mode: "onChange",
  });

  const formValues = watch();

  const selectedType =
    watch("type");

  const saveChecked = watch(
    "saveForFuture"
  );

  // 🔥 SYNC TO PARENT
  useEffect(() => {
    setValue(formValues);
  }, [formValues]);

  return (
    <View
      style={{
        gap: 16,
        paddingTop: 12,
        backgroundColor:"transparent"
      }}
    >
      {/* ADDRESS LINE 1 */}
      <FormInput
        control={control}
        name="addressLine1"
        label="Flat No. / Apartment Name / Floor No."
        placeholder="Enter your address..."
        rules={{
          required: "Required",
        }}
      />

      {/* ADDRESS LINE 2 */}
      <FormInput
        control={control}
        name="addressLine2"
        label="Locality / Area Name / City"
        placeholder="Enter your address..."
        rules={{
          required: "Required",
        }}
      />

      {/* STATE + PINCODE */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <FormInput
            control={control}
            name="state"
            label="State"
            placeholder="Enter your state..."
            rules={{
              required: "Required",
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <FormInput
            control={control}
            name="pincode"
            label="Pincode"
            placeholder="Enter your pincode..."
            rules={{
              required: "Required",

              pattern: {
                value:
                  /^[0-9]{6}$/,

                message:
                  "Enter valid 6-digit pincode",
              },
            }}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* DIVIDER */}
      <View
        style={{
          height: 1,
          backgroundColor:
            "#E6D18B",
          marginVertical: 4,
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
            flexDirection: "row",
            gap: 12,
          }}
        >
          {[
            "home",
            "office",
          ].map((type) => {
            const isSelected =
              selectedType === type;

            return (
              <TouchableOpacity
                key={type}
                onPress={() =>
                  setFormValue(
                    "type",
                    type as
                      | "home"
                      | "office"
                  )
                }
                style={{
                  paddingVertical: 12,

                  flexDirection: "row",

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

      {/* CHECKBOX */}
      <TouchableOpacity
        onPress={() =>
          setFormValue(
            "saveForFuture",
            !saveChecked
          )
        }
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 8,
        }}
      >
        <View
          style={{
            backgroundColor: "#000",
            padding: 2,
            borderRadius: 3,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,

              backgroundColor:
                saveChecked
                  ? "#D4AF37"
                  : "#fff",
            }}
          />
        </View>

        <SansText>
          Save this address for
          future orders
        </SansText>
      </TouchableOpacity>
    </View>
  );
};

export default DeliveryAddressStep;