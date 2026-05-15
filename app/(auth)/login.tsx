import AuthSecondaryNavigation from "@/components/auth/AuthSecondaryNavigation";
import AuthTitle from "@/components/auth/AuthTitle";
import CountrySelector from "@/components/auth/CountrySelector";
import OrDivider from "@/components/auth/OrDivider";
import TermsAndConditions from "@/components/auth/TermsAndConditions";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import FormInput from "@/components/reusable/InputField/FormInput";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { formatPhone } from "@/utils/formatePhoneNumber";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

type LoginForm = {
  phone: string;
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
      phone: "",
    },
    mode: "onBlur", // 🔥 IMPORTANT
  });
  const [country, setCountry] = useState({
    name: "India",
    code: "IN",
    callingCode: "91",
    flag: "🇮🇳",
  });

  // ✅ GET PARAMS
  const params = useLocalSearchParams();
  const phone = watch("phone");
  const isFormFilled = phone.length >= 10;

  useEffect(() => {
    if (params.countryName) {
      setCountry({
        name: params.countryName as string,
        code: params.countryCode as string,
        callingCode: params.callingCode as string,
        flag: params.flag as string,
      });
    }
  }, [params]);

  const [login, { isLoading, error }] = useLoginMutation();

const onSubmit = async (data: LoginForm) => {
  try {
    const fullPhone = formatPhone(country.callingCode, data.phone);

    const payload = {
      email: "",
      phoneNumber: fullPhone, // ⚠️ backend expects lowercase n
      role: "user",
    };

    await login(payload).unwrap(); 

    router.push({
      pathname: "/(auth)/otp-screen",
      params: {
        source: "login",
        phone: fullPhone,
      },
    });
  } catch (err: any) {
    console.log("LOGIN ERROR:", err);
  }
};
  return (<AnimatedScreen>
    <View style={styles.container}>
      <View>
        <AuthTitle title="Welcome Back"></AuthTitle>

        <View style={{ gap: 26 }}>
          <CountrySelector
            label="Country"
            value={country.name}
            flag={country.flag}
            onPress={() =>
              router.push({
                pathname: "/(auth)/select-country",
                params: { source: "login" },
              })
            }
          />

          {/* PASSWORD */}
          <FormInput
            key={country.callingCode}
            control={control}
            name="phone"
            label="Mobile Number"
            variant="phone"
            callingCode={country.callingCode} // 🔥 IMPORTANT
            placeholder="Enter mobile number"
            rules={{
              required: "Mobile number cannot be empty!",
              minLength: {
                value: 10,
                message: "Enter valid number",
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
          title="Login with email"
          variant="outline"
          onPress={() => router.replace("/(auth)/email-login")}
        />
      </View>
      <View style={{ gap: 24 }}>
        <AuthSecondaryNavigation
          question="New User?"
          option=" Signup"
          action={() => router.replace("/(auth)/register")}
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
