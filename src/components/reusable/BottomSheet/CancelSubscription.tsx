import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Controller, useForm } from "react-hook-form";

import { SansText } from "../../reusable/Text/SansText";

import { useCancelSubscriptionMutation } from "../../../redux/features/subscribtion/subscriptionApi";

type FormData = {
  cancelReason: string;
};

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

const CancelSubscription = ({
  onClose,
  onSuccess,
}: Props) => {
  const [cancelSubscription, { isLoading }] =
    useCancelSubscriptionMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      cancelReason: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await cancelSubscription({
        cancelReason: data.cancelReason,
      }).unwrap();

      if (response?.success) { 
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <SansText style={styles.label}>
        Why do you want to cancel your subscription?
      </SansText>

      <Controller
        control={control}
        name="cancelReason"
        rules={{
          required: "Please enter a reason.",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[
              styles.input,
              errors.cancelReason && styles.errorInput,
            ]}
            placeholder="Please enter the reason for cancellation..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {errors.cancelReason && (
        <SansText style={styles.errorText}>
          {errors.cancelReason.message}
        </SansText>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.cancelButton}
          onPress={onClose}
        >
          <SansText style={styles.cancelText}>
            Cancel
          </SansText>
        </Pressable>

        <Pressable
          style={styles.submitButton}
          disabled={isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <SansText style={styles.submitText}>
              Submit
            </SansText>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default CancelSubscription;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  input: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: "#222",
  },

  errorInput: {
    borderColor: "#EF4444",
  },

  errorText: {
    color: "#EF4444",
    marginTop: 8,
    fontSize: 13,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  submitButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#444",
    fontWeight: "600",
  },

  submitText: {
    color: "#FFF",
    fontWeight: "700",
  },
});