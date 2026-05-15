// Clean, reusable React Native Expo components based on your UI
// Assumes you already have SatoshiText and SansText components

import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {

    return (
        <AnimatedScreen>
        <SafeAreaView style={{ flex: 1 }}>
            <ScreenWrapper>

                <AppHeader onPressBack={()=>{router.replace("/(tabs)/profile")}} >
                    <AuthTitle title="Privacy Policy">
                    </AuthTitle>
                </AppHeader>
                <ScrollView style={{ flex: 1, paddingBottom: 0 }}>
                    <View style={{ paddingHorizontal: 16, gap: 24, paddingVertical: 24 }}>


                    </View>


                    {/* DELETE */}

                </ScrollView></ScreenWrapper></SafeAreaView></AnimatedScreen>
    );
};
export default PrivacyPolicy;
