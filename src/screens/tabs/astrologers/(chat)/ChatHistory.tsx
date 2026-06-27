import ArrowRoundedIcon from "@/assets/icons/actions/arrow-down-round.svg";
import NoteIcon from "@/assets/icons/navigation/note.svg";


import React from "react";

import {
    Image,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import ContentSection from "../../../../components/reusable/ContentSectoin/ContentSection";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";
import { useGetMyConsultationBookingsQuery } from "../../../../redux/features/consultation/consultationApi";
import { formatDate } from "../../../../utils/validators/dateValidators";
import SkeletonLoader from "../../../../components/reusable/SkeletonLoader/SkeletonLoade";

const ChatHistory = () => {
    type NavigationProp =
        NativeStackNavigationProp<RootStackParamList>;

    const navigation = useNavigation<NavigationProp>();

  
  const {
    data: consultationBookings,
    isLoading: isBookingLoading,refetch:bookingRefetch
  } = useGetMyConsultationBookingsQuery({status:"ended"});
  const bookings = consultationBookings?.data?.data || [];
    return (
        <AnimatedScreen>
            <ScreenWrapper>
                <AppHeader
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
                   {isBookingLoading ? (
    <SessionSkeleton />
) : bookings.length <= 0 ? (
    <View
        style={{
            flex: 1,
            justifyContent: "center",
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
    <ScrollView
        showsVerticalScrollIndicator={false}
    >
        <View
            style={{
                paddingVertical: 16,
            }}
        >
            {bookings.map((item: any) => (
                <SessionItem
                    key={item._id}
                    name={item?.astrologer?.displayName}
                    time={formatDate(item.createdAt)}
                    image={item?.astrologer?.profilePicture}
                    description={`${item?.method} Request`}
                />
            ))}
        </View>
    </ScrollView>
)}

                    {/* BUTTON */}

                    <ReusableButton
                        onPress={() =>
                            navigation.navigate(
                                "RequestedSessions"
                            )
                        }
                        style={{marginVertical:16}}
                        title="View Requested Sessions"
                    />
                </View>
            </ScreenWrapper>
        </AnimatedScreen>
    );
};

export default ChatHistory;

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
    source={{ uri: image }}
    style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#D8D8D8",
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
                                fontSize: 16,
                                color: "#0D0D0D",
                                fontFamily:
                                    "Satoshi-Bold",
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
                                transform: [{ rotate: "-90deg", },],
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


const SessionSkeleton = () => {
    return (
        <View
            style={{
                paddingVertical: 16,
                gap: 20,
            }}
        >
            {[1, 2, 3, 4, 5].map((item) => (
                <View
                    key={item}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 8,
                    }}
                >
                    {/* Avatar */}

                    <SkeletonLoader
                        width={52}
                        height={52}
                        borderRadius={26}
                        array={[1]}
                    />

                    <View
                        style={{
                            flex: 1,
                            marginLeft: 12,
                        }}
                    >
                        {/* Name */}

                        <SkeletonLoader
                            width={"55%"}
                            height={16}
                            borderRadius={8}
                            array={[1]}
                        />

                        <View style={{ height: 8 }} />

                        {/* Description */}

                        <SkeletonLoader
                            width={"35%"}
                            height={12}
                            borderRadius={8}
                            array={[1]}
                        />

                        <View style={{ height: 8 }} />

                        {/* Date */}

                        <SkeletonLoader
                            width={"25%"}
                            height={12}
                            borderRadius={8}
                            array={[1]}
                        />
                    </View>

                    {/* Arrow */}

                    <SkeletonLoader
                        width={20}
                        height={20}
                        borderRadius={10}
                        array={[1]}
                    />
                </View>
            ))}
        </View>
    );
};