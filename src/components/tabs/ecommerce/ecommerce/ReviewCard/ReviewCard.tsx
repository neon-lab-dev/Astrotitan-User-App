import React from "react";
import {
  Image,
  StyleSheet,
  View,
} from "react-native";

import StarIcon from '@/assets/icons/visual/star.svg';
import { SansText } from "../../../../reusable/Text/SansText";
import { SatoshiText } from "../../../../reusable/Text/SatoshiText";

interface ReviewCardProps {
  review: string;
  rating: number;
  reviewerName: string;
  images?: string[];
}

const ReviewCard = ({
  review,
  rating,
  reviewerName,
  images = [],
}: ReviewCardProps) => {
  return (
    <View style={styles.container}>
      {/* IMAGES */}
      {images?.length > 0 && (
        <View style={styles.imageRow}>
          {images
            ?.slice(0, 2)
            ?.map((image, index) => (
              <Image
                key={index}
                src={image}
                style={styles.image}
              />
            ))}
        </View>
      )}

      {/* REVIEW */}
      <SansText style={styles.reviewText}>
        “{review}”
      </SansText>

      {/* FOOTER */}
      <View style={styles.footer}>
        <SatoshiText style={styles.name}>
          {reviewerName}
        </SatoshiText>

        <View style={styles.ratingBox}>
          <StarIcon
            height={24} width={24}
            color="#D4A017"
          />

          <SansText style={styles.ratingText}>
            {rating}
          </SansText>
        </View>
      </View>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    gap:12,
  },

  imageRow: {
    flexDirection: "row",
    gap: 12,
  },

  image: {
    width: 86,
    height: 86,
    borderRadius: 12,
  },

  reviewText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#2A2A2A",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 14,
    color: "#111",
    fontFamily: "Satoshi-Bold",
  },

  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  ratingText: {
    fontSize: 16,
    color: "#0D0D0D",
    fontFamily: "Satoshi-Bold",
  },
});