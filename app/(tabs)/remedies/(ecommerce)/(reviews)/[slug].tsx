import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import { SansText } from "@/components/reusable/Text/SansText";
import ReviewCard from "@/components/tabs/ecommerce/ecommerce/ReviewCard/ReviewCard";
import { PRODUCTS } from "@/data/dummy/products";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import React from "react";

import {
    FlatList,
    View,
} from "react-native";


const ProductReviews = () => {
    const { slug } =
        useLocalSearchParams();

    // 🔥 FIND PRODUCT
    const product =
        PRODUCTS.find(
            (item) =>
                item._id === slug
        );

    if (!product) return null;

    return (
        <AnimatedScreen>
    
            <ScreenWrapper>
                <AppHeader
                    onPressBack={() => {
                        router.back();
                    }}
                >
                    <AuthTitle title="Reviews & Ratings">
                        <SansText
                            style={{
                                fontSize: 18,
                            }}
                        >
                            Real experiences
                            shared by verified
                            users.
                        </SansText>
                    </AuthTitle>
                </AppHeader>

                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <FlatList
                        data={
                            product.reviews
                        }
                        keyExtractor={(
                            item,
                            index
                        ) =>
                            item._id ||
                            index.toString()
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingTop: 12,
                            paddingBottom: 40,
                        }}
                        renderItem={({
                            item,
                            index,
                        }) => {
                            const isLast =
                                index ===
                                product.reviews.length - 1;

                            return (
                                <View
                                    style={{
                                        borderBottomWidth:
                                            isLast ? 0 : 1,

                                        borderBottomColor:
                                            "#D8C48E",
                                    }}
                                >
                                    <ReviewCard
                                        review={
                                            item.review
                                        }
                                        rating={
                                            item.rating
                                        }
                                        reviewerName="Verified Customer"
                                        images={
                                            item.images
                                        }
                                    />
                                </View>
                            );
                        }}
                        ListEmptyComponent={
                            <View
                                style={{
                                    paddingTop: 80,
                                    alignItems:
                                        "center",
                                }}
                            >
                                <SansText
                                    style={{
                                        fontSize: 18,
                                        color:
                                            "#777",
                                    }}
                                >
                                    No reviews found
                                </SansText>
                            </View>
                        }
                    />
                </View>
            </ScreenWrapper>
        </AnimatedScreen>
    );
};

export default ProductReviews;