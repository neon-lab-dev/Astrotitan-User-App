import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import { setAuth } from "@/redux/features/auth/authSlice";

export default function Splash() {
  const dispatch = useDispatch();
  const router = useRouter();

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });

    scale.value = withTiming(1, { duration: 500 });

    async function initializeApp() {
      try {
        const onboardingDone =
          await SecureStore.getItemAsync("ONBOARDING_DONE");

        const token =
          await SecureStore.getItemAsync("ACCESS_TOKEN");

        const userString =
          await SecureStore.getItemAsync("USER");

        const profileCompleted =
          await SecureStore.getItemAsync("IS_PROFILE_COMPLETE");

        const user = userString
          ? JSON.parse(userString)
          : null;

        if (token) {
          dispatch(
            setAuth({
              token,
              user,
            })
          );

          setTimeout(() => {
            if (profileCompleted === "true") {
              router.replace("/(tabs)/home");
            } else {
              router.replace("/multi-step-form");
            }
          }, 1200);

          return;
        }

        setTimeout(() => {
          if (onboardingDone === "true") {
            router.replace("/(auth)/login");
          } else {
            router.replace("/onboarding");
          }
        }, 1200);

      } catch (error) {
        console.log("SPLASH INIT ERROR:", error);

        router.replace("/onboarding");
      }
    }

    initializeApp();
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.splashBg}>
      <View style={styles.splashContainer}>
        <Animated.View style={logoStyle}>
          <SatoshiText>
            AstroTitan
          </SatoshiText>
        </Animated.View>
      </View>
    </View>
  );
}

const styles =StyleSheet.create({
    splashBg: {
      flex: 1,
    },
    splashContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });