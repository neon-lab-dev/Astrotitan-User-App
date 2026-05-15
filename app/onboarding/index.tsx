// app/onboarding.tsx

import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function Onboarding() {
  const router = useRouter();
  const rotation = useSharedValue(0);
  const finish = async () => {
    await SecureStore.setItemAsync("ONBOARDING_DONE", "true");
    router.replace("/(auth)/register");
  };
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 12000, // speed (increase for slower)
        easing: Easing.linear,
      }),
      -1, // infinite loop
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));
  return (
    <LinearGradient
      colors={["#EDDEAD", "#F1E8C9", "#F5F5F5"]}
      locations={[0, 0.45, 1]}
      style={styles.container}
    >
      {/* TOP VISUAL */}
      <View style={styles.topSection}>
        <Animated.View style={animatedStyle}>
          <Image
            source={require("../../assets/images/planets.webp")}
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>
      </View>
      <View>
        {/* TEXT CONTENT */}
        <View style={styles.textSection}>
          <SatoshiText style={styles.title}>Astrology, Made Clear</SatoshiText>
          <SansText style={styles.subtitle}>
            Personalized insights designed for real-life decisions.
          </SansText>
        </View>

        {/* BUTTON */}
        <ReusableButton
          onPress={finish}
          title="Get Started"
          variant="solid"
          width="auto"
          paddingHorizontal={22}
        />
      </View>
    </LinearGradient>
  );
}

const styles=StyleSheet.create({
    container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingVertical:56
  },

  topSection: {
    alignItems: "center",
  },

  image: {
    width: 360,
    height: 360,
  },

  textSection: {
    alignItems: "center",
    gap: 12,
  },

  title: {
    fontSize: 24,
    fontFamily: "SatoshiBold",
    color: "#0D0D0D",
    lineHeight:28,
    letterSpacing:-0.07
  },

  subtitle: {
    fontSize: 16,
    color: "#0D0D0D",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom:56
  },

  button: {
    backgroundColor: "#C7A534",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "SatoshiMedium",
  },
  });
