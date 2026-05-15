




import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import Categories from '@/components/reusable/Categories/Categories';
import { SansText } from "@/components/reusable/Text/SansText";
import RemedyCard from "@/components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCard";
import { PRODUCTS } from "@/data/dummy/products";
import { router } from 'expo-router';
import React, { useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const Products = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const categories = ["Mala", "Puja Materials", "Yantra"];
    return (
        <AnimatedScreen>
            <ScreenWrapper>

                <AppHeader onPressBack={() => { router.back() }}>
                    <AuthTitle title="Career Growth Remedies">
                        <SansText style={{ fontSize: 18 }}>Curated tools to strengthen focus, stability, and professional momentum.</SansText>
                    </AuthTitle>
                </AppHeader>

                <View style={{ flex: 1, }}>
                    <Categories
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        allCategories={categories}
                    />
                    <FlatList
                        data={PRODUCTS}
                        numColumns={2}
                        keyExtractor={(item, index) => index.toString()}
                        columnWrapperStyle={{
                            justifyContent: "space-between",
                            paddingHorizontal: 16,
                        }}
                        contentContainerStyle={{
                            paddingTop: 24,
                            paddingBottom: 40,
                            rowGap: 12,
                        }}
                        renderItem={({ item }) => <RemedyCard
                            title={item.name}
                            description={item.description}
                            price={item.discountedPrice.toString()}
                            image={item.imageUrls?.[0]}
                            rating={item.rating}
                            onPress={() => {
                                router.push(`/remedies/${item._id}`);
                            }}
                        />}
                    />





                </View>

            </ScreenWrapper>
        </AnimatedScreen>
    );
};

export default Products;


