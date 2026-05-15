import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { DevResetPanel } from "@/components/dev/DevResetPanel";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlobalBottomSheet from "@/components/reusable/GlobalBottomSheet/GlobalBottomSheet";
import GlobalModal from "@/components/reusable/GlobalModal/GlobalModal";
import { store } from "@/redux/store";
import { loadAuth } from "@/utils/loadAuth";

export default function RootLayout() {
  const [appReady, setAppReady] =
    useState(false);
  const [fontsLoaded] = useFonts({
    SatoshiLight: require("../assets/fonts/satoshi/Satoshi-Light.otf"),
    Satoshi: require("../assets/fonts/satoshi/Satoshi-Regular.otf"),
    SatoshiMedium: require("../assets/fonts/satoshi/Satoshi-Medium.otf"),
    SatoshiBold: require("../assets/fonts/satoshi/Satoshi-Bold.otf"),
    SatoshiExtraBold: require("../assets/fonts/satoshi/Satoshi-Black.otf"),

    SansExtraLight: require("../assets/fonts/google_sans/GeneralSans-Extralight.otf"),
    SansLight: require("../assets/fonts/google_sans/GeneralSans-Light.otf"),
    Sans: require("../assets/fonts/google_sans/GeneralSans-Regular.otf"),
    SansMedium: require("../assets/fonts/google_sans/GeneralSans-Medium.otf"),
    SansSemiBold: require("../assets/fonts/google_sans/GeneralSans-Semibold.otf"),
    SansBold: require("../assets/fonts/google_sans/GeneralSans-Bold.otf"),
  });

  /* ---------------- APP INIT ---------------- */

  useEffect(() => {
    async function prepareApp() {
      try {
        /* LOAD AUTH */

        await loadAuth();

        console.log(
          "AUTH RESTORED"
        );
      } catch (error) {
        console.log(
          "APP INIT ERROR:",
          error
        );
      } finally {
        setAppReady(true);
      }
    }

    prepareApp();
  }, []);

  /* ---------------- HIDE SPLASH ---------------- */

  useEffect(() => {
    async function hideSplash() {
      if (
        fontsLoaded &&
        appReady
      ) {
        await SplashScreen.hideAsync();
      }
    }

    hideSplash();
  }, [fontsLoaded, appReady]);

  /* ---------------- BLOCK RENDER ---------------- */

  if (
    !fontsLoaded ||
    !appReady
  ) {
    return null;
  }


  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="dark" />

          <ScreenWrapper>
            <Slot />
          </ScreenWrapper>

          <GlobalBottomSheet />
          <GlobalModal />
          <DevResetPanel/>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}