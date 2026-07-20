import { Image, TouchableOpacity, View } from "react-native";
import { SatoshiText } from "../../../reusable/Text/SatoshiText";
import { SansText } from "../../../reusable/Text/SansText";

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

const normalizeStatus = (status?: string) =>
  (status ?? "").toLowerCase();

const SessionCard = ({
    booking,
    onPress,
    onStartCall
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
            }else{
              onStartCall(booking?._id, booking?.astrologer?._id, booking?.astrologer?.displayName )
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

export default SessionCard