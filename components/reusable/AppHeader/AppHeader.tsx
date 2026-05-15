import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { BackHandler, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  showBack?: boolean;
  onPressBack?: () => void;

  backText?: React.ReactNode;
  backgroundColor?: string;
  showBorder?: boolean;
  borderColor?: string;

  children?: React.ReactNode;
};

const AppHeader = ({
  showBack = true,
  onPressBack,
  backText,
  backgroundColor = "#EDDEAD",
  showBorder = true,
  borderColor = "#E6D18B",
  children,
}: Props) => {
  const router = useRouter();

   const handleBack = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      router.back();
    }
    return true; // prevent default system behavior
  };

  // 🔥 SYSTEM BACK CONTROL
  useEffect(() => {
    if (!showBack) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack
    );

    return () => subscription.remove();
  }, [onPressBack]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderBottomWidth: showBorder ? 1 : 0,
          borderBottomColor: borderColor,
        },
      ]}
    >
      {/* 🔥 TOP ROW */}
      {showBack && (
        <View style={styles.backRow}>
          <TouchableOpacity
            onPress={() => {
              if (onPressBack) {
                onPressBack();
              } else {
                router.back();
              }
            }}
            style={{ padding: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="#0D0D0D" />
          </TouchableOpacity>

          {/* TEXT */}
          <View style={{ flex: 1 }}>{backText}</View>
        </View>
      )}

      {/* 🔥 CONTENT BELOW */}
      <View style={styles.childrenContainer}>
        {children}
      </View>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 12, 
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  childrenContainer: {
    justifyContent: "space-between", // optional
  },
});