import React from "react";
import { Image, View } from "react-native";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

const AddAddressSuccess = () => {
    type NavigationProp =
        NativeStackNavigationProp<RootStackParamList>;
    
      const navigation = useNavigation<NavigationProp>();

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
                            />
                        </SansText>
                    </View>


                    {/* DELETE */}

                </View>
                <ReusableButton variant="outline"
                    onPress={() => { navigation.navigate("HomeScreen") }}
                    title='Back To Dashboard'>

                </ReusableButton>
                <ReusableButton
                    onPress={() => { navigation.navigate("AddressScreen")}}
                    title='View Saved Address'>

                </ReusableButton>
            </View></ScreenWrapper></AnimatedScreen>
    );
};
export default AddAddressSuccess;
