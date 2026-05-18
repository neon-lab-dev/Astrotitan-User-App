import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";

import React from "react";

import {
    StyleSheet,
    View,
} from "react-native";

const ProductCardSkeleton = ({
  variant = "product",
}: {
  variant?: "product" | "pooja";
}) => {
  return (
    <View style={styles.card}>
      {/* IMAGE */}

      <View style={styles.imageWrapper}>
        <SkeletonLoader
          width={248}
          height={248}
          borderRadius={16}
          array={[1]}
        />

        {/* OVERLAY CONTENT */}

        <View style={styles.overlayContent}>
          {/* TITLE */}

          <SkeletonLoader
            width="78%"
            height={20}
            borderRadius={8}
            array={[1]}
          />

          {/* DESCRIPTION */}

          <View style={{ gap: 8 }}>
            <SkeletonLoader
              width="100%"
              height={12}
              borderRadius={6}
              array={[1]}
            />

            <SkeletonLoader
              width="82%"
              height={12}
              borderRadius={6}
              array={[1]}
            />
          </View>

          {/* PRICE */}

          <SkeletonLoader
            width="40%"
            height={20}
            borderRadius={8}
            array={[1]}
          />
        </View>
      </View>

      {/* BUTTON SECTION */}

      {variant === "product" ? (
        <SkeletonLoader
          width={248}
          height={48}
          borderRadius={999}
          array={[1]}
        />
      ) : (
        <SkeletonLoader
          width={248}
          height={48}
          borderRadius={999}
          array={[1]}
        />
      )}
    </View>
  );
};

export default ProductCardSkeleton;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    gap: 10,
    borderWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
  },

  imageWrapper: {
    position: "relative",
  },

  overlayContent: {
    position: "absolute",

    left: 16,

    right: 16,

    bottom: 16,

    gap: 10,
  },
});