
import React from "react";
import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,

    useWindowDimensions,

    View,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import ArrowIcon from '@/assets/icons/actions/arrow.svg';
import RenderHTML, { defaultSystemFonts, MixedStyleDeclaration } from "react-native-render-html";
import LinearGradient from "react-native-linear-gradient";
import { SansText } from "../../../../reusable/Text/SansText";
import { SatoshiText } from "../../../../reusable/Text/SatoshiText";

type Props = {
    title: string;
    description?: string;
    ctaText?: string;
    image: any;
    onPress?: () => void;
    date?: Date;
    height?: number;
};


const systemFonts = [
    ...defaultSystemFonts,
    "Satoshi-Regular",
    "Satoshi-Medium",
    "Satoshi-Bold",
];

const htmlStyles: Record<string, MixedStyleDeclaration> = {
    body: {
        color: "#E0E0E0",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.28,
        fontFamily: "Satoshi-Regular",
    },

    div: {
        color: "#E0E0E0",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.28,
        fontFamily: "Satoshi-Regular",
    },

    p: {
        color: "#E0E0E0",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.28,
        fontFamily: "Satoshi-Regular",
        marginBottom: 12,
    },

    b: {
        color: "#E0E0E0",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.28,
        fontFamily: "Satoshi-Bold",
    },

    strong: {
        fontFamily: "Satoshi-Bold",
        color: "#E0E0E0",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.28,
    },

    i: {
        fontStyle: "italic",
    },

    em: {
        fontStyle: "italic",
    },

    ul: {
        marginVertical: 10,
        fontFamily: "Satoshi-Regular",
        color: "#E0E0E0",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.28,
    },

    ol: {
        marginVertical: 10,
        fontFamily: "Satoshi-Regular", color: "#E0E0E0",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.28,
    },

    li: {
        fontFamily: "Satoshi-Regular",
        color: "#E0E0E0",
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.28,
        marginBottom: 6,
    },
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
    const { width } = useWindowDimensions();
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <ImageBackground
                source={image}
                style={[styles.container, { height: height || 256 }]}
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
                        {date && <View >
                            <View
                                style={styles.dateBadge}
                            >
                                <SansText style={styles.dateText}>
                                    {formatDate(date)}
                                </SansText>
                            </View>
                        </View>}
                    </View>

                    {/* BOTTOM */}
                    <View style={styles.bottomContent}>
                        <SatoshiText style={styles.title}>{title.slice(0, 30)}{title.length > 50 ? "..." : ""}</SatoshiText>

                        {description && (
                            <RenderHTML
                                contentWidth={width - 40}
                                source={{
                                    html: description || "",
                                }}
                                systemFonts={systemFonts}
                                tagsStyles={htmlStyles}
                                baseStyle={{
                                    fontFamily: "Satoshi-Regular",
                                    color: "#E0E0E0",
                                    fontSize: 14,
                                    lineHeight: 28,
                                }}
                            />
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
        ...StyleSheet.absoluteFill,
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

 

    dateBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: "rgba(28, 27, 27, 0.77)",
        includeFontPadding: false,
    },

    dateText: {
        color: "#fff",
        fontSize: 14,
        textAlign: "center",
    },

    title: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Satoshi-Bold",
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