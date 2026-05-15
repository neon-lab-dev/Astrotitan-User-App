import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import ArrowIcon from '@/assets/icons/actions/arrow.svg';
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";

type Props = {
    title: string;
    description?: string;
    ctaText?: string;
    image: any;
    onPress?: () => void;
    date?: Date;
    height?:number;
};

const FeatureCard = ({
    title,
    description,
    ctaText,
    image,
    onPress,
    date,
    height
}: Props) => {
    const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-GB"); // 16/01/2026
};
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <ImageBackground
                source={image}
                style={[styles.container,{height: height||256}]}
                imageStyle={styles.image}
            >
                {/* Gradient Overlay */}
                <LinearGradient
                    colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.84)"]}
                    start={{ x: 0.8, y: 0 }}
                    end={{ x: 0.2, y: 1 }}
                    style={styles.overlay}
                />

                {/* Content */}
                <View style={styles.content}>
                    {/* TOP (Date) */}
                    <View style={styles.topRow}>
                        {date && <View style={styles.blurWrapper}>
                            <BlurView intensity={20} tint="dark" style={styles.dateBadge}>
                                <SansText style={styles.dateText}>{formatDate(date)}</SansText>
                            </BlurView>
                        </View>}
                    </View>

                    {/* BOTTOM */}
                    <View style={styles.bottomContent}>
                        <SatoshiText style={styles.title}>{title}</SatoshiText>

                        {description && (
                            <SansText style={styles.desc}>{description}</SansText>
                        )}

                        {ctaText && (
                            <View style={styles.ctaRow}>
                                <SansText style={styles.cta}>{ctaText}</SansText>
                                <ArrowIcon width={24} height={24} style={{ marginLeft: 8 }} />
                            </View>

                        )}
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default FeatureCard;

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: "hidden",
        justifyContent: "flex-end",
    },

    image: {
        borderRadius: 16,
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
    },

    content: {
        flex: 1,
        padding: 24,
        justifyContent: "space-between",
    },

    topRow: {
        alignItems: "flex-start",
    },

    bottomContent: {
        gap: 6,
    },

    blurWrapper: {
        borderRadius: 20,
        overflow: "hidden",
    },

    dateBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.05)", // 🔥 subtle glass layer
    },

    dateText: {
        color: "#fff",
        fontSize: 14,
    },

    title: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "SatoshiBold",
        lineHeight: 26
    },

    desc: {
        color: "#E0E0E0",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.28
    },
    ctaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8, // 🔥 this gives spacing
    },



    cta: {
        color: "#fff",
        textDecorationLine: "underline",
        marginTop: 4,
        fontSize: 14,
        lineHeight: 20, letterSpacing: 0.28
    },
});