import React from "react";
import ArrowRoundedIcon from '@/assets/icons/actions/arrow-down-round.svg';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SansText } from "../../../../reusable/Text/SansText";
import { SatoshiText } from "../../../../reusable/Text/SatoshiText";

/* ---------------- TYPES ---------------- */

export type OrderStatus =
  |"pending"
  | "placed"
  | "scheduled"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed"
  | "returned"
  | "refunded";

type Props = {
  image: any;

  title: string;

  status: OrderStatus;

  date: string;

  onPress?: () => void;
};

/* ---------------- STATUS CONFIG ---------------- */

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    color: string;
  }
> = {
  pending: {
    label: "Pending",
    color: "#B38A00",
  },
  placed: {
    label: "Order Placed",
    color: "#816B22",
  },

  scheduled: {
    label: "Scheduled",
    color: "#B38A00",
  },

  confirmed: {
    label: "Confirmed",
    color: "#3B7A57",
  },

  processing: {
    label: "Processing",
    color: "#5E5ADB",
  },

  packed: {
    label: "Packed",
    color: "#4C6FFF",
  },

  shipped: {
    label: "Shipped",
    color: "#111111",
  },

  out_for_delivery: {
    label: "Out For Delivery",
    color: "#1D7A34",
  },

  delivered: {
    label: "Delivered",
    color: "#008A2E",
  },

  cancelled: {
    label: "Cancelled",
    color: "#D92D20",
  },

  failed: {
    label: "Payment Failed",
    color: "#C62828",
  },

  returned: {
    label: "Returned",
    color: "#7A4D00",
  },

  refunded: {
    label: "Refunded",
    color: "#005B99",
  },
};

/* ---------------- COMPONENT ---------------- */

const OrderCard = ({
  image,
  title,
  status,
  date,
  onPress,
}: Props) => {
  const currentStatus =
    STATUS_CONFIG[
    status as OrderStatus
    ] || {
      label:
        status
          ?.replaceAll(
            "_",
            " "
          )
          ?.replace(
            /\b\w/g,
            (char) =>
              char.toUpperCase()
          ) || "Unknown",

      color: "#816B22",
    };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      {/* LEFT */}

      <View style={styles.leftSection}>
       <Image
  source={
    image
      ? { uri: image }
      : undefined
  }
  style={styles.image}
  resizeMode="cover"
/>

        <View style={styles.content}>
          {/* TITLE */}

          <SansText style={styles.title}>
            {title}
          </SansText>

          {/* STATUS */}

          <SatoshiText
            style={[
              styles.statusText,
              {
                color:
                  currentStatus.color,
              },
            ]}
          >
            {currentStatus.label} on{" "}
            {date}
          </SatoshiText>
        </View>
      </View>

      {/* RIGHT */}

      <View style={styles.arrowContainer}>
        <ArrowRoundedIcon
          width={20}
          height={20}
        />
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    padding: 16,

    borderWidth: 1,

    borderColor: "#D4AF37",

    borderRadius: 16,

    backgroundColor: "#FBF7EB",

    gap: 12,
  },

  leftSection: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,

    gap: 12,
  },

  image: {
    width: 83,
    height: 83,
    borderRadius: 14,
    backgroundColor:"#FBF7EB"
  },

  content: {
    flex: 1,

    gap: 4,
  },

  title: {
    fontSize: 14,

    color: "#3D372A",

    lineHeight: 22,
  },

  statusText: {
    fontSize: 14,

    lineHeight: 18,

    fontFamily: "Satoshi-Bold",
  },

  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",

    transform: [
      {
        rotate: "-90deg",
      },
    ],
  },
});
