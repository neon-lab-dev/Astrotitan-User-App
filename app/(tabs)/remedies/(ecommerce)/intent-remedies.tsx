




import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import Categories from '@/components/reusable/Categories/Categories';
import { SansText } from "@/components/reusable/Text/SansText";
import RemedyCard from "@/components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCard";
import { useGetAllCategoriesByAreaNameQuery } from "@/redux/features/categories/categoriesApi";
import { useGetAllProductsQuery } from "@/redux/features/product/productsApi";
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const Products = () => {


    const params = useLocalSearchParams();

    const slug = Array.isArray(params.slug)
        ? params.slug[0]
        : params.slug;
    const [selectedCategory, setSelectedCategory] = useState("");
    const { data: categories, isLoading } = useGetAllCategoriesByAreaNameQuery("Product");
    const {
        data: productsResponse,
        isLoading: isProductLoading,
    } = useGetAllProductsQuery({

        limit: 20,
        skip: 0,
        category: selectedCategory,
        intent: slug
    });

    const products =
        productsResponse?.data?.data || [];
    return (
        <AnimatedScreen>
            <ScreenWrapper>
                <AppHeader onPressBack={() => { router.back() }}>
                    <AuthTitle title={`${slug} Remedies`}>
                        <SansText style={{ fontSize: 18 }}>Curated tools to strengthen focus, stability, and professional momentum.</SansText>
                    </AuthTitle>
                </AppHeader>

                <View style={{ flex: 1, }}>
                    <Categories
                        selectedCategory={selectedCategory}W
                        setSelectedCategory={setSelectedCategory}
                        allCategories={categories?.data || []}
                        isLoading={isLoading}
                    />
                    <FlatList
                        data={products}
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


