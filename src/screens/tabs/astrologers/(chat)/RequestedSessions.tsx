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
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useGetMyConsultationBookingsQuery } from "../../../../redux/features/consultation/consultationApi";
import { setSelectedConsultation } from "../../../../redux/features/consultation/consultationChatSlice";
import { useDispatch } from "react-redux";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Normalize whatever casing the API returns ("pending" / "Pending" / "PENDING")
// into a single canonical lowercase form used throughout this file.
const normalizeStatus = (status?: string) =>
  (status ?? "").toLowerCase();

const RequestedSessions = () => {
  const navigation = useNavigation<NavigationProp>();

  const pending = useGetMyConsultationBookingsQuery({
    status: "pending",
  });

  const accepted = useGetMyConsultationBookingsQuery({
    status: "accepted",
  });

  const isLoading = pending.isLoading || accepted.isLoading;
  const isError = pending.isError || accepted.isError;

  const bookings = [
    ...(pending.data?.data?.data ?? []),
    ...(accepted.data?.data?.data ?? []),
  ];

  const chats = bookings.filter(
    (item: any) => normalizeStatus(item.method) === "chat"
  );

  const calls = bookings.filter(
    (item: any) => normalizeStatus(item.method) === "call"
  );
  const hasSessions = chats.length > 0 || calls.length > 0;

  const dispatch = useDispatch();

  const handleChatNow = (booking: any) => {
    const participant = booking.astrologer;
    const currentParticipantId = booking.user;

    dispatch(
      setSelectedConsultation({
        consultationId: booking._id,
        currentParticipantId,
        participant: {
          _id: participant?.accountId,
          name: participant?.displayName,
          firstName: participant?.firstName,
          lastName: participant?.lastName,
          profilePicture: participant?.profilePicture || "",
          accountId:participant?.accountId,
          role: "astrologer",
        },
      })
    );

    navigation.navigate("AstrologerChatScreen", {
      id: booking._id,
      profilePicture: participant?.profilePicture,
      name: participant?.displayName,
      consultationFor: booking.consultationFor,
    });
  };
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader>
          <AuthTitle title="Requested Sessions">
            <SansText>Your upcoming sessions</SansText>
          </AuthTitle>
        </AppHeader>

        <View style={{ flex: 1 }}>
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SansText style={{ textAlign: "center" }}>
                Loading your sessions...
              </SansText>
            </View>
          ) : isError ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
              }}
            >
              <SansText style={{ textAlign: "center" }}>
                Something went wrong while loading your sessions.
                Please try again.
              </SansText>
            </View>
          ) : !hasSessions ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NoteIcon height={124} width={124} />

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
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  paddingVertical: 16,
                  gap: 16,
                }}
              >
                <SessionSection
                  title="Chats"
                  data={chats}
                  onCardPress={handleChatNow}
                />

                <SessionSection
                  title="Calls"
                  data={calls}
                  onCardPress={() => {
                    // TODO: wire up call screen navigation once available
                  }}
                />
              </View>
            </ScrollView>
          )}

          <ReusableButton
            title="View Astrologers"
            style={{ margin: 16 }}
            onPress={() => navigation.navigate("AstrologerScreen")}
          />
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default RequestedSessions;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  accepted: { bg: "#E8F8EE", text: "#1E8E5A" },
  completed: { bg: "#EAF3FF", text: "#1D4ED8" },
  rejected: { bg: "#FDEDED", text: "#D32F2F" },
  pending: { bg: "#FFF4E5", text: "#B7791F" },
};

const STATUS_LABELS: Record<string, string> = {
  accepted: "Accepted",
  completed: "Completed",
  rejected: "Rejected",
  pending: "Pending",
};

const SessionCard = ({
    booking,
    onPress,
}: any) => {

    const {
        astrologer,
        consultationFor,
        status,
        method,
    } = booking;
  const normalizedStatus = normalizeStatus(status);
  const normalizedMethod = normalizeStatus(method);

  // Only an "accepted" session is actionable — pending/completed/rejected
  // sessions just show their status badge.
  const showActionButton = normalizedStatus === "accepted";
  const isChat = normalizedMethod === "chat";

  const colors =
    STATUS_COLORS[normalizedStatus] ?? STATUS_COLORS.pending;
  const label =
    STATUS_LABELS[normalizedStatus] ?? status ?? "Pending";

  const displayName = astrologer?.displayName ?? "Astrologer";
  const profilePicture = astrologer?.profilePicture;

  return (
    <View
      style={{
        width: 170,
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 8,
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#D4AF37",
      }}
    >
      {profilePicture ? (
        <Image
          source={{ uri: profilePicture }}
          style={{
            width: "100%",
            height: 170,
            borderRadius: 10,
          }}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: 170,
            borderRadius: 10,
            backgroundColor: "#F0F0F0",
          }}
        />
      )}

      <SatoshiText
        numberOfLines={1}
        style={{
          textAlign: "center",
          marginTop: 12,
          fontSize: 14,
          fontFamily: "Satoshi-Bold",
        }}
      >
        {displayName}
      </SatoshiText>

      <SansText
        numberOfLines={2}
        style={{
          marginTop: 4,
          textAlign: "center",
          fontSize: 13,
          color: "#666",
          minHeight: 38,
        }}
      >
        {consultationFor}
      </SansText>

      {!showActionButton ? (
        <View
          style={{
            alignSelf: "center",
            marginTop: 8,
            backgroundColor: colors.bg,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 100,
          }}
        >
          <SansText style={{ color: colors.text, fontSize: 12 }}>
            {label}
          </SansText>
        </View>
      ) : (
        <TouchableOpacity
          disabled={!isChat}
          onPress={() => {
            if (isChat) {
              onPress?.(booking);
            }
          }}
          style={{
            backgroundColor: isChat ? "#D4AF37" : "#E5E5E5",
            paddingVertical: 10,
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          <SansText
            style={{
              textAlign: "center",
              color: isChat ? "#FFF" : "#888",
              fontFamily: "Satoshi-Bold",
            }}
          >
            {isChat ? "Start Chat" : "Start Call"}
          </SansText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const SessionSection = ({ title, data, onCardPress }: any) => {
  if (!data?.length) return null;

  return (
    <View>
      <ContentSection
        title={title}
        sectionStyle={{ paddingLeft: 16 }}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 12,
          paddingLeft: 16,
        }}
      >
        {data.map((item: any) => (
          <SessionCard
            key={item._id ?? item.id}
             booking={item}
            onPress={onCardPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};
