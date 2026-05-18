import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";

import React from "react";

import {
    StyleSheet,
    View,
} from "react-native";

const ReviewCardSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* IMAGES */}

            <View style={styles.imageRow}>
                {[1, 2].map((item) => (
                    <SkeletonLoader
                        key={item}
                        width={86}
                        height={86}
                        borderRadius={12}
                        array={[1]}
                    />
                ))}
            </View>

            {/* REVIEW */}

            <View style={styles.reviewContainer}>
                <SkeletonLoader
                    width="100%"
                    height={16}
                    borderRadius={6}
                    array={[1]}
                />

                <SkeletonLoader
                    width="94%"
                    height={16}
                    borderRadius={6}
                    array={[1]}
                />

                <SkeletonLoader
                    width="72%"
                    height={16}
                    borderRadius={6}
                    array={[1]}
                />
            </View>

            {/* FOOTER */}

            <View style={styles.footer}>
                {/* NAME */}

                <SkeletonLoader
                    width={120}
                    height={18}
                    borderRadius={8}
                    array={[1]}
                />

                {/* RATING */}

                <SkeletonLoader
                    width={82}
                    height={46}
                    borderRadius={12}
                    array={[1]}
                />
            </View>
        </View>
    );
};

export default ReviewCardSkeleton;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 18,
        gap: 12,
        borderWidth: 1,
        borderColor: "#D4AF37",
        backgroundColor: "#FBF7EB",
    },

    imageRow: {
        flexDirection: "row",
        gap: 12,
    },

    reviewContainer: {
        gap: 10,
    },

    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },
});