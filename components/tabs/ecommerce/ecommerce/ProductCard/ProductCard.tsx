
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import {
    addToCart,
    decreaseQty,
    increaseQty,
    removeFromCart
} from "@/redux/features/cart/cartSlice";
import { RootState } from "@/redux/store";
import { router } from "expo-router";
import React from "react";
import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

type Props = {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    variant?: "product" | "pooja";
};

const ProductCard = ({
    id,
    title,
    description,
    price,
    image,
    variant = "product"
}: Props) => {
    const FALLBACK_IMAGE =
        "https://images.unsplash.com/photo-1519681393784-d120267933ba";

    const dispatch = useDispatch();

    const cartItem = useSelector((state: RootState) =>
        state.cart.items.find((item) => item.id === id)
    );

    const quantity = cartItem?.quantity || 0;

    return (
        <TouchableOpacity onPress={() => {
            if (variant === "product") {
                router.push({
                    pathname:
                        "/(tabs)/remedies/(ecommerce)/product-details",
                    params: {
                        id,
                    },
                });
            }

            if (variant === "pooja") {
                router.push({
                    pathname:
                        "/(tabs)/remedies/(ecommerce)/pooja-details",
                    params: {
                        id,
                    },
                });
            }
        }} style={styles.card}>
            <ImageBackground
                source={{
                    uri: image?.length ? image : FALLBACK_IMAGE,
                }}
                style={styles.image}
                imageStyle={styles.imageRadius}
            >
                <View style={styles.overlay} />

                <View style={styles.content}>
                    <SansText style={styles.title}>{title}</SansText>
                    <SansText style={styles.desc}>{description}</SansText>
                    <SansText style={styles.price}>₹ {price}/-</SansText>
                </View>
            </ImageBackground>

            {/* 🔥 DYNAMIC BUTTON */}
            {/* PRODUCT VARIANT */}
            {variant === "product" &&
                (quantity === 0 ? (
                    <ReusableButton
                        style={{ marginTop: 10 }}
                        variant="outline"
                        title="Add"
                        onPress={() =>
                            dispatch(
                                addToCart({
                                    id,
                                    name: title,
                                    price,
                                    image,
                                    quantity: 1,
                                })
                            )
                        }
                        iconName="AddIcon"
                        iconPosition="left"
                    />
                ) : (
                    <View style={styles.qtyContainer}>
                        <ReusableButton
                            iconName="RemoveIcon"
                            variant="outline"
                            onPress={() => {
                                if (quantity > 1) {
                                    dispatch(decreaseQty(id));
                                } else {
                                    dispatch(removeFromCart(id));
                                }
                            }}
                            style={styles.qtyBtn}
                        />

                        <SansText style={styles.qtyCount}>
                            {quantity}
                        </SansText>

                        <ReusableButton
                            iconName="AddIcon"
                            variant="outline"
                            onPress={() => dispatch(increaseQty(id))}
                            style={styles.qtyBtn}
                        />
                    </View>
                ))}

            {/* POOJA VARIANT */}
            {variant === "pooja" && (
                <ReusableButton
                    style={{ marginTop: 10 }}
                    variant="outline"
                    title="View Details"
                    onPress={() => {
                        router.push({
                            pathname:
                                "/(tabs)/remedies/(ecommerce)/pooja-details",
                            params: {
                                id,
                            },
                        });
                    }}
                />
            )}
        </TouchableOpacity>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
    },

    image: {
        height: 248,
        width: 248,
        justifyContent: "flex-end",
    },

    imageRadius: {
        borderRadius: 16,
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
        borderRadius: 16,
    },

    content: {
        padding: 16,
    },

    title: {
        fontSize: 18,
        fontFamily: "SatoshiBold",
        color: "#F5F5F5",
    },

    desc: {
        fontSize: 14,
        color: "#F5F5F5",
        marginTop: 4,
    },

    price: {
        fontSize: 18,
        fontFamily: "SatoshiBold",
        color: "#fff",
        marginTop: 8,
    },

    qtyContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        gap: 16,
    },

    qtyBtn: {
        borderWidth: 1,
        borderColor: "#D4AF37",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },

    qtyText: {
        fontSize: 18,
        fontFamily: "SatoshiBold",
    },

    qtyCount: {
        fontSize: 18,
        fontFamily: "SatoshiBold",
    },
});