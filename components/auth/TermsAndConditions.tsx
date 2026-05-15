import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { SansText } from "../reusable/Text/SansText";

const TermsAndConditions = () => {
  const theme = useTheme();
  return (
    <SansText style={[styles.continue, { color: "#0D0D0D" }]}>
      By continuing, you agree to our{" "}
      <Pressable onPress={()=>{router.push("/privacy-policy")}}><SansText style={styles.continueHighlight}>Terms & Conditions</SansText></Pressable>
    </SansText>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  continue: {
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
  },
  continueHighlight: {
    textDecorationLine: "underline",
  },
});
