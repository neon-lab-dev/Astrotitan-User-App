import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import Categories from "@/components/reusable/Categories/Categories";
import { SansText } from "@/components/reusable/Text/SansText";

import RemedyCard from "@/components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCard";
import RemedyCardSkeleton from "@/components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCardSkeleton";

import { useGetAllCategoriesByAreaNameQuery } from "@/redux/features/categories/categoriesApi";

import { useGetAllProductsQuery } from "@/redux/features/product/productsApi";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import React, {
    useCallback,
    useState,
} from "react";

import {
    RefreshControl,
    View,
} from "react-native";

import { FlatList } from "react-native-gesture-handler";

const Products = () => {
  const params =
    useLocalSearchParams();

  const slug =
    Array.isArray(
      params.slug
    )
      ? params.slug[0]
      : params.slug;

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  /* CATEGORIES */

  const {
    data: categories,
    isLoading:
      isCategoryLoading,
  } =
    useGetAllCategoriesByAreaNameQuery(
      "Product"
    );

  /* PRODUCTS */

  const {
    data: productsResponse,
    isLoading:
      isProductLoading,
    isFetching,
    refetch,
  } = useGetAllProductsQuery({
    limit: 20,

    skip: 0,

    category:
      selectedCategory,

    intent: slug,
  });

  const products =
    productsResponse?.data
      ?.data || [];

  /* REFRESH */

  const onRefresh =
    useCallback(
      async () => {
        try {
          setRefreshing(
            true
          );

          await refetch();
        } catch (
          error
        ) {
          console.log(
            "REFRESH ERROR:",
            error
          );
        } finally {
          setRefreshing(
            false
          );
        }
      },
      [refetch]
    );

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader
          onPressBack={() => {
            router.back();
          }}
        >
          <AuthTitle
            title={`${slug} Remedies`}
          >
            <SansText
              style={{
                fontSize: 18,
              }}
            >
              Curated tools to
              strengthen focus,
              stability, and
              professional
              momentum.
            </SansText>
          </AuthTitle>
        </AppHeader>

        <View
          style={{
            flex: 1,
          }}
        >
          {/* CATEGORIES */}

          <Categories
            selectedCategory={
              selectedCategory
            }
            setSelectedCategory={
              setSelectedCategory
            }
            allCategories={
              categories?.data ||
              []
            }
            isLoading={
              isCategoryLoading
            }
          />

          {/* PRODUCTS */}

          <FlatList
            data={
              isProductLoading
                ? [1, 2, 3, 4]
                : products
            }
            numColumns={2}
            refreshControl={
              <RefreshControl
                refreshing={
                  refreshing ||
                  isFetching
                }
                onRefresh={
                  onRefresh
                }
                tintColor="#D4AF37"
                colors={[
                  "#D4AF37",
                ]}
                progressBackgroundColor="#FBF7EB"
              />
            }
            keyExtractor={(
              item,
              index
            ) =>
              isProductLoading
                ? index.toString()
                : item._id
            }
            showsVerticalScrollIndicator={
              false
            }
            columnWrapperStyle={{
              justifyContent:
                "space-between",

              paddingHorizontal: 16,
            }}
            contentContainerStyle={{
              paddingTop: 24,

              paddingBottom: 40,

              rowGap: 16,
            }}
            renderItem={({
              item,
            }) => {
              /* SKELETON */

              if (
                isProductLoading
              ) {
                return (
                  <RemedyCardSkeleton />
                );
              }

              /* PRODUCT CARD */

              return (
                <RemedyCard
                  title={
                    item.name
                  }
                  description={
                    item.description
                  }
                  price={item.discountedPrice.toString()}
                  image={
                    item
                      ?.imageUrls?.[0]
                  }
                  rating={
                    item.rating
                  }
                  onPress={() => {
                    router.push(
                      `/remedies/${item._id}`
                    );
                  }}
                />
              );
            }}
            ListEmptyComponent={
              !isProductLoading ? (
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
                    No remedies
                    found
                  </SansText>
                </View>
              ) : null
            }
          />
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default Products;