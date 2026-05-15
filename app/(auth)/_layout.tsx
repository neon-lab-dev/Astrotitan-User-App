import { Slot } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenWrapper from "../../components/layout/ScreenWrapper";

export default function FormLayout() {
  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }} // 🔥 IMPORTANT
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={20}
        >
          <Slot />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
