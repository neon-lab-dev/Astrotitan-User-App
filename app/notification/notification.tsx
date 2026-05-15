import AuthTitle from "@/components/auth/AuthTitle";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const Notifications = () => {

    const notifications = [
        {
          title: "Today",
          data: [
            {
              id: "1",
              title: "Session Completed",
              subtitle: "View session summary",
              time: "10 min ago",
              unread: true,
            },
            {
              id: "2",
              title: "How was your recent session?",
              subtitle: "Share your feedback",
              time: "30 min ago",
              unread: true,
            },
            {
              id: "3",
              title: "You’ve received a response in your chat.",
              subtitle: "Open Chat",
              time: "1 hr ago",
              unread: false,
            },
          ],
        },
        {
          title: "Yesterday",
          data: [
            {
              id: "4",
              title: "Session Completed",
              subtitle: "View session summary",
              time: "10 min ago",
              unread: false,
            },
            {
              id: "5",
              title: "How was your recent session?",
              subtitle: "Share your feedback",
              time: "30 min ago",
              unread: false,
            },
          ],
        },
    ];

    const hasNotifications = notifications.length > 0;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScreenWrapper>

                <AppHeader onPressBack={()=>{router.back()}}>
                    <AuthTitle title={hasNotifications ? "Notifications" : "No notifications yet"}>
                        {!hasNotifications && (
                            <SansText>
                                You’ll see updates here about your sessions, chats, and insights.
                            </SansText>
                        )}
                    </AuthTitle>
                </AppHeader>

                <View style={{ flex: 1, }}>

                    {!hasNotifications ? (
                        // EMPTY STATE
                        <View style={{ flex: 1 }}>

                            {/* CENTER CONTENT */}
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={require('@/assets/images/bell-icon.png')}
                                    style={{ width: 224, height: 224 }}
                                />
                            </View>

                            {/* BOTTOM BUTTON */}
                            <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                                <ReusableButton
                                    title="Go To Home"
                                    onPress={() => router.push("/(tabs)/home")}
                                    width="100%"
                                />
                            </View>

                        </View>
                    ) : (
                        // LIST STATE
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{  }}>

                                {notifications?.map((section) => (
                                    <View key={section.title}>

                                        {/* SECTION TITLE */}
                                        <SatoshiText style={{ fontSize: 18, color: "#0D0D0D", fontFamily: "SatoshiBold" ,paddingHorizontal:16, paddingVertical:12}}>
                                            {section.title}
                                        </SatoshiText>

                                        {/* ITEMS */}
                                        <View style={{ marginTop: 16,}}>
                                            {section.data.map((item) => (
                                                <NotificationItem key={item.id} item={item} />
                                            ))}
                                        </View>

                                    </View>
                                ))}

                            </View>
                        </ScrollView>
                    )}

                </View>

            </ScreenWrapper>
        </SafeAreaView>
    );
};

export default Notifications;

const NotificationItem = ({ item }: any) => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 24,
            }}
        >

            {/* LEFT */}
            <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>

                {/* ICON CIRCLE */}
                <View
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: "#F5F5F5",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* Replace with real icons later */}
                </View>

                {/* TEXT */}
                <View style={{ flex: 1, gap:4 }}>
                    <SatoshiText style={{ fontSize: 18, fontFamily: "SatoshiMedium", color: "#0D0D0D" ,lineHeight: 26}}>
                        {item.title}
                    </SatoshiText>

                    <SansText style={{ fontSize: 14, color: "#000" ,lineHeight: 20}}>
                        {item.subtitle}
                    </SansText>
                </View>  
            </View>

            {/* RIGHT */}
            <View style={{ alignItems: "flex-end", gap: 6 }}>
                {item.unread && (
                    <View
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: "#D4AF37",
                        }}
                    />
                )}

                <SansText style={{ fontSize: 14, color: "#575757" }}>
                    {item.time}
                </SansText>
            </View>

        </View>
    );
};