import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SansText } from "../../../reusable/Text/SansText";
import { SUBSCRIPTION_PLANS } from "../../../../data/plans";
import Ionicons from "@react-native-vector-icons/ionicons";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


interface Props {
  subscription: any;
  onCancel: () => void;
}

const ActiveSubscription = ({
  subscription,
  onCancel,
}: Props) => {
  return (
    <View style={styles.card}>
      {/* Status */}

      <View style={styles.statusContainer}>
        <Ionicons
          name="checkmark-circle"
          color="#22C55E"
          size={16}
        />

        <SansText style={styles.statusText}>
          Active
        </SansText>
      </View>

      {/* Header */}

      <View style={styles.header}>
        <View style={styles.icon}>
          <FontAwesome6
            name="crown"
            solid
            color="#D4AF37"
            size={22}
          />
        </View>

        <View style={{ flex: 1 }}>
          <SansText style={styles.title}>
            Premium Plus
          </SansText>

          <SansText style={styles.remaining}>
            {subscription.remainingDays ?? 0} days remaining
          </SansText>
        </View>
      </View>

      {/* Details */}

      <View style={styles.details}>
        <Detail
          label="Start Date"
          value={new Date(
            subscription.startDate,
          ).toLocaleDateString()}
        />

        <Detail
          label="End Date"
          value={new Date(
            subscription.endDate,
          ).toLocaleDateString()}
        />

        <Detail
          label="Status"
          value={subscription.status}
        />

        <Detail
          label="Subscription ID"
          value={
            subscription.razorpaySubscriptionId ??
            "N/A"
          }
        />
      </View>

      {/* Features */}

      <View style={{ marginTop: 25 }}>
        {SUBSCRIPTION_PLANS[1].features.map(
          (item, index) => (
            <View
              key={index}
              style={styles.featureRow}
            >
              <Ionicons
                name="checkmark-circle"
                color="#D4AF37"
                size={20}
              />

              <SansText
                style={styles.featureText}
              >
                {item}
              </SansText>
            </View>
          ),
        )}
      </View>

      {/* Cancel */}

      <Pressable
        style={styles.cancelButton}
        onPress={onCancel}
      >
        <Ionicons
          name="close-circle-outline"
          size={18}
          color="#DC2626"
        />

        <SansText style={styles.cancelText}>
          Cancel Subscription
        </SansText>
      </Pressable>

      <SansText style={styles.footer}>
        Your subscription will remain active until
        the end of the billing period.
      </SansText>
    </View>
  );
};

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={{ width: "48%", marginBottom: 16 }}>
    <SansText
      style={{
        color: "#888",
        fontSize: 12,
      }}
    >
      {label}
    </SansText>

    <SansText
      style={{
        marginTop: 4,
        fontWeight: "700",
      }}
    >
      {value}
    </SansText>
  </View>
);

export default ActiveSubscription;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 22,
    borderWidth: 2,
    borderColor: "#D4AF37",
  },

  statusContainer: {
    position: "absolute",
    right: 20,
    top: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    color: "#15803D",
    marginLeft: 5,
    fontFamily: "Satoshi-Bold",
  },

  header: {
    flexDirection: "row",
    marginBottom: 25,
    alignItems: "center",
  },

  icon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E5",
    marginRight: 15,
  },

  title: {
    fontSize: 22,
    fontFamily: "Satoshi-Bold",
  },

  remaining: {
    marginTop: 4,
    color: "#777",
  },

  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
    borderRadius: 18,
    padding: 18,
  },

  featureRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },

  featureText: {
    marginLeft: 12,
    flex: 1,
  },

  cancelButton: {
    height: 55,
    borderRadius: 999,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  cancelText: {
    color: "#DC2626",
    fontFamily: "Satoshi-Bold",
    marginLeft: 8,
  },

  footer: {
    marginTop: 15,
    textAlign: "center",
    color: "#777",
    fontSize: 12,
  },
});