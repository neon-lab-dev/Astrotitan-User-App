import React, { useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
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
  const inputRef = useRef<TextInput>(null);

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

  // Dismiss keyboard on unmount
  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flexContainer}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
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
                  ref={inputRef}
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
                  returnKeyType="done"
                  blurOnSubmit={true}
                  scrollEnabled={true}
                  enablesReturnKeyAutomatically={true}
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CancelSubscription;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    maxHeight: 420, // Match the bottom sheet height
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },

  container: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#0D0D0D",
  },

  input: {
    minHeight: 140,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#bebebe",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#FFFFFF",
    textAlignVertical: "top",
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
    paddingBottom: Platform.OS === "ios" ? 10 : 0,
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
    backgroundColor: "#F5F5F5",
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