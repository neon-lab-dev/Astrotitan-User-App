// components/IntentCard.tsx
import { ICONS } from "@/components/reusable/Icons";
import { SansText } from "@/components/reusable/Text/SansText";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  description: string;
  icon: keyof typeof ICONS;
};

const IntentCard = ({ title, description, icon }: Props) => {
 const Icon = ICONS[icon] as React.ComponentType<any>;

  return (
    <TouchableOpacity onPress={()=>{router.push("/(tabs)/remedies/(ecommerce)/intent-remedies")}} style={styles.card}>
      <Icon width={24} height={24} />

      <View style={{ marginTop: 12 }}>
        <SansText style={styles.title}>{title}</SansText>
        <SansText style={styles.desc}>{description}</SansText>
      </View>
    </TouchableOpacity>
  );
};

export default IntentCard;

const styles = StyleSheet.create({
  card: {
    width: 228,
    backgroundColor: "#FBF7EB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D4AF37",
    marginRight: 12,
  },

  title: {
    fontSize: 18,
    fontFamily: "SatoshiBold",
    color: "#0D0D0D",
    lineHeight: 26,
  },

  desc: {
    fontSize: 14,
      color: "#0D0D0D",
    marginTop: 2,
  },
});