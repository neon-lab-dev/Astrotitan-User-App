import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SansText } from "../../../reusable/Text/SansText";
import { SatoshiText } from "../../../reusable/Text/SatoshiText";

interface Props {
  subscription: any;
  onResubscribe: () => void;
  onCheckPlans: () => void;
}

const CancelledSubscription = ({
  subscription,
  onResubscribe,
  onCheckPlans
}: Props) => {
  return (
     <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="warning-outline"
            size={42}
            color="#D4AF37"
          />
        </View>

        <SansText style={styles.title}>
          Subscription Cancelled
        </SansText>

        <SansText style={styles.description}>
          Your Premium Plus subscription has been cancelled.
          You can resubscribe anytime to regain premium access.
        </SansText>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <SansText style={styles.label}>
              Cancelled On
            </SansText>

            <SansText style={styles.value}>
              {subscription?.cancelDate
                ? new Date(
                  subscription.cancelDate,
                ).toLocaleDateString()
                : "N/A"}
            </SansText>
          </View>

          <View style={styles.infoItem}>
            <SansText style={styles.label}>
              Cancel Reason
            </SansText>

            <SansText style={styles.value}>
              {subscription?.cancelReason ||
                "No reason provided"}
            </SansText>
          </View>
        </View>

        <Pressable
          style={styles.button}
          onPress={onResubscribe}
        >
          <SansText style={styles.buttonText}>
            Resubscribe Now
          </SansText>
        </Pressable>
      </View>
      <SatoshiText
        onPress={onCheckPlans}
        style={{
          marginTop: 20,
          textAlign: "center",
          textDecorationLine: "underline",
        }}
      >
        Check other Plans
      </SatoshiText></View>
  );
};

export default CancelledSubscription;

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  iconContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E5",
    marginBottom: 22,
  },

  title: {
    fontSize: 24,
    fontFamily:"Satoshi-Bold",
    textAlign: "center",
  },

  description: {
    textAlign: "center",
    color: "#777",
    marginTop: 10,
    lineHeight: 22,
  },

  infoCard: {
    marginTop: 28,
    backgroundColor: "#F8F8F8",
    borderRadius: 18,
    padding: 18,
  },

  infoItem: {
    marginBottom: 18,
  },

  label: {
    color: "#888",
    fontSize: 12,
  },

  value: {
    marginTop: 5,
fontFamily:"Satoshi-Bold",
    fontSize: 15,
  },

  button: {
    marginTop: 28,
    backgroundColor: "#D4AF37",
    height: 54,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
});