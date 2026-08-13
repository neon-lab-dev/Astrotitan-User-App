import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SansText } from "../../../reusable/Text/SansText";
import { SubscriptionPlan } from "../../../../screens/tabs/profile/subscription/SubscriptionScreen";
import Ionicons from "@react-native-vector-icons/ionicons";

interface Props {
  plan: SubscriptionPlan;

  loading?: boolean;

  onPress?: () => void;
}

const COLORS = {
  primary: "#D4AF37",
  background: "#FFFFFF",
  border: "#ECECEC",
  text: "#171717",
  subtitle: "#7A7A7A",
  green: "#30C85A",
};

const SubscriptionCard = ({
  plan,
  loading = false,
  onPress,
}: Props) => {
  const isBasic = plan.id === "basic";

  return (
    <View
      style={[
        styles.container,
        plan.highlight && styles.highlightContainer,
      ]}
    >
      {plan.highlight && (
        <View style={styles.recommendedBadge}>
          <SansText style={styles.badgeText}>
            Recommended
          </SansText>
        </View>
      )}

      {/* Header */}

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <SansText style={styles.title}>
            {plan.name}
          </SansText>

          <SansText style={styles.description}>
            {plan.description}
          </SansText>
        </View>

        <View
          style={[
            styles.iconBox,
            plan.highlight && styles.highlightIconBox,
          ]}
        >
          {plan.highlight ? (
            <Ionicons
              name="diamond-outline"
              size={24}
              color={COLORS.primary}
            />
          ) : (
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={COLORS.primary}
            />
          )}
        </View>
      </View>

      {/* Price */}

      <View style={styles.priceContainer}>
        <SansText style={styles.price}>
          ₹{plan.price}
        </SansText>

        <SansText style={styles.duration}>
          / {plan.duration}
        </SansText>
      </View>

      {/* Features */}

      <View style={styles.featureContainer}>
        {plan.features.map((item, index) => (
          <View
            key={index}
            style={styles.featureRow}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={
                plan.highlight
                  ? COLORS.primary
                  : COLORS.green
              }
            />

            <SansText style={styles.featureText}>
              {item}
            </SansText>
          </View>
        ))}

        {plan.highlight && (
          <View style={styles.featureRow}>
            <Ionicons
              name="flash"
              size={20}
              color={COLORS.primary}
            />

            <SansText
              style={[
                styles.featureText,
                styles.priorityText,
              ]}
            >
              24/7 Priority Support
            </SansText>
          </View>
        )}
      </View>

      {/* Button */}

      {isBasic ? (
        <View style={styles.freeButton}>
          <Ionicons
            name="checkmark-circle"
            color={COLORS.primary}
            size={18}
          />

          <SansText style={styles.freeButtonText}>
            Free Plan
          </SansText>
        </View>
      ) : (
        <Pressable
          disabled={loading}
          style={({ pressed }) => [
            styles.buyButton,
            pressed && {
              opacity: 0.9,
              transform: [{ scale: 0.98 }],
            },
          ]}
          onPress={onPress}
        >
          {loading ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <>
              <SansText style={styles.buyText}>
                {plan.status}
              </SansText>

              <Ionicons
                name="diamond-outline"
                color="#FFFFFF"
                size={18}
              />
            </>
          )}
        </Pressable>
      )}
    </View>
  );
};

export default SubscriptionCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ECECEC",
    padding: 24,
    marginBottom: 24,
  },

  highlightContainer: {
    borderWidth: 2,
    borderColor: "#D4AF37",
  },

  recommendedBadge: {
    position: "absolute",
    top: -13,
    alignSelf: "center",
    backgroundColor: "#D4AF37",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 30,
    zIndex: 100,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 21,
    fontFamily:"Satoshi-Bold",
    color: "#171717",
  },

  description: {
    marginTop: 4,
    color: "#777",
    fontSize: 12,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
  },

  highlightIconBox: {
    backgroundColor: "#FFF8E5",
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 26,
    marginBottom: 26,
  },

  price: {
    fontSize: 40,
    fontFamily:"Satoshi-Black",
    color: "#171717",
  },

  duration: {
    marginLeft: 8,
    marginBottom: 6,
    color: "#777",
    fontSize: 14,
  },

  featureContainer: {
    marginBottom: 28,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  featureText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 15,
    color: "#555",
  },

  priorityText: {
    color: "#D4AF37",
    fontWeight: "700",
  },

  freeButton: {
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },

  freeButtonText: {
    color: "#D4AF37",
    marginLeft: 8,
    fontSize: 15,
  },

  buyButton: {
    height: 56,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#D4AF37",
    gap: 8,
  },

  buyText: {
    color: "#FFFFFF",
    fontSize: 15,

  },
});