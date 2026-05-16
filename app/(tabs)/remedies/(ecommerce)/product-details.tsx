import StarIcon from "@/assets/icons/visual/star.svg";
import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import ContentSection from "@/components/reusable/ContentSectoin/ContentSection";
import {
  IconName,
  ICONS,
} from "@/components/reusable/Icons";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import RemedyCard from "@/components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCard";
import ReviewCard from "@/components/tabs/ecommerce/ecommerce/ReviewCard/ReviewCard";
import {
  addToCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "@/redux/features/cart/cartSlice";
import { setCheckoutItems } from "@/redux/features/checkout/checkoutSlice";
import {
  useGetAllProductsQuery,
  useGetSingleProductByIdQuery,
} from "@/redux/features/product/productsApi";
import { RootState } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import React, {
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  useDispatch,
  useSelector,
} from "react-redux";

const ProductDetails = () => {
  const params =
    useLocalSearchParams();

  const id = Array.isArray(
    params.id
  )
    ? params.id[0]
    : params.id;
  const [
    whoExpanded,
    setWhoExpanded,
  ] = useState(true);

  const [
    howExpanded,
    setHowExpanded,
  ] = useState(true);

  const dispatch = useDispatch();

  const {
    data: productResponse,
    isLoading,
    isError,
  } =
    useGetSingleProductByIdQuery(
      id
    );

  const product =
    productResponse?.data;

  const [
    activeImage,
    setActiveImage,
  ] = useState(0);
  const cartItem = useSelector(
    (state: RootState) =>
      state.cart.items.find(
        (item) =>
          item.id ===
          product?._id
      )
  );

  const quantity =
    cartItem?.quantity || 0;

  const {
    data: relatedProductsResponse,
  } = useGetAllProductsQuery({
    category:
      product?.category,
    limit: 4,
  });

  const relatedProducts =
    relatedProductsResponse?.data
      ?.data?.filter(
        (item: any) =>
          item._id !==
          product?._id
      ) || [];

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        <SansText>
          Loading product...
        </SansText>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        <SansText>
          Product not found
        </SansText>
      </View>
    );
  }



  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader
          onPressBack={() => {
            router.back();
          }}
        >
          <AuthTitle title="Product details" />
        </AppHeader>

        <View
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          >
            {/* IMAGE CAROUSEL */}
            <View
              style={
                styles.imageContainer
              }
            >
              <FlatList
                data={
                  product?.imageUrls ||
                  []
                }
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={
                  false
                }
                keyExtractor={(
                  item,
                  index
                ) =>
                  `${item}-${index}`
                }
                onScroll={(e) => {
                  const index =
                    Math.round(
                      e.nativeEvent
                        .contentOffset.x /
                      (Dimensions.get(
                        "window"
                      ).width -
                        32)
                    );

                  setActiveImage(
                    index
                  );
                }}
                scrollEventThrottle={
                  16
                }
                renderItem={({
                  item,
                }) => (
                  <Image
                    source={item}
                    style={
                      styles.productImage
                    }
                    contentFit="cover"
                  />
                )}
              />


            </View>

            <View
              style={
                styles.indicatorContainer
              }
            >
              {product?.imageUrls?.map(
                (
                  _: any,
                  index: number
                ) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      activeImage ===
                      index &&
                      styles.activeIndicator,
                    ]}
                  />
                )
              )}
            </View>

            {/* CONTENT */}
            <View
              style={
                styles.contentContainer
              }
            >
              {/* TITLE */}
              <SansText
                style={
                  styles.productName
                }
              >
                {product?.name}
              </SansText>

              <SansText
                style={
                  styles.productDescription
                }
              >
                {
                  product?.description
                }
              </SansText>

              {/* PRICE */}
              <View
                style={
                  styles.priceRow
                }
              >
                <View>
                  <View
                    style={
                      styles.priceContainer
                    }
                  >
                    <SatoshiText
                      style={
                        styles.price
                      }
                    >
                      ₹
                      {
                        product?.discountedPrice
                      }
                      /-
                    </SatoshiText>

                    <SansText
                      style={
                        styles.oldPrice
                      }
                    >
                      ₹
                      {
                        product?.basePrice
                      }
                    </SansText>
                  </View>

                  <SansText
                    style={
                      styles.taxText
                    }
                  >
                    Incl. of all
                    taxes
                  </SansText>
                </View>

                <View
                  style={
                    styles.ratingContainer
                  }
                >
                  <StarIcon
                    height={24}
                    width={24}
                    color="#D4A017"
                  />

                  <SansText
                    style={
                      styles.ratingText
                    }
                  >
                    {
                      product?.rating
                    }
                  </SansText>
                </View>
              </View>

              {/* WHY THIS WORKS */}
              <SansText
                style={
                  styles.smallDesc
                }
              >
                {
                  product?.whyThisWork
                }
              </SansText>

              <View
                style={{
                  backgroundColor:
                    "#E6D18B",
                  height: 1,
                  marginVertical: 24,
                }}
              />

              {/* WHO SHOULD USE */}
              <View>
                <Pressable
                  style={
                    styles.sectionHeader
                  }
                  onPress={() =>
                    setWhoExpanded(
                      !whoExpanded
                    )
                  }
                >
                  <SatoshiText
                    style={
                      styles.sectionTitle
                    }
                  >
                    Who Should
                    Use This?
                  </SatoshiText>

                  <Ionicons
                    name={
                      whoExpanded
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={18}
                    color="#111"
                  />
                </Pressable>

                {whoExpanded && (
                  <View
                    style={
                      styles.bulletContainer
                    }
                  >
                    {product?.targetAudience
                      ?.split(",")
                      ?.map(
                        (
                          item: string,
                          index: number
                        ) => (
                          <View
                            key={
                              index
                            }
                            style={
                              styles.bulletRow
                            }
                          >
                            <View
                              style={
                                styles.dot
                              }
                            />

                            <SansText
                              style={
                                styles.bulletText
                              }
                            >
                              {item.trim()}
                            </SansText>
                          </View>
                        )
                      )}
                  </View>
                )}
              </View>

              <View
                style={{
                  backgroundColor:
                    "#E6D18B",
                  height: 1,
                  marginVertical: 24,
                }}
              />

              {/* HOW TO USE */}
              <View>
                <Pressable
                  style={
                    styles.sectionHeader
                  }
                  onPress={() =>
                    setHowExpanded(
                      !howExpanded
                    )
                  }
                >
                  <SatoshiText
                    style={
                      styles.sectionTitle
                    }
                  >
                    How To Use
                  </SatoshiText>

                  <Ionicons
                    name={
                      howExpanded
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={18}
                    color="#111"
                  />
                </Pressable>

                {howExpanded && (
                  <View
                    style={
                      styles.bulletContainer
                    }
                  >
                    {product?.howToUse
                      ?.split(",")
                      ?.map(
                        (
                          item: string,
                          index: number
                        ) => (
                          <View
                            key={
                              index
                            }
                            style={
                              styles.bulletRow
                            }
                          >
                            <View
                              style={
                                styles.dot
                              }
                            />

                            <SansText
                              style={
                                styles.bulletText
                              }
                            >
                              {item.trim()}
                            </SansText>
                          </View>
                        )
                      )}
                  </View>
                )}
              </View>

              <View
                style={{
                  backgroundColor:
                    "#E6D18B",
                  height: 1,
                  marginVertical: 24,
                }}
              />

              {/* FEATURES */}
              <View
                style={
                  styles.featureRow
                }
              >
                {[
                  {
                    icon:
                      "ValidationIcon",
                    title:
                      "Certified\nMaterial",
                  },
                  {
                    icon:
                      "MedalFirstIcon",
                    title:
                      "Quality\nChecked",
                  },
                  {
                    icon:
                      "FileVerifiedIcon",
                    title:
                      "25 Days\nReturn",
                  },
                ].map(
                  (
                    item,
                    index
                  ) => {
                    const IconComponent =
                      ICONS[
                      item.icon as IconName
                      ];

                    return (
                      <View
                        key={
                          index
                        }
                        style={
                          styles.featureCard
                        }
                      >
                        <View
                          style={
                            styles.iconWrapper
                          }
                        >
                          <IconComponent
                            width={
                              22
                            }
                            height={
                              22
                            }
                          />
                        </View>

                        <SansText
                          style={
                            styles.featureTitle
                          }
                        >
                          {
                            item.title
                          }
                        </SansText>
                      </View>
                    );
                  }
                )}
              </View>

              {/* REVIEWS */}
              {product?.reviews.length > 0 && <View
                style={
                  styles.reviewSection
                }
              >
                <ContentSection
                  title="Reviews & Ratings"
                  titleFontSize={
                    24
                  }
                />

                {product?.reviews
                  ?.slice(0, 2)
                  .map(
                    (
                      review: any,
                      index: number,
                      arr: any[]
                    ) => {
                      const isLast =
                        index ===
                        arr.length -
                        1;

                      return (
                        <View
                          key={
                            index
                          }
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
                              review.review
                            }
                            rating={
                              review.rating
                            }
                            reviewerName="Verified Customer"
                            images={
                              review.images
                            }
                          />
                        </View>
                      );
                    }
                  )}

                {product?.reviews.length > 2 && <ReusableButton
                  title="View All Reviews"
                  variant="outline"
                  onPress={() => {
                    router.push({
                      pathname:
                        "/(tabs)/remedies/(ecommerce)/product-reviews",
                      params: {
                        id: product?._id,
                      },
                    });
                  }}
                  style={{
                    marginTop: 20,
                    height: 48,
                    borderRadius: 999,
                  }}
                />}
              </View>
              }
              {/* RELATED */}
              <View
                style={
                  styles.reviewSection
                }
              >
                <ContentSection
                  title="Pairs Well With"
                  titleFontSize={
                    24
                  }
                >
                  <SansText>
                    Enhance your
                    practice with
                    complementary
                    remedies.
                  </SansText>
                </ContentSection>

                <FlatList
                  scrollEnabled={
                    false
                  }
                  data={
                    relatedProducts
                  }
                  numColumns={2}
                  keyExtractor={(
                    item
                  ) => item._id}
                  columnWrapperStyle={{
                    justifyContent:
                      "space-between",
                  }}
                  contentContainerStyle={{
                    paddingTop: 24,
                    paddingBottom: 40,
                    rowGap: 12,
                  }}
                  renderItem={({
                    item,
                  }) => (
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
                          .imageUrls?.[0]
                      }
                      rating={
                        item.rating
                      }
                      onPress={() => {
                        router.push({
                          pathname:
                            "/(tabs)/remedies/(ecommerce)/product-details",
                          params: {
                            id: item._id,
                          },
                        });
                      }}
                    />
                  )}
                />
              </View>
            </View>
          </ScrollView>

          {/* BUTTONS */}
          <View
            style={
              styles.buttonRow
            }
          >
            {quantity === 0 ? (
              <>
                <ReusableButton
                  title="Add To Cart"
                  variant="outline"
                  onPress={() =>
                    dispatch(
                      addToCart({
                        id: product?._id,
                        name: product?.name,
                        price:
                          product?.discountedPrice,
                        image:
                          product
                            ?.imageUrls?.[0],
                        quantity: 1,
                      })
                    )
                  }
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 999,
                  }}
                  iconName="AddIcon"
                  iconPosition="left"
                />

                <ReusableButton
                  title="Buy Now"
                  variant="solid"
                  onPress={() => {
                    dispatch(
                      setCheckoutItems(
                        [
                          {
                            id: product?._id,
                            name: product?.name,
                            image:
                              product
                                ?.imageUrls?.[0],
                            price:
                              product?.discountedPrice,
                            quantity: 1,
                          },
                        ]
                      )
                    );

                    router.push(
                      "/(tabs)/remedies/(ecommerce)/checkout"
                    );
                  }}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 999,
                    backgroundColor:
                      "#D4AF37",
                  }}
                />
              </>
            ) : (
              <>
                <View
                  style={
                    styles.qtyContainer
                  }
                >
                  <ReusableButton
                    iconName="RemoveIcon"
                    variant="outline"
                    onPress={() => {
                      if (
                        quantity >
                        1
                      ) {
                        dispatch(
                          decreaseQty(
                            product?._id
                          )
                        );
                      } else {
                        dispatch(
                          removeFromCart(
                            product?._id
                          )
                        );
                      }
                    }}
                    style={
                      styles.qtyBtn
                    }
                  />

                  <SansText
                    style={
                      styles.qtyCount
                    }
                  >
                    {quantity}
                  </SansText>

                  <ReusableButton
                    iconName="AddIcon"
                    variant="outline"
                    onPress={() =>
                      dispatch(
                        increaseQty(
                          product?._id
                        )
                      )
                    }
                    style={
                      styles.qtyBtn
                    }
                  />
                </View>

                <ReusableButton
                  title="Buy Now"
                  variant="solid"
                  onPress={() => {
                    dispatch(
                      setCheckoutItems(
                        [
                          {
                            id: product?._id,
                            name: product?.name,
                            image:
                              product
                                ?.imageUrls?.[0],
                            price:
                              product?.discountedPrice,
                            quantity: 1,
                          },
                        ]
                      )
                    );

                    router.push(
                      "/(tabs)/remedies/(ecommerce)/checkout"
                    );
                  }}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 999,
                    backgroundColor:
                      "#D4AF37",
                  }}
                />
              </>
            )}
          </View>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default ProductDetails;

const styles =
  StyleSheet.create({
    imageContainer: {
      paddingHorizontal: 16,
      marginTop: 16,
    },

    productImage: {
      width:
        Dimensions.get(
          "window"
        ).width - 32,
      height: 380,
      borderRadius: 12,
    },

    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 18,
    },

    productName: {
      fontSize: 24,
      fontFamily:
        "SatoshiBold",
      color: "#0D0D0D",
    },

    productDescription: {
      marginTop: 4,
      fontSize: 14,
      lineHeight: 20,
      color: "#0D0D0D",
    },

    priceRow: {
      marginTop: 18,
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    priceContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    price: {
      fontSize: 24,
      color: "#0D0D0D",
      fontFamily:
        "SatoshiBold",
    },

    oldPrice: {
      textDecorationLine:
        "line-through",
      color: "#777",
      fontSize: 14,
    },

    taxText: {
      marginTop: 2,
      fontSize: 14,
      color: "#0D0D0D",
    },

    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor:
        "#F5F5F5",
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 12,
    },

    ratingText: {
      fontFamily:
        "SatoshiBold",
      color: "#0D0D0D",
      fontSize: 18,
    },

    buttonRow: {
      backgroundColor:
        "#FBF7EB",
      flexDirection: "row",
      gap: 12,
      position: "absolute",
      bottom: 0,
      padding: 16,
    },

    smallDesc: {
      marginTop: 18,
      fontSize: 18,
      lineHeight: 26,
      color: "#0D0D0D",
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    sectionTitle: {
      fontSize: 24,
      fontFamily:
        "SatoshiBold",
      color: "#0D0D0D",
    },

    bulletContainer: {
      marginTop: 12,
    },

    bulletRow: {
      flexDirection: "row",
      alignItems:
        "flex-start",
      marginBottom: 8,
    },

    dot: {
      width: 7,
      height: 7,
      borderRadius: 999,
      backgroundColor: "#111",
      marginTop: 8,
      marginRight: 10,
    },

    bulletText: {
      flex: 1,
      fontSize: 18,
      lineHeight: 26,
      color: "#0D0D0D",
    },

    reviewSection: {
      marginTop: 34,
    },

    featureRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      borderWidth: 1,
      borderColor:
        "#D4AF37",
      borderRadius: 20,
      paddingVertical: 22,
      backgroundColor:
        "#FBF7EB",
    },

    featureCard: {
      flex: 1,
      alignItems: "center",
    },

    iconWrapper: {
      height: 32,
      justifyContent:
        "center",
      alignItems: "center",
    },

    featureTitle: {
      marginTop: 10,
      textAlign: "center",
      fontSize: 15,
      lineHeight: 24,
      color: "#0D0D0D",
      fontFamily:
        "SatoshiMedium",
    },

    qtyContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      gap: 16,
      borderRadius: 999,
      height: 52,
      backgroundColor:
        "#FBF7EB",
    },

    qtyBtn: {
      width: 42,
      height: 42,
      borderRadius: 999,
    },

    qtyCount: {
      fontSize: 20,
      fontFamily:
        "SatoshiBold",
      color: "#0D0D0D",
    },
    indicatorContainer: {
  marginTop: 12,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  gap: 8,
},

    indicator: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor:
        "#E6D18B",
    },

    activeIndicator: {
      width: 12,
      height: 12,
      backgroundColor:
        "#D4AF37",
    },
  });