/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScreenWrapper({ children }: any) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#EDDEAD", "#F1E8C9", "#F5F5F5"]}
      locations={[0, 0.45, 1]}
      style={styles.container}
    >
      <View style={{ paddingTop: insets.top, flex: 1 }}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});