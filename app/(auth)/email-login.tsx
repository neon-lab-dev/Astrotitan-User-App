
import AuthSecondaryNavigation from "@/components/auth/AuthSecondaryNavigation";
import AuthTitle from "@/components/auth/AuthTitle";
import OrDivider from "@/components/auth/OrDivider";
import TermsAndConditions from "@/components/auth/TermsAndConditions";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import FormInput from "@/components/reusable/InputField/FormInput";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

type LoginForm = {
  email: string;
};

export default function Login() {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
    },
    mode: "onBlur", // 🔥 IMPORTANT
  });

  const email = watch("email");
  const isFormFilled = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  // ✅ GET PARAMS

  const [login, { isLoading, error }] = useLoginMutation();

const onSubmit = async (data: LoginForm) => {
  try {
    const payload = {
      email: data.email,
      phoneNumber: "",
      role: "user",
    };

    await login(payload).unwrap();

    router.push({
      pathname: "/(auth)/otp-screen",
      params: {
        source: "login",
        email: data.email,
      },
    });
  } catch (err: any) {
    console.log("LOGIN ERROR:", err);
  }
};
  return (
    <AnimatedScreen>
    <View style={styles.container}>
      <View>
        <AuthTitle title="Welcome Back "></AuthTitle>

        <View style={{ gap: 26 }}>
          {/* PASSWORD */}
          <FormInput
            control={control}
            name="email"
            label="Email Address"
            variant="text" // 🔥 IMPORTANT
            placeholder="Enter email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
          />

          {/* API ERROR */}
          {error && (
            <SansText style={styles.apiError}>
              {(error as any)?.data?.message || "Login failed"}
            </SansText>
          )}
        </View>
        <OrDivider />
        <ReusableButton
          title="Login with Mobile number"
          variant="outline"
          onPress={() => router.replace("/(auth)/login")}
        />
      </View>
      <View style={{ gap: 24 }}>
        <AuthSecondaryNavigation
          question="Old User?"
          option=" SignIn"
          action={() => router.replace("/(auth)/login")}
        />
        {isValid && isFormFilled && (
          <ReusableButton
            title="Send OTP"
            variant="solid"
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
        )}
        <TermsAndConditions />
      </View>
    </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  apiError: {
    color: "#C2371E",
    fontFamily: "SansMedium",
    textAlign: "left",
    fontSize: 14,
    marginTop: 12,
  },
});
