import LocationIcon from "@/assets/icons/navigation/location.svg";
import UserInactive from "@/assets/icons/navigation/user-inactive.svg";
import CallIcon from "@/assets/icons/visual/call.svg";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";

import React from "react";

import {
  StyleSheet,
  View,
} from "react-native";

type Props = {
  data: {
    _id: string;

    type: "home" | "office";

    fullName: string;

    phoneNumber: string;

    alternativePhoneNumber?: string;

    addressLine1: string;

    addressLine2: string;

    city: string;

    state: string;

    pinCode: string;

    country: string;
  };

  onEdit?: () => void;

  onDelete?: () => void;

  showActions?: boolean;

  showChangeButton?: boolean;

  onChangeAddress?: () => void;
};

const AddressCard = ({
  data,
  onEdit,
  onDelete,
  showActions = false,
  showChangeButton = false,
  onChangeAddress,
}: Props) => {
  return (
    <View style={styles.wrapper}>
      {/* CARD */}
      <View style={styles.card}>
        {/* NAME */}
        {/* NAME */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* LEFT */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
            }}
          >
            <UserInactive
              width={18}
              height={18}
            />

            <SatoshiText
              style={styles.nameText}
              numberOfLines={1}
            >
              {data.fullName}
            </SatoshiText>
          </View>

          {/* RIGHT BADGE */}
          <View style={styles.typeBadge}>
            <SansText style={styles.typeText}>
              {data.type}
            </SansText>
          </View>
        </View>
        {/* PHONE */}
        <View style={styles.row}>
          <CallIcon
            width={18}
            height={18}
          />

          <SansText style={styles.infoText}>
            {data.phoneNumber}
          </SansText>
        </View>

        {/* ADDRESS */}
        <View style={styles.row}>
          <LocationIcon
            width={18}
            height={18}
          />

          <SansText style={styles.infoText}>
            {data.addressLine1}
            {"\n"}

            {data.addressLine2}
            {"\n"}

            {data.city},{" "}
            {data.state} -{" "}
            {data.pinCode}
            {"\n"}

            {data.country}
          </SansText>
        </View>
      </View>

      {/* EDIT + DELETE BUTTONS */}
      {showActions && (
        <View style={styles.actionRow}>
          <View style={{ flex: 1 }}>
            <ReusableButton
              title="Delete"
              variant="outline"
              onPress={() => onDelete?.()}
              borderColor="#C2371E"
              textColor="#C2371E"
              iconName="DeleteIcon"
              iconPosition="left"
            />
          </View>

          <View style={{ flex: 1 }}>
            <ReusableButton
              title="Edit"
              variant="solid"
              onPress={() => onEdit?.()}
            />
          </View>
        </View>
      )}

      {/* CHANGE ADDRESS BUTTON */}
      {showChangeButton && (
        <ReusableButton
          title="Change Address"
          variant="outline"
          onPress={() =>
            onChangeAddress?.()
          }
        />
      )}
    </View>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },

  card: {
    backgroundColor: "#FBF7EB",

    borderRadius: 16,

    padding: 16,

    borderWidth: 1,

    borderColor: "#D4AF37",

    gap: 14,
  },

  row: {
    flexDirection: "row",

    gap: 10,

    alignItems: "flex-start",
  },

  nameText: {
    flexShrink: 1,
    fontSize: 18,

    color: "#0D0D0D",

    fontFamily: "SatoshiBold",

    flex: 1,
  },

  infoText: {
    fontSize: 15,

    color: "#4B4B4B",

    lineHeight: 24,

    fontFamily: "SatoshiMedium",

    flex: 1,
  },

  actionRow: {
    flexDirection: "row",

    gap: 12,

    alignItems: "center",
  },

  typeBadge: {
    backgroundColor: "#EFE5C8",

    borderRadius: 999,

    paddingHorizontal: 10,

    paddingVertical: 5,

    justifyContent: "center",

    alignItems: "center",

    flexShrink: 0,
  },

  typeText: {
    fontSize: 12,

    textTransform: "capitalize",

    color: "#0D0D0D",

    fontFamily: "SansBold",
  },
});