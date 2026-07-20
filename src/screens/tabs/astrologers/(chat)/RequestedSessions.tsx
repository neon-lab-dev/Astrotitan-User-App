import NoteIcon from "@/assets/icons/navigation/note.svg";

import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
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
import { useAcceptCallMutation, useEndCallMutation, useGetMyConsultationBookingsQuery, useRejectCallMutation, useStartCallMutation } from "../../../../redux/features/consultation/consultationApi";
import { setSelectedConsultation } from "../../../../redux/features/consultation/consultationChatSlice";
import { useDispatch, } from "react-redux";
import { useConsultationSocket } from "../../../../socket/useConsultationSocket";
import SessionCard from "../../../../components/tabs/astrologer/chats/SessionCard";
import CallModal from "../../../../components/tabs/astrologer/call/CallModal";

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


const SessionSection = ({ title, data, onCardPress }: any) => {
  // Call state
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<
    "incoming" | "ringing" | "connected" | "ended"
  >("incoming");
  const [callerName, setCallerName] = useState("");
  const [callerImage, setCallerImage] = useState("");
  const [currentConsultationId, setCurrentConsultationId] = useState<
    string | null
  >(null);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<any>(null);
  const [twilioToken, setTwilioToken] = useState("");
  const [roomName, setRoomName] = useState("");

  // const user = useSelector(useCurrentUser);
  const { socket } = useConsultationSocket();

  // RTK Query mutations
  const [startCall] = useStartCallMutation();
  const [acceptCall] = useAcceptCallMutation();
  const [rejectCall] = useRejectCallMutation();
  const [endCall] = useEndCallMutation();

  // ✅ Format duration helper
  // const formatDuration = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  // };

  // ✅ Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // ✅ Listen for incoming call
    const handleIncomingCall = (data: any) => {
      console.log("📞 Incoming call:", data);
      setCallerName(data.callerName || "Unknown Caller");
      setCallerImage(data.callerImage );
      setCurrentConsultationId(data.consultationId);
      setCallStatus("incoming");
      setCallModalOpen(true);
      setRoomName(data.roomName || "");
      // Play sound or vibrate here
    };

    // ✅ Call accepted
    const handleCallAccepted = (data: any) => {
      console.log("✅ Call accepted:", data);
      setCallStatus("connected");
      // toast.success("Call connected!");
      setRoomName(data.roomName || "");
      // Start timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    };

    // ✅ Call rejected
    const handleCallRejected = (data: any) => {
      console.log("❌ Call rejected:", data);
      setCallStatus("ended");
      // toast.error("Call was rejected");
      setTimeout(() => {
        setCallModalOpen(false);
        setCallStatus("incoming");
        setCallDuration(0);
        setTwilioToken("");
        setRoomName("");
      }, 2000);
    };

    // ✅ Call ended
    const handleCallEnded = (data: any) => {
      console.log("📞 Call ended:", data);
      setCallStatus("ended");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // toast.success(`Call ended (Duration: ${formatDuration(callDuration)})`);
      setTimeout(() => {
        setCallModalOpen(false);
        setCallStatus("incoming");
        setCallDuration(0);
        setCurrentConsultationId(null);
        setTwilioToken("");
        setRoomName("");
      }, 3000);
    };

    // ✅ Call error
    const handleCallError = (data: any) => {
      console.error("❌ Call error:", data);
      // toast.error(data.message || "Call failed");
      setCallModalOpen(false);
      setCallStatus("incoming");
      setCallDuration(0);
      setTwilioToken("");
      setRoomName("");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);
    socket.on("call-ended", handleCallEnded);
    socket.on("call-error", handleCallError);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
      socket.off("call-ended", handleCallEnded);
      socket.off("call-error", handleCallError);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [socket]);

  // ✅ Start a call
  const handleStartCall = async (
    consultationId: string,
    receiverId: string,
    receiverName: string,
  ) => {
    try {
      setCallerName(receiverName);
      setCurrentConsultationId(consultationId);
      setCallStatus("ringing");
      setCallModalOpen(true);

      const payload = {
        consultationId,
        receiverId,
      };

      const response = await startCall(payload).unwrap();

      if (response.success) {
        setTwilioToken(response.data?.callerToken || "");
        setRoomName(response.data?.roomName || "");
        // toast.success("Calling...");
      }
    } catch (error: any) {
      console.error("Error starting call:", error);
      // toast.error(error?.data?.message || "Failed to start call");
      setCallModalOpen(false);
      setCallStatus("incoming");
    }
  };

  // ✅ Accept call
  const handleAccept = async () => {
    if (!currentConsultationId) return;
    try {
      const response = await acceptCall({
        consultationId: currentConsultationId,
      }).unwrap();
      if (response.success) {
        setCallStatus("connected");
        setTwilioToken(response.data?.receiverToken || "");
        setRoomName(response.data?.roomName || "");
      }
    } catch (error: any) {
      console.error("Error accepting call:", error);
      // toast.error(error?.data?.message || "Failed to accept call");
    }
  };

  // ✅ Reject call
  const handleReject = async () => {
    if (!currentConsultationId) return;
    try {
      const response = await rejectCall({
        consultationId: currentConsultationId,
      }).unwrap();
      if (response.success) {
        setCallStatus("ended");
        setTimeout(() => {
          setCallModalOpen(false);
          setCallStatus("incoming");
          setCallDuration(0);
          setCurrentConsultationId(null);
          setTwilioToken("");
          setRoomName("");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error rejecting call:", error);
      // toast.error(error?.data?.message || "Failed to reject call");
      setCallModalOpen(false);
    }
  };

  // ✅ End call
  const handleEnd = async () => {
    if (!currentConsultationId) return;
    try {
      const response = await endCall({
        consultationId: currentConsultationId,
      }).unwrap();
      if (response.success) {
        setCallStatus("ended");
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        // toast.success(`Call ended (Duration: ${formatDuration(callDuration)})`);
        setTimeout(() => {
          setCallModalOpen(false);
          setCallStatus("incoming");
          setCallDuration(0);
          setCurrentConsultationId(null);
          setTwilioToken("");
          setRoomName("");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error ending call:", error);
      // toast.error(error?.data?.message || "Failed to end call");
      setCallModalOpen(false);
    }
  };

  // ✅ Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
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
            onStartCall={handleStartCall}
          />
        ))}
        <CallModal
        isVisible={callModalOpen}
        onClose={() => {
          setCallModalOpen(false);
          setCallStatus("incoming");
          setCallDuration(0);
          setCurrentConsultationId(null);
          setTwilioToken("");
          setRoomName("");
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }}
        callStatus={callStatus}
        callerName={callerName}
        callerImage={callerImage}
        twilioToken={twilioToken}
        roomName={roomName}
        onAccept={handleAccept}
        onReject={handleReject}
        onEnd={handleEnd}
        duration={callDuration}
      />
      </ScrollView>
    </View>
  );
};
