import LocationIcon from "@/assets/icons/navigation/location.svg";
import UserInactive from "@/assets/icons/navigation/user-inactive.svg";
import CallIcon from "@/assets/icons/visual/call.svg";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";

import React from "react";

import {
  StyleSheet,
  View,
} from "react-native";
import ReusableButton from "../ReusableButton/ReusableButton";

type Props = {
  data: {
    user: {
      name: string;
      phone: string;
    };

    location: {
      line1: string;
      line2: string;
      city: string;
      pincode: string;
    };
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
        <View style={styles.row}>
          <UserInactive
            width={18}
            height={18}
          />

          <SatoshiText style={styles.nameText}>
            {data.user.name}
          </SatoshiText>
        </View>

        {/* PHONE */}
        <View style={styles.row}>
          <CallIcon
            width={18}
            height={18}
          />

          <SansText style={styles.infoText}>
            {data.user.phone}
          </SansText>
        </View>

        {/* ADDRESS */}
        <View style={styles.row}>
          <LocationIcon
            width={18}
            height={18}
          />

          <SansText style={styles.infoText}>
            {data.location.line1}
            {"\n"}

            {data.location.line2}
            {"\n"}

            {data.location.city} -{" "}
            {data.location.pincode}
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
              onPress={()=>{onDelete}}
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
              onPress={()=>{onEdit}}
            />
          </View>
        </View>
      )}

      {/* CHANGE ADDRESS BUTTON */}
      {showChangeButton && (
        <ReusableButton
          title="Change Address"
          variant="outline"
          onPress={()=>{onChangeAddress}}
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
});