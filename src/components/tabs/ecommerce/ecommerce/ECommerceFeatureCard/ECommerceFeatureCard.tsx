
import React from "react";
import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SatoshiText } from "../../../../reusable/Text/SatoshiText";
import { SansText } from "../../../../reusable/Text/SansText";
import ReusableButton from "../../../../reusable/ReusableButton/ReusableButton";

type Props = {
    title: string;
    description?: string;
    ctaText?: string;
    image: any;
    onPress?: () => void;
    date?: Date;
    height?:number;
};

const ECommerceFeatureCard = ({
    title,
    description,
    ctaText,
    image,
    onPress,
    height
}: Props) => {
   
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <ImageBackground
                source={image}
                style={[styles.container,{height: height||256}]}
                imageStyle={styles.image}
            >
                {/* Gradient Overlay */}
                <LinearGradient
                    colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.50)"]}
                    start={{ x: 0.8, y: 0 }}
                    end={{ x: 0.2, y: 1 }}
                    style={styles.overlay}
                />

                {/* Content */}
                <View style={styles.content}>
                    {/* BOTTOM */}
                    
                        <SatoshiText style={styles.title}>{title}</SatoshiText>

                        {description && (
                            <SansText style={styles.desc}>{description}</SansText>
                        )}

                        {ctaText && (
                            
                            <ReusableButton title={ctaText}  variant="solid"  style={{marginTop: 12, borderRadius:12}} onPress={()=>{}} width={160}   />

                        )}
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default ECommerceFeatureCard;

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
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
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
        color: "#F5F5F5",
        fontSize: 16,
        fontFamily: "Satoshi-Bold",
        lineHeight: 26,
        textAlign: "center"
    },

    desc: {
        color: "#F5F5F5",
        fontSize: 14,
        lineHeight: 20,
        textAlign: "center",
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