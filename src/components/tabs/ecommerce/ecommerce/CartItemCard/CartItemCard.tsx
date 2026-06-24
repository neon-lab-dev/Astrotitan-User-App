import DeleteIcon from '@/assets/icons/actions/delete.svg';
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { SatoshiText } from '../../../../reusable/Text/SatoshiText';
import { SansText } from '../../../../reusable/Text/SansText';

type Props = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  mode?: "cart" | "review";
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
};

const CartItemCard = ({
  name,
  price,
  image,
  quantity,
  mode = "cart",
  onIncrease,
  onDecrease,
  onRemove,
}: Props) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.right}>
        {/* TOP */}
        <View style={styles.topRow}>
          <SatoshiText style={styles.title} numberOfLines={2}>
            {name}
          </SatoshiText>

          <SatoshiText style={styles.price}>
            ₹ {price}/-
          </SatoshiText>
        </View>

        {/* 🔥 MODE SWITCH */}
        {mode === "cart" ? (
          <View style={styles.bottomRow}>
            <Pressable onPress={onRemove}>
              <DeleteIcon height={20} width={20} />
            </Pressable>

            <View style={styles.qtyBox}>
              <Pressable onPress={onDecrease}>
                <SansText style={styles.qtyBtn}>−</SansText>
              </Pressable>

              <SansText style={styles.qtyText}>
                {quantity}
              </SansText>

              <Pressable onPress={onIncrease}>
                <SansText style={styles.qtyBtn}>＋</SansText>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.reviewRow}>
            <SansText style={styles.qtyReview}>
              Qty: {quantity}
            </SansText>
          </View>
        )}
      </View>
    </View>
  );
};

export default CartItemCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
    marginBottom: 12,
  },

  image: {
    width: 86,
    height: 86,
    borderRadius: 10,
  },

  right: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontFamily: "Satoshi-Bold",
    flex: 1,
    marginRight: 8,
  },

  price: {
    fontSize: 16,
    fontFamily: "Satoshi-Bold",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  qtyBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  qtyBtn: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
  },

  qtyText: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
  },

  reviewRow: {
    marginTop: 6,
  },

  qtyReview: {
    fontSize: 14,
    color: "#555",
  },
});