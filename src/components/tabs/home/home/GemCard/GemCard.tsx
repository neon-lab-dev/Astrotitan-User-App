import ArrowIcon from "@/assets/icons/actions/arrow.svg";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SatoshiText } from "../../../../reusable/Text/SatoshiText";
import { SansText } from "../../../../reusable/Text/SansText";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
type Props = {
  id: string;
  title: string;
  description: string;
  variant?: "product" | "pooja";
  image: any;
};

const GemCard = ({
  id,
  title,
  description,
  variant = "product",
  image,
}: Props) => {
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  return (

    <TouchableOpacity activeOpacity={0.9} onPress={() => {
      if (variant === "product") {
        navigation.getParent()?.navigate("RemediesTab", {
          screen: "ProductDetails",
          params: {
            id,
          },
        });
      }

      if (variant === "pooja") {
        navigation.getParent()?.navigate("RemediesTab", {
          screen: "PujaDetails",
          params: {
            id,
          },
        });
      }
    }}>
      <View style={styles.card}>
        {/* Floating Image */}
        <Image
          source={
            typeof image === "string"
              ? { uri: image }
              : image
          }
          style={styles.image}
        />

        {/* Content */}
        <View style={styles.content}>
          <SatoshiText style={styles.heading}>{title.slice(0, 24) + "..."}</SatoshiText>

          <SatoshiText style={styles.heading}>What it is?</SatoshiText>
          <SansText style={styles.benefits}>{description.slice(0, 60) + "..."}</SansText>

          {/* CTA */}
          <View style={styles.ctaRow}>
            <SansText onPress={() => {
              if (variant === "product") {
                navigation.navigate(
                  "ProductDetails",
                  {
                    id: id,
                  },
                );
              }

              if (variant === "pooja") {
                navigation.navigate("PujaDetails", { id: id })
              }
            }} style={styles.cta}>
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
    backgroundColor: "#F0E8CD",
    position: "absolute",
    top: -32, // 🔥 half outside
    left: 16,
  },

  content: {
    gap: 8,
  },
  heading: {
    fontSize: 16,
    fontFamily: "Satoshi-Bold",
    color: "#0D0D0D",
    lineHeight: 26
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