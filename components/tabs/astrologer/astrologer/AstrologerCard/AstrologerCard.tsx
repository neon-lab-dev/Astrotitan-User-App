import StarIcon from '@/assets/icons/visual/star.svg';
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, View } from 'react-native';

export const AstrologerCard = ({
    item,
}: any) => {
    return (
        <AnimatedScreen>
            <View style={styles.card}>
                <View style={styles.cardTop}
                >
                    <Image
                        source={{ uri: item.profilePicture, }}
                        style={styles.avatar}
                    />
                    <View  style={{ flex: 1, }}                    >
                        <SatoshiText style={styles.name}> {item.displayName}</SatoshiText>
                        <SansText style={styles.sub}>{item.areaOfPractice.slice(0, 2)?.join( "•")}</SansText>

                        <View
                            style={{
                                flexDirection:"row",
                                gap: 4,
                                alignItems:"center",
                            }}
                        >
                            <StarIcon
                                height={20}
                                width={20}
                            />

                            <SatoshiText style={styles.rating}> {item.rating}
                            </SatoshiText>

                            <SansText
                                style={{color:"#757575", }}>(
                                {item
                                    ?.reviews
                                    ?.length || 0}{" "}
                                Reviews) </SansText>
                        </View>

                        <SansText
                            style={styles.desc } >
                            {item.bio.slice(
                                0,
                                30
                            ) + "..."}</SansText>
                    </View>
                </View>

                <ReusableButton
                    onPress={() => {
                        router.push({
                            pathname:
                                "/(tabs)/astrologers/(astrologer)/[id]",
                            params: {
                                id: item._id,
                            },
                        });
                    }}
                    title="Consult now"
                    variant="outline"
                    style={{
                        marginTop: 16,
                        borderRadius: 12,
                    }}
                    iconName="ChatIcon"
                    iconPosition="left"
                />
            </View>
        </AnimatedScreen>
    );
};
const styles =
    StyleSheet.create({

        card: {
            backgroundColor: "#FBF7EB",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#D4AF37",
        },

        cardTop: {
            flexDirection: "row",
            gap: 12,
        },

        avatar: {
            width: 124,
            height: 124,
            borderRadius: 12,
        },

        name: {
            fontSize: 18,
            lineHeight: 26,
            fontFamily: "SatoshiBold",
            color: "#0D0D0D",
        },

        sub: {
            fontSize: 12,
            color: "#0D0D0D",
            lineHeight: 20,
        },

        rating: {
            fontSize: 18,
            color: "#0D0D0D",
            fontFamily:
                "SatoshiBold",
        },

        desc: {
            fontSize: 13,
            marginTop: 4,
            color: "#444",
        },
    });