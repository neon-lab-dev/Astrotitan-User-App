import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenWrapper from "../../components/layout/ScreenWrapper";

export default function FormLayout() {
  return (
     <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <Slot /> {/* ✅ NO SCROLL HERE */}
      </SafeAreaView>
    </ScreenWrapper>
  );
}
