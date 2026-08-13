
import React from "react";
import {
  FlatList,
  View,
} from "react-native";
import { useGetSingleProductByIdQuery } from "../../../../redux/features/product/productsApi";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import SkeletonLoader from "../../../../components/reusable/SkeletonLoader/SkeletonLoade";
import ReviewCardSkeleton from "../../../../components/tabs/ecommerce/ecommerce/ReviewCard/ReviewCardSkeleton";
import ReviewCard from "../../../../components/tabs/ecommerce/ecommerce/ReviewCard/ReviewCard";
import { useRoute } from "@react-navigation/native";

const ProductReviews = () => {
  const route = useRoute<any>();

  const id = Array.isArray(route.params?.id)
  ? route.params.id[0]
  : route.params?.id;

  const {
    data: productResponse,
    isLoading,
    isError,
  } =
    useGetSingleProductByIdQuery(
      id as string
    );

  const product =
    productResponse?.data;

  /* LOADING */

  if (isLoading) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppHeader>
            <AuthTitle title="Reviews & Ratings">
              <SansText
                style={{
                  fontSize: 16,
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
            {/* HEADER SKELETON */}

            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 18,
                gap: 12,
              }}
            >
              <SkeletonLoader
                width="48%"
                height={28}
                borderRadius={8}
                array={[1]}
              />

              <SkeletonLoader
                width="88%"
                height={14}
                borderRadius={6}
                array={[1]}
              />
            </View>

            {/* REVIEWS */}

            <FlatList
              data={[1, 2, 3]}
              keyExtractor={(
                item
              ) =>
                item.toString()
              }
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 24,
                paddingBottom: 40,
              }}
              renderItem={({
                index,
              }) => {
                const isLast =
                  index === 2;

                return (
                  <View
                    style={{
                      borderBottomWidth:
                        isLast
                          ? 0
                          : 1,

                      borderBottomColor:
                        "#D8C48E",
                    }}
                  >
                    <ReviewCardSkeleton />
                  </View>
                );
              }}
            />
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  /* ERROR */

  if (
    isError ||
    !product
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >
        <SansText>
          Failed to load
          reviews
        </SansText>
      </View>
    );
  }

  /* MAIN */

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader
        >
          <AuthTitle title="Reviews & Ratings">
            <SansText
              style={{
                fontSize: 16,
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
              product?.reviews
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
                product?.reviews
                  .length -
                  1;

              return (
                <View
                  style={{
                    borderBottomWidth:
                      isLast
                        ? 0
                        : 1,

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
                    fontSize: 16,
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