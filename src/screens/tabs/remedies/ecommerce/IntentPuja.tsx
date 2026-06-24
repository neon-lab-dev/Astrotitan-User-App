

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {
  useCallback,
  useState,
} from "react";

import {
  RefreshControl,
  View,
} from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { RootStackParamList } from "../../../../navigation/types";
import { useGetAllCategoriesByAreaNameQuery } from "../../../../redux/features/categories/categoriesApi";
import { useGetAllPujasQuery } from "../../../../redux/features/puja/pujaApi";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import Categories from "../../../../components/reusable/Categories/Categories";
import { useNavigation, useRoute } from "@react-navigation/native";
import RemedyCardSkeleton from "../../../../components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCardSkeleton";
import RemedyCard from "../../../../components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCard";

const IntentPuja = () => {
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<any>();

  const slug = Array.isArray(route.params?.slug)
    ? route.params.slug[0]
    : route.params?.slug ?? "";

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
      "Puja"
    );

  /* PUJAS */

  const {
    data: pujasResponse,
    isLoading:
    isPujasLoading,
    isFetching,
    refetch,
  } =
    useGetAllPujasQuery(
      {
        limit: 20,

        skip: 0,

        category:
          selectedCategory,

        intent: slug,
      }
    );

  const pujas =
    pujasResponse?.data
      ?.pujas || [];

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

  /* RENDER */

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader>
          <AuthTitle
            title={`${slug} Poojas`}
          >
            <SansText
              style={{
                fontSize: 18,
              }}
            >
              Sacred rituals
              curated for your
              spiritual goals
              and planetary
              alignment.
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

          {/* PUJAS */}

          <FlatList
            data={
              isPujasLoading
                ? [1, 2, 3, 4]
                : pujas
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
              isPujasLoading
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
                isPujasLoading
              ) {
                return (
                  <RemedyCardSkeleton />
                );
              }

              /* CARD */

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


                    navigation.navigate("PujaDetails", { id: item._id, })
                  }}
                />
              );
            }}
            ListEmptyComponent={
              !isPujasLoading ? (
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
                    No poojas found
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

export default IntentPuja;