import ArrowIcon from "@/assets/icons/actions/arrow.svg";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  description: string;
  benefits: string[];
  image: any;
  onPress?: () => void;
};

const GemCard = ({
  title,
  description,
  benefits,
  image,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={styles.card}>
        {/* Floating Image */}
        <Image source={image} style={styles.image} />

        {/* Content */}
        <View style={styles.content}>
          <SatoshiText style={styles.heading}>{title}</SatoshiText>

          <SatoshiText style={styles.heading}>What it is?</SatoshiText>
          <SansText style={styles.benefits}>{description}</SansText>

          <SatoshiText style={styles.heading}>
            Believed to help with
          </SatoshiText>

          <SansText style={styles.benefits}>
            {benefits.map((b) => `• ${b}`).join("  ")}
          </SansText>

          {/* CTA */}
          <View style={styles.ctaRow}>
            <SansText style={styles.cta}>
              Learn when it’s suggested
            </SansText>
            <ArrowIcon width={24} height={24} color={"#0D0D0D"} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GemCard;

const styles = StyleSheet.create({
  card: {
    width: 296,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",

    padding: 24,
    paddingTop: 40, // 🔥 space for floating image
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 100,

    position: "absolute",
    top: -32, // 🔥 half outside
    left: 16,
  },

  content: {
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontFamily:"SatoshiBold",
    color: "#0D0D0D",
    lineHeight:26
  },

  benefits: {
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 20,
    letterSpacing: 0.28,
  },

  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // 🔥 this gives spacing
  },

  cta: {
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#0D0D0D",
  },
});