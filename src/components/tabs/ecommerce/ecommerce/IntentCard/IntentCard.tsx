import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ICONS } from "../../../../../assets/svg";
import { SansText } from "../../../../reusable/Text/SansText";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

type Props = {
  title: string;
  icon: keyof typeof ICONS;
  onPress?: () => void;
};

const IntentCard = ({ title, icon, onPress }: Props) => {
  const Icon = ICONS[icon] as React.ComponentType<any>;
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate("IntentProduct", { slug: title });
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.iconWrapper}>
        <Icon width={28} height={28} />
      </View>
      <View style={styles.titleContainer}>
        <SansText style={styles.title} numberOfLines={2}>
          {title}
        </SansText>
      </View>
    </TouchableOpacity>
  );
};

export default IntentCard;

const styles = StyleSheet.create({
  card: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    height: 120,
    // ✅ Box card with previous bg and border
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.08)',
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(248, 202, 52, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  titleContainer: {
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 12,
    fontFamily: "Satoshi-Medium",
    color: "#0D0D0D",
    textAlign: "center",
    lineHeight: 16,
  },
});