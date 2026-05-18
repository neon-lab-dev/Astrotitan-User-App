import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";

import React from "react";

import {
    StyleSheet,
    View,
} from "react-native";

const AddressCardSkeleton = () => {
  return (
    <View style={styles.wrapper}>
      {/* CARD */}

      <View style={styles.card}>
        {/* HEADER */}

        <View style={styles.topRow}>
          <View style={styles.leftTop}>
            <SkeletonLoader
              width={18}
              height={18}
              borderRadius={999}
              array={[1]}
            />

            <SkeletonLoader
              width="58%"
              height={16}
              borderRadius={8}
              array={[1]}
            />
          </View>

          <SkeletonLoader
            width={68}
            height={28}
            borderRadius={999}
            array={[1]}
          />
        </View>

        {/* PHONE */}

        <View style={styles.phoneRow}>
          <SkeletonLoader
            width={18}
            height={18}
            borderRadius={999}
            array={[1]}
          />

          <SkeletonLoader
            width="42%"
            height={14}
            borderRadius={8}
            array={[1]}
          />
        </View>

        {/* ADDRESS */}

        <View style={styles.addressRow}>
          <SkeletonLoader
            width={18}
            height={18}
            borderRadius={999}
            array={[1]}
          />

          <View style={styles.addressLines}>
            <SkeletonLoader
              width="95%"
              height={14}
              borderRadius={8}
              array={[1]}
            />

            <SkeletonLoader
              width="78%"
              height={14}
              borderRadius={8}
              array={[1]}
            />

            <SkeletonLoader
              width="55%"
              height={14}
              borderRadius={8}
              array={[1]}
            />
          </View>
        </View>
      </View>

      {/* BUTTONS */}

      <View style={styles.buttonRow}>
        <View style={{ flex: 1 }}>
          <SkeletonLoader
            width="100%"
            height={52}
            borderRadius={999}
            array={[1]}
          />
        </View>

        <View style={{ flex: 1 }}>
          <SkeletonLoader
            width="100%"
            height={52}
            borderRadius={999}
            array={[1]}
          />
        </View>
      </View>
    </View>
  );
};

export default AddressCardSkeleton;

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },

  card: {
    backgroundColor: "#FBF7EB",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D4AF37",
    gap: 14,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  leftTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  addressRow: {
    flexDirection: "row",
    gap: 10,
  },

  addressLines: {
    flex: 1,
    gap: 10,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
});