import React from "react";
import { StyleSheet, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SansText } from "../../../reusable/Text/SansText";
import ReusableButton from "../../../reusable/ReusableButton/ReusableButton";
import { SatoshiText } from "../../../reusable/Text/SatoshiText";

interface Props {
  onRenew: () => void;
   onCheckPlans: () => void;
}

const ExpiredSubscription = ({ onRenew, onCheckPlans }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="close-circle-outline"
            size={44}
            color="#EF4444"
          />
        </View>

        <SansText style={styles.title}>
          Your subscription has expired
        </SansText>

        <SansText style={styles.description}>
          You no longer have access to premium features.
          Renew your subscription to continue enjoying
          unlimited calls, chats, and priority access.
        </SansText>

        <ReusableButton
          variant="solid"
          onPress={onRenew}
          title="Renew Subscription"
        />
      </View>

      <SatoshiText onPress={onCheckPlans} style={{textDecorationLine:"underline", textAlign:"center"}}>Check other Plans</SatoshiText>
    </View>
  );
};

export default ExpiredSubscription;

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
    backgroundColor: "#FEF2F2",
    marginBottom: 22,
  },

  title: {
    fontSize: 21,
    fontFamily:"Satoshi-Bold",
    textAlign: "center",
  },

  description: {
    marginTop: 12,
    textAlign: "center",
    color: "#777",
    lineHeight: 22,
    marginBottom: 30,
  },

  button: {
    height: 54,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D4AF37",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});