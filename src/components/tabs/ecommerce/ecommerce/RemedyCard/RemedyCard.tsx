import StarIcon from "@/assets/icons/visual/star.svg";
import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SansText } from "../../../../reusable/Text/SansText";

type Props = {
  title: string;
  description: string;
  price: string;
  image: string;
  rating?: number;
  onPress?: () => void;
};

const RemedyCard = ({
  title,
  description,
  price,
  image,
  rating = 4.5,
  onPress,
}: Props) => {
  const FALLBACK =
    "https://images.unsplash.com/photo-1519681393784-d120267933ba";

  return (
    <View style={styles.wrapper}>
      {/* IMAGE CARD */}
      <ImageBackground
        source={{ uri: image || FALLBACK }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        {/* Overlay */}
        <View style={styles.overlay} />

        {/* Rating Badge */}
        <View style={styles.ratingBox}>
           <StarIcon
            height={24} width={24}
            color="#D4A017"
          />
          <SansText style={styles.ratingText}>{rating}</SansText>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <SansText style={styles.title} numberOfLines={2}>
            {title}
          </SansText>

          <SansText style={styles.desc} numberOfLines={2}>
            {description}
          </SansText>

          <SansText style={styles.price}>
            ₹ {price}/-
          </SansText>
        </View>
      </ImageBackground>

      {/* CTA */}
      <Pressable style={styles.button} onPress={onPress}>
        <SansText style={styles.buttonText}>
          View Details
        </SansText>
      </Pressable>
    </View>
  );
};

export default RemedyCard;

const styles = StyleSheet.create({
  wrapper: {
    width: "48%",
  },

  image: {
    height: 248,
    justifyContent: "flex-end",
  },

  imageRadius: {
    borderRadius: 12,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 12,
  },

  ratingBox: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  ratingText: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
    color: "#fff",
  },

  desc: {
    fontSize: 13,
    color: "#E0E0E0",
    marginTop: 4,
  },

  price: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
    color: "#fff",
    marginTop: 8,
  },

  button: {
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: "Satoshi-Bold",
    color: "#0D0D0D",
  },
});