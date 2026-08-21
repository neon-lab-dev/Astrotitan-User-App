/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setAuth, updateUser } from "../../redux/features/auth/authSlice";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import { SatoshiText } from "../../components/reusable/Text/SatoshiText";
import { Storage } from "../../services/storage/storage";
import { useLazyGetMeQuery } from "../../redux/features/auth/authApi";

const SplashScreen = () => {
  const dispatch = useDispatch();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const navigation = useNavigation<any>();
  const [getMe] = useLazyGetMeQuery();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Start animations
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 500 });

    // Initialize app after a small delay
    const timer = setTimeout(() => {
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        initializeApp();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      hasInitialized.current = true;
    };
  }, []);

  const initializeApp = async () => {
    try {
      console.log("🔍 Initializing app...");

      // Get stored data
      const token = await Storage.getAccessToken();
      const user = await Storage.getUser();
      const onboardingDone = await Storage.getOnboardingDone();

      console.log("📦 Storage data:", {
        hasToken: !!token,
        hasUser: !!user,
        onboardingDone: onboardingDone,
      });

      // ✅ Case 1: User has valid token
      if (token) {
        console.log("🔑 Token found, authenticating...");

        dispatch(setAuth({ token, user }));

        try {
          const meRes = await getMe({}).unwrap();
          const finalUser = meRes.data;

          console.log("👤 User data fetched:", {
            id: finalUser?._id,
            isProfileCompleted: finalUser?.profile?.isProfileCompleted,
          });

          await Storage.setUser(finalUser);
          dispatch(updateUser(finalUser));

          const isProfileCompleted =
            finalUser?.profile?.isProfileCompleted ||
            finalUser?.isProfileComplete ||
            false;

          await Storage.setProfileCompleted(isProfileCompleted);

          // Navigate immediately
          if (isProfileCompleted) {
            console.log("✅ Profile completed, going to HomeTabs");
            navigation.reset({
              index: 0,
              routes: [{ name: "HomeTabs" }],
            });
          } else {
            console.log("⚠️ Profile not completed, going to MultiStepForm");
            navigation.replace("MultiStepForm");
          }

          return;
        } catch (authError: any) {
          console.error("❌ Auth error:", authError);
          // If auth fails, clear token and go to login
          await Storage.removeAccessToken();
          await Storage.removeUser();
          // Continue to onboarding/login flow
        }
      }

      // ✅ Case 2: No token or auth failed
      console.log("ℹ️ No valid token, checking onboarding status");

      // Navigate based on onboarding status
      if (onboardingDone) {
        console.log("✅ Onboarding done, going to Login");
        navigation.replace("LoginWithPhone");
      } else {
        console.log("🔄 Onboarding not done, going to Onboarding");
        navigation.replace("Onboarding");
      }

    } catch (error: any) {
      console.error("❌ Initialize app error:", error);
      // Fallback: go to login after delay
      setTimeout(() => {
        navigation.replace("LoginWithPhone");
      }, 1000);
    }
  };

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Animated.View style={logoStyle}>
          <SatoshiText
            style={{
              color: "#D4AF37",
              fontSize: 32,
              fontFamily: "Satoshi-Bold",
            }}
          >
            AstroTitan
          </SatoshiText>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
};

export default SplashScreen;