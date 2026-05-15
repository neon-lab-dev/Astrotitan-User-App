import ArrowRoundedIcon from "@/assets/icons/actions/arrow-down-round.svg";
import NoteIcon from "@/assets/icons/navigation/note.svg";

import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import ContentSection from "@/components/reusable/ContentSectoin/ContentSection";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";

import { Image } from "expo-image";

import { router } from "expo-router";

import React from "react";

import {
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

const Address = () => {
    const dummySessions = [
        {
            title: "Today",

            data: [
                {
                    id: "1",

                    name: "Rahul Sharma",

                    time: "09:30 AM",

                    type: "Career & clarity guidance",

                    image: require("@/assets/images/dummy/experts/expert1.png"),
                },

                {
                    id: "2",

                    name: "Kajal Agrawal",

                    time: "08:30 AM",

                    type: "Career & clarity guidance",

                    image: require("@/assets/images/dummy/experts/expert2.png"),
                },
            ],
        },

        {
            title: "Yesterday",

            data: [
                {
                    id: "3",

                    name: "Rahul Sharma",

                    time: "09:30 AM",

                    type: "Career & clarity guidance",

                    image: require("@/assets/images/dummy/experts/expert1.png"),
                },

                {
                    id: "4",

                    name: "Kajal Agrawal",

                    time: "08:30 AM",

                    type: "Career & clarity guidance",

                    image: require("@/assets/images/dummy/experts/expert2.png"),
                },
            ],
        },
    ];

    const sessions = dummySessions;

    const hasSessions =
        sessions.length > 0;

    return (
        <AnimatedScreen>
            <ScreenWrapper>
                <AppHeader
                    onPressBack={() => {
                        router.replace(
                            "/(tabs)/profile"
                        );
                    }}
                >
                    <AuthTitle title="Session History">
                        <SansText>
                            Review your past
                            consultations.
                        </SansText>
                    </AuthTitle>
                </AppHeader>

                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 16,
                    }}
                >
                    {!hasSessions ? (
                        /* EMPTY STATE */

                        <View
                            style={{
                                flex: 1,

                                justifyContent:
                                    "center",

                                alignItems: "center",
                            }}
                        >
                            <NoteIcon
                                height={124}
                                width={124}
                            />

                            <SansText
                                style={{
                                    marginTop: 16,

                                    textAlign: "center",
                                }}
                            >
                                No sessions yet
                            </SansText>
                        </View>
                    ) : (
                        /* LIST */

                        <ScrollView
                            showsVerticalScrollIndicator={
                                false
                            }
                        >
                            <View
                                style={{
                                    paddingVertical: 16,
                                }}
                            >
                                {sessions.map(
                                    (
                                        section,
                                        sectionIndex
                                    ) => (
                                        <View
                                            key={
                                                sectionIndex
                                            }
                                        >
                                            {/* SECTION TITLE */}

                                            <ContentSection
                                                title={
                                                    section.title
                                                }
                                            />

                                            {/* ITEMS */}

                                            {section.data.map(
                                                (item) => (
                                                    <SessionItem
                                                        key={
                                                            item.id
                                                        }
                                                        name={
                                                            item.name
                                                        }
                                                        time={
                                                            item.time
                                                        }
                                                        image={
                                                            item.image
                                                        }
                                                        description={
                                                            item.type
                                                        }
                                                        onPress={() => {
                                                            router.push(
                                                                "/(tabs)/profile/session-details"
                                                            );
                                                        }}
                                                    />
                                                )
                                            )}
                                        </View>
                                    )
                                )}
                            </View>
                        </ScrollView>
                    )}

                    {/* BUTTON */}

                    <ReusableButton
                        onPress={() =>
                            router.push(
                                "/(tabs)/astrologers"
                            )
                        }
                        title="Book Session"
                    />
                </View>
            </ScreenWrapper>
        </AnimatedScreen>
    );
};

export default Address;

/* ---------------- SESSION ITEM ---------------- */

const SessionItem = ({
    name,
    time,
    image,
    description = "Career & clarity guidance",
    onPress,
}: any) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{
                flexDirection: "row",

                alignItems: "center",

                justifyContent:
                    "space-between",

                paddingVertical: 20,
            }}
        >
            {/* LEFT */}

            <View
                style={{
                    flexDirection: "row",

                    alignItems: "center",

                    gap: 12,

                    flex: 1,
                }}
            >
                {/* IMAGE */}

                <Image
                    source={image}
                    contentFit="cover"
                    style={{
                        width: 52,

                        height: 52,

                        borderRadius: 100,

                        backgroundColor:
                            "#D8D8D8",
                    }}
                />

                {/* CONTENT */}

                <View
                    style={{
                        flex: 1,
                    }}
                >
                    {/* TOP */}

                    <View
                        style={{
                            flexDirection: "row",

                            alignItems: "center",

                            justifyContent:
                                "space-between",

                            gap: 12,
                        }}
                    >
                        <SatoshiText
                            numberOfLines={1}
                            style={{
                                flex: 1,

                                fontSize: 18,

                                color: "#0D0D0D",

                                fontFamily:
                                    "SatoshiBold",
                            }}
                        >
                            {name}
                        </SatoshiText>

                        <SansText
                            style={{
                                fontSize: 12,

                                color: "#757575",
                            }}
                        >
                            {time}
                        </SansText>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",

                            alignItems: "center",

                            justifyContent:
                                "space-between",

                            gap: 12,
                        }}
                    >
                        <SansText
                            numberOfLines={1}
                            style={{
                                marginTop: 4,

                                fontSize: 15,

                                color: "#4B4B4B",

                                lineHeight: 22,
                            }}
                        >
                            {description}
                        </SansText>

                        <View
                            style={{
                                justifyContent: "center",

                                alignItems: "center",

                                transform: [
                                    {
                                        rotate: "-90deg",
                                    },
                                ],
                            }}
                        >
                            <ArrowRoundedIcon
                                width={20}
                                height={20}
                            />
                        </View>
                    </View>

                    {/* DESCRIPTION */}


                </View>
            </View>

            {/* RIGHT */}


        </TouchableOpacity>
    );
};