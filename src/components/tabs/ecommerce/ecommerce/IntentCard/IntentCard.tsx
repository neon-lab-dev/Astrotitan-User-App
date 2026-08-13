import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ICONS } from "../../../../../assets/svg";
import { SansText } from "../../../../reusable/Text/SansText";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

type Props = {
  title: string;
  description: string;
  icon: keyof typeof ICONS;
  variant?: "product" | "pooja"
};

const IntentCard = ({ title, description, icon, variant = "product" }: Props) => {
  const Icon = ICONS[icon] as React.ComponentType<any>;
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity onPress={() => {
      if (variant == "product") {

        navigation.navigate("IntentProduct", { slug: title })
      }
      if (variant == "pooja") { navigation.navigate("IntentPuja", { slug: title}) }

    }} style={styles.card}>
      <Icon width={24} height={24} />

      <View style={{ marginTop: 12 }}>
        <SansText style={styles.title}>{title}</SansText>
        <SansText style={styles.desc}>{description}</SansText>
      </View>
    </TouchableOpacity>
  );
};

export default IntentCard;

const styles = StyleSheet.create({
  card: {
    width: 228,
    backgroundColor: "#FBF7EB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D4AF37",
    marginRight: 12,
  },

  title: {
    fontSize: 16,
    fontFamily: "Satoshi-Bold",
    color: "#0D0D0D",
    lineHeight: 26,
  },

  desc: {
    fontSize: 14,
    color: "#0D0D0D",
    marginTop: 2,
  },
});