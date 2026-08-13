import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import SkeletonLoader from "../../../../reusable/SkeletonLoader/SkeletonLoade";

const RemedyCardSkeleton = () => {
  return (
    <View style={styles.wrapper}>
      {/* IMAGE SECTION */}

      <View style={styles.imageContainer}>
        <SkeletonLoader
          width="100%"
          height={248}
          borderRadius={12}
          array={[1]}
        />

        {/* RATING */}

        <View style={styles.ratingWrapper}>
          <SkeletonLoader
            width={70}
            height={34}
            borderRadius={12}
            array={[1]}
          />
        </View>

        {/* CONTENT OVERLAY */}

        <View style={styles.overlayContent}>
          {/* TITLE */}

          <SkeletonLoader
            width="82%"
            height={20}
            borderRadius={8}
            array={[1]}
          />

          {/* DESCRIPTION */}

          <View style={styles.descContainer}>
            <SkeletonLoader
              width="100%"
              height={12}
              borderRadius={6}
              array={[1]}
            />

            <SkeletonLoader
              width="74%"
              height={12}
              borderRadius={6}
              array={[1]}
            />
          </View>

          {/* PRICE */}

          <SkeletonLoader
            width="42%"
            height={18}
            borderRadius={8}
            array={[1]}
          />
        </View>
      </View>

      {/* BUTTON */}

      <View style={styles.buttonContainer}>
        <SkeletonLoader
          width="100%"
          height={52}
          borderRadius={999}
          array={[1]}
        />
      </View>
    </View>
  );
};

export default RemedyCardSkeleton;

const styles = StyleSheet.create({
  wrapper: {
    width: "48%",
  },

  imageContainer: {
    position: "relative",
    borderWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
    borderRadius:16,
    overflow:"hidden"
  },

  ratingWrapper: {
    position: "absolute",
    top: 12,
    left: 12,
  },

  overlayContent: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    gap: 10,
  },

  descContainer: {
    gap: 8,
  },

  buttonContainer: {
    marginTop: 10,
  },
});