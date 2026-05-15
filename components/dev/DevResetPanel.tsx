
import * as SecureStore from "expo-secure-store";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { setOnboardingDone } from "../../redux/features/app/appSlice";
import { clearAuth } from "../../redux/features/auth/authSlice";

export function DevResetPanel() {
  const dispatch = useDispatch();

  if (!__DEV__) return null; // 🔥 only in development

  const resetOnboarding = async () => {
    await SecureStore.deleteItemAsync("ONBOARDING_DONE");
    dispatch(setOnboardingDone(false));
    alert("Onboarding reset. Restart app.");
  };

  const resetAuth = async () => {
    await SecureStore.deleteItemAsync("ACCESS_TOKEN");
    await SecureStore.deleteItemAsync("USER");
    await SecureStore.deleteItemAsync("IS_PROFILE_COMPLETE");
    dispatch(clearAuth());
    alert("Auth reset (logged out).");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={resetOnboarding} style={styles.btn}>
        <Text style={styles.text}>Reset Onboarding</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetAuth} style={styles.btn}>
        <Text style={styles.text}>Reset Auth</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    right: 16,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 10,
    gap: 8,
    opacity: 0.85,
    zIndex: 999,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#3333333F6",
    borderRadius: 6,
  },
  text: {
    color: "white",
    fontSize: 12,
  },
});
