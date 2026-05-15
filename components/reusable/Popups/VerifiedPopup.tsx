// components/reusable/VerifiedPopup.tsx

import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import ModalService from "@/redux/features/ui/GlobalModal/globalModalService";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import ReusableButton from "../ReusableButton/ReusableButton";

type Props = {
  isProfileCompleted: boolean;
}; 



export default function VerifiedPopup({ isProfileCompleted }: Props) {
  const dispatch=useDispatch()
  const handleClose = () => {
    ModalService.close();

    if (isProfileCompleted) {
      router.replace("/(tabs)/home");
    } else {
      // router.replace("/(user-details-form)/multi-step-form");
    }
  };

  return (
    <LinearGradient
      colors={["#EDDEAD", "#F1E8C9", "#F5F5F5"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* ICON */}
      <Image
        source={require("@/assets/images/tick.png")}
        style={styles.image}
        contentFit="contain"
      />

      {/* TEXT */}
      <SatoshiText style={styles.title}>
        You’re verified! Let’s set up your profile.
      </SatoshiText>

      {/* BUTTON */}
      <ReusableButton
        title="Ok"
        width={148}
        variant="solid"
        onPress={handleClose}
        style={{ marginTop: 24 }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
    borderRadius: 12,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#6BAA2F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  check: {
    fontSize: 28,
    color: "#6BAA2F",
  },
  image: {
    width: 124,
    height: 124,
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "SatoshiBold",
    color: "#0D0D0D",
    lineHeight: 26,
  },
});