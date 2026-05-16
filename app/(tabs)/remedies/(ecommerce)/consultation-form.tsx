import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

import AppHeader from "@/components/reusable/AppHeader/AppHeader";

import FormInput from "@/components/reusable/InputField/FormInput";

import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";

import { SansText } from "@/components/reusable/Text/SansText";

import { useBookPujaMutation } from "@/redux/features/puja/pujaApi";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import React from "react";

import {
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import { isValidFutureDate } from "@/utils/validators/dateValidators";
import {
    useForm,
} from "react-hook-form";

type FormValues = {
    name: string;

    phoneNumber: string;

    preferredDate: string;

    purposeOfPuja: string;
};

const BookPuja =
    () => {
        const params =
            useLocalSearchParams();

        const pujaId =
            Array.isArray(
                params.id
            )
                ? params.id[0]
                : params.id;
        console.log(pujaId)
        const [
            bookPuja,
            {
                isLoading,
            },
        ] =
            useBookPujaMutation();

        const {
            control,

            handleSubmit,
        } =
            useForm<FormValues>({
                defaultValues:
                {
                    name: "",

                    phoneNumber:
                        "",

                    preferredDate:
                        "",

                    purposeOfPuja:
                        "",
                },
            });

        const onSubmit =
            async (
                data: FormValues
            ) => {
                try {
                    const [
                        day,
                        month,
                        year,
                    ] =
                        data.preferredDate.split(
                            "/"
                        );

                    const formattedDate =
                        new Date(
                            `${year}-${month}-${day}`
                        ).toISOString();

                    const payload = {
                        name:
                            data.name,

                        phoneNumber:
                            data.phoneNumber,

                        pujaId:
                            pujaId,

                        preferredDate:
                            formattedDate,

                        purposeOfPuja:
                            data.purposeOfPuja,
                    };

                    console.log(
                        "BOOKING PAYLOAD:",
                        payload
                    );

                    const response =
                        await bookPuja(
                            payload
                        ).unwrap();

                    console.log(
                        "BOOKING RESPONSE:",
                        response
                    );

                    router.push("/(tabs)/remedies/(ecommerce)/puja-consultation-success");
                } catch (error) {
                    console.log(
                        "BOOKING ERROR:",
                        error
                    );
                }
            };
        return (
            <AnimatedScreen>
                <ScreenWrapper>
                    <AppHeader
                        onPressBack={() => {
                            router.back();
                        }}
                    >
                        <AuthTitle title="Consultation form">
                            <SansText>
                                Fill out this form and our expert will reach out to you.
                            </SansText>
                        </AuthTitle>
                    </AppHeader>

                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <ScrollView
                            contentContainerStyle={
                                styles.content
                            }
                            showsVerticalScrollIndicator={
                                false
                            }
                        >
                            <FormInput
                                control={
                                    control
                                }
                                name="name"
                                label="Full Name"
                                placeholder="Enter your name"
                            />

                            <FormInput
                                control={control}
                                name="phoneNumber"
                                label="Mobile Number"
                                variant="phone"
                                callingCode="91"
                                placeholder="Enter mobile number"
                                rules={{
                                    required:
                                        "Mobile number cannot be empty!",

                                    minLength: {
                                        value: 10,
                                        message:
                                            "Enter valid number",
                                    },

                                    maxLength: {
                                        value: 10,
                                        message:
                                            "Enter valid number",
                                    },
                                }}
                            />



                            <FormInput
                                control={control}
                                name="preferredDate"
                                label="Preferred Date"
                                placeholder="DD/MM/YYYY"
                                maxLength={10}
                                rules={{
                                    required:
                                        "Preferred date is required",

                                    validate: (
                                        value: string
                                    ) =>
                                        isValidFutureDate(
                                            value
                                        ) ||
                                        "Enter valid future date",
                                }}
                            />

                            <FormInput
                                control={
                                    control
                                }
                                name="purposeOfPuja"
                                label="Purpose Of Puja"
                                placeholder="Explain your purpose"
                                multiline
                                numberOfLines={
                                    4
                                }
                            />
                        </ScrollView>

                        <View
                            style={
                                styles.bottomContainer
                            }
                        >
                            <ReusableButton
                                title="Book Puja"
                                width="100%"
                                loading={
                                    isLoading
                                }
                                disabled={
                                    isLoading
                                }
                                onPress={handleSubmit(
                                    onSubmit
                                )}
                            />
                        </View>
                    </View>
                </ScreenWrapper>
            </AnimatedScreen>
        );
    };

export default BookPuja;

const styles =
    StyleSheet.create({
        content: {
            paddingHorizontal: 16,

            paddingTop: 24,

            paddingBottom: 120,

            gap: 20,
        },

        bottomContainer: {
            position:
                "absolute",

            bottom: 0,

            left: 0,

            right: 0,

            paddingHorizontal: 16,

            paddingTop: 16,

            paddingBottom: 24,

            backgroundColor:
                "#F7F1DF",
        },
    });