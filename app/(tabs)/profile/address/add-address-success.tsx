// Clean, reusable React Native Expo components based on your UI
// Assumes you already have SatoshiText and SansText components

import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from "react";
import { View } from "react-native";

const Address = () => {

    return (<AnimatedScreen>
            <ScreenWrapper>

                <AppHeader showBack={false}>
                    <AuthTitle title="Address Added Successfully" >

                    </AuthTitle>
                </AppHeader>
                <View style={{ paddingHorizontal: 16, flexGrow: 1, marginBottom: 16, gap: 12 }}>
                    <View
                        style={{
                            flexGrow: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 16,
                        }}
                    >
                        <View style={{ paddingHorizontal: 16, gap: 24, paddingVertical: 24, margin: "auto" }}>

                            <SansText>
                                <Image
                                    source={require("@/assets/images/tick.png")}
                                    style={{
                                        width: 224,
                                        height: 224,
                                    }}
                                    contentFit="contain"
                                />
                            </SansText>
                        </View>


                        {/* DELETE */}

                    </View>
                    <ReusableButton variant="outline" onPress={() => { router.replace("/(tabs)/profile/address/add-address") }} title='Back To Dashboard'></ReusableButton>
                    <ReusableButton onPress={() => { router.replace("/(tabs)/profile/address/address") }} title='View Saved Address'></ReusableButton>
                </View></ScreenWrapper></AnimatedScreen>
    );
};
export default Address;
