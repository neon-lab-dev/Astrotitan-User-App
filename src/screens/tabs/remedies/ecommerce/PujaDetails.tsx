import StarIcon from "@/assets/icons/visual/star.svg";
import { useRoute } from "@react-navigation/native";

import React, {
  useState,
} from "react";

import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useGetAllPujasQuery, useGetSinglePujaByIdQuery } from "../../../../redux/features/puja/pujaApi";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import SkeletonLoader from "../../../../components/reusable/SkeletonLoader/SkeletonLoade";
import RemedyCardSkeleton from "../../../../components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCardSkeleton";
import { SansText } from "../../../../components/reusable/Text/SansText";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";
import Ionicons from "@react-native-vector-icons/ionicons";
import { IconName, ICONS } from "../../../../assets/svg";
import ContentSection from "../../../../components/reusable/ContentSectoin/ContentSection";
import ReviewCard from "../../../../components/tabs/ecommerce/ecommerce/ReviewCard/ReviewCard";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RemedyCard from "../../../../components/tabs/ecommerce/ecommerce/RemedyCard/RemedyCard";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

const PujaDetails = () => {

  const route = useRoute<any>();

  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const id = Array.isArray(route.params?.id)
    ? route.params.id[0]
    : route.params?.id;

  const [
    whoExpanded,
    setWhoExpanded,
  ] = useState(true);

  const [
    howExpanded,
    setHowExpanded,
  ] = useState(true);

  const [
    activeImage,
    setActiveImage,
  ] = useState(0);

  const {
    data: pujaResponse,
    isLoading,
    refetch,
    isError,
  } =
    useGetSinglePujaByIdQuery(
      id
    );

  const puja =
    pujaResponse?.data;

  const {
    data: relatedPujasResponse,
  } = useGetAllPujasQuery({
    category:
      puja?.category,
    limit: 4,
  });


  const onRefresh =
    async () => {
      try {
        setRefreshing(true);

        await refetch();
      } finally {
        setRefreshing(false);
      }
    };

  const relatedPujas =
    relatedPujasResponse?.data
      ?.pujas?.filter(
        (item: any) =>
          item._id !==
          puja?._id
      ) || [];

  if (isLoading) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
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
              {/* IMAGE */}

              <View
                style={
                  styles.skeletonImageContainer
                }
              >
                <SkeletonLoader
                  width={
                    Dimensions.get(
                      "window"
                    ).width - 32
                  }
                  height={380}
                  borderRadius={12}
                  array={[1]}
                />
              </View>

              {/* INDICATORS */}

              <View
                style={
                  styles.indicatorContainer
                }
              >
                {[1, 2, 3].map(
                  (item) => (
                    <SkeletonLoader
                      key={item}
                      width={10}
                      height={10}
                      borderRadius={
                        999
                      }
                      array={[1]}
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

                <SkeletonLoader
                  width="72%"
                  height={28}
                  borderRadius={8}
                  array={[1]}
                />

                {/* DESCRIPTION */}

                <View
                  style={{
                    marginTop: 12,
                    gap: 10,
                  }}
                >
                  <SkeletonLoader
                    width="100%"
                    height={14}
                    borderRadius={
                      6
                    }
                    array={[1]}
                  />

                  <SkeletonLoader
                    width="92%"
                    height={14}
                    borderRadius={
                      6
                    }
                    array={[1]}
                  />

                  <SkeletonLoader
                    width="74%"
                    height={14}
                    borderRadius={
                      6
                    }
                    array={[1]}
                  />
                </View>

                {/* PRICE */}

                <View
                  style={
                    styles.priceRow
                  }
                >
                  <View
                    style={{
                      gap: 10,
                    }}
                  >
                    <SkeletonLoader
                      width={120}
                      height={28}
                      borderRadius={
                        8
                      }
                      array={[1]}
                    />

                    <SkeletonLoader
                      width={160}
                      height={14}
                      borderRadius={
                        6
                      }
                      array={[1]}
                    />
                  </View>

                  <SkeletonLoader
                    width={70}
                    height={40}
                    borderRadius={
                      12
                    }
                    array={[1]}
                  />
                </View>

                {/* BIG DESCRIPTION */}

                <View
                  style={{
                    marginTop: 18,
                    gap: 10,
                  }}
                >
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <SkeletonLoader
                        key={item}
                        width={
                          item === 4
                            ? "68%"
                            : "100%"
                        }
                        height={16}
                        borderRadius={
                          6
                        }
                        array={[1]}
                      />
                    )
                  )}
                </View>

                {/* DIVIDER */}

                <View
                  style={{
                    backgroundColor:
                      "#E6D18B",
                    height: 1,
                    marginVertical: 24,
                  }}
                />

                {/* WHO SECTION */}

                <SkeletonLoader
                  width="58%"
                  height={24}
                  borderRadius={8}
                  array={[1]}
                />

                <View
                  style={{
                    marginTop: 18,
                    gap: 14,
                  }}
                >
                  {[1, 2, 3].map(
                    (item) => (
                      <View
                        key={item}
                        style={{
                          flexDirection:
                            "row",
                          gap: 10,
                        }}
                      >
                        <SkeletonLoader
                          width={8}
                          height={8}
                          borderRadius={
                            999
                          }
                          array={[1]}
                        />

                        <SkeletonLoader
                          width="88%"
                          height={14}
                          borderRadius={
                            6
                          }
                          array={[1]}
                        />
                      </View>
                    )
                  )}
                </View>

                {/* DIVIDER */}

                <View
                  style={{
                    backgroundColor:
                      "#E6D18B",
                    height: 1,
                    marginVertical: 24,
                  }}
                />

                {/* HOW SECTION */}

                <SkeletonLoader
                  width="64%"
                  height={24}
                  borderRadius={8}
                  array={[1]}
                />

                <View
                  style={{
                    marginTop: 18,
                    gap: 10,
                  }}
                >
                  {[1, 2, 3].map(
                    (item) => (
                      <SkeletonLoader
                        key={item}
                        width={
                          item === 3
                            ? "74%"
                            : "100%"
                        }
                        height={14}
                        borderRadius={
                          6
                        }
                        array={[1]}
                      />
                    )
                  )}
                </View>

                {/* DIVIDER */}

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
                  {[1, 2, 3].map(
                    (item) => (
                      <View
                        key={item}
                        style={
                          styles.featureCard
                        }
                      >
                        <SkeletonLoader
                          width={36}
                          height={36}
                          borderRadius={
                            999
                          }
                          array={[1]}
                        />

                        <View
                          style={{
                            marginTop: 12,
                            gap: 8,
                            alignItems:
                              "center",
                          }}
                        >
                          <SkeletonLoader
                            width={70}
                            height={12}
                            borderRadius={
                              6
                            }
                            array={[1]}
                          />

                          <SkeletonLoader
                            width={54}
                            height={12}
                            borderRadius={
                              6
                            }
                            array={[1]}
                          />
                        </View>
                      </View>
                    )
                  )}
                </View>

                {/* RELATED */}

                <View
                  style={
                    styles.reviewSection
                  }
                >
                  <SkeletonLoader
                    width="42%"
                    height={26}
                    borderRadius={8}
                    array={[1]}
                  />

                  <View
                    style={{
                      marginTop: 12,
                      gap: 8,
                    }}
                  >
                    <SkeletonLoader
                      width="100%"
                      height={14}
                      borderRadius={
                        6
                      }
                      array={[1]}
                    />

                    <SkeletonLoader
                      width="72%"
                      height={14}
                      borderRadius={
                        6
                      }
                      array={[1]}
                    />
                  </View>

                  <View
                    style={{
                      marginTop: 24,
                      flexDirection:
                        "row",
                      flexWrap:
                        "wrap",
                      justifyContent:
                        "space-between",
                      rowGap: 16,
                    }}
                  >
                    {[1, 2].map(
                      (item) => (
                        <RemedyCardSkeleton
                          key={item}
                        />
                      )
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* BUTTON */}

            <View
              style={
                styles.buttonRow
              }
            >
              <SkeletonLoader
                width="100%"
                height={52}
                borderRadius={999}
                array={[1]}
              />
            </View>
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  if (isError || !puja) {
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
          Puja not found
        </SansText>
      </View>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader
        >
          <AuthTitle title="Puja details" />
        </AppHeader>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#816B22"
              colors={["#816B22",]}
              progressBackgroundColor="#FBF7EB"
            />
          }
          contentContainerStyle={{
            paddingBottom: 120,
          }}
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
                horizontal
                pagingEnabled
                snapToAlignment="center"
                decelerationRate="fast"
                data={
                  puja?.imageUrls ||
                  []
                }
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
                    source={{ uri: item }}
                    style={
                      styles.productImage
                    }
                  />
                )}
              />
            </View>

            {/* INDICATORS */}
            <View
              style={
                styles.indicatorContainer
              }
            >
              {puja?.imageUrls?.map(
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
                {puja?.name}
              </SansText>

              <SansText
                style={
                  styles.productDescription
                }
              >
                {
                  puja?.description
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
                        puja?.discountedPrice
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
                        puja?.basePrice
                      }
                    </SansText>
                  </View>

                  <SansText
                    style={
                      styles.taxText
                    }
                  >
                    Complete puja
                    arrangement
                    included
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
                      puja?.rating
                    }
                  </SansText>
                </View>
              </View>

              {/* DESCRIPTION */}
              <SansText
                style={
                  styles.smallDesc
                }
              >
                {
                  puja?.description
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

              {/* WHO SHOULD PERFORM */}
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
                    Perform This
                    Puja?
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
                    {puja?.targetAudience
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

              {/* HOW PUJA IS PERFORMED */}
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
                    How This Puja
                    Is Performed
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
                    <SansText
                      style={
                        styles.bulletText
                      }
                    >
                      {
                        puja?.howThisPujaPerformed
                      }
                    </SansText>
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
                      "Vedic\nProcedure",
                  },
                  {
                    icon:
                      "MedalFirstIcon",
                    title:
                      "Expert\nPandits",
                  },
                  {
                    icon:
                      "FileVerifiedIcon",
                    title:
                      "Sacred\nRituals",
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
              {puja?.reviews
                ?.length > 0 && (
                  <View
                    style={
                      styles.reviewSection
                    }
                  >
                    <ContentSection
                      title="Reviews & Ratings"
                      titleFontSize={
                        16
                      }
                    />

                    {puja?.reviews
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
                                reviewerName="Verified Devotee"
                                images={
                                  review.images
                                }
                              />
                            </View>
                          );
                        }
                      )}

                    {puja?.reviews
                      ?.length >
                      2 && (
                        <ReusableButton
                          title="View All Reviews"
                          variant="outline"
                          onPress={() => {
                            navigation.navigate(


                              "ProductReview",

                              {
                                id: puja?._id,
                              },

                            );
                          }}
                          style={{
                            marginTop: 20,
                            height: 48,
                            borderRadius: 999,
                          }}
                        />
                      )}
                  </View>
                )}

              {/* RELATED PUJAS */}
              <View
                style={
                  styles.reviewSection
                }
              >
                <ContentSection
                  title="Related Poojas"
                  titleFontSize={
                    16
                  }
                >
                  <SansText>
                    Explore similar
                    spiritual rituals
                    aligned with
                    your intentions.
                  </SansText>
                </ContentSection>

                <FlatList
                  scrollEnabled={
                    false
                  }
                  data={
                    relatedPujas
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
                        navigation.navigate(

                          "PujaDetails",

                          {
                            id: item._id,
                          },

                        );
                      }}
                    />
                  )}
                />
              </View>
            </View>
          </ScrollView>

          {/* BOOK BUTTON */}
          <View
            style={
              styles.buttonRow
            }
          >
            <ReusableButton
              title="Consult Now"
              variant="solid"
              onPress={() => {
                navigation.navigate(
                  "ConsultationForm",
                  {
                    id: puja?._id,
                  },
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
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default PujaDetails;

const styles =
  StyleSheet.create({
    imageContainer: {
      paddingHorizontal: 16,
      marginTop: 16,
    },
    skeletonImageContainer: {
      width:
        Dimensions.get(
          "window"
        ).width - 32,
      marginTop: 16,
      borderWidth: 1,
      borderColor: "#D4AF37",
      backgroundColor: "#FBF7EB",
      borderRadius: 12,
      marginHorizontal: "auto",
      overflow: "hidden"
    },

    productImage: {
      width:
        Dimensions.get(
          "window"
        ).width - 32,
      height: 380,
      borderRadius: 12,
    },

    indicatorContainer: {
      marginTop: 12,
      flexDirection: "row",
      justifyContent:
        "center",
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

    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 18,
    },

    productName: {
      fontSize: 21,
      fontFamily:
        "Satoshi-Bold",
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
      fontSize: 21,
      color: "#0D0D0D",
      fontFamily:
        "Satoshi-Bold",
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
        "Satoshi-Bold",
      color: "#0D0D0D",
      fontSize: 16,
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
      fontSize: 16,
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
      fontSize: 16,
      fontFamily:
        "Satoshi-Bold",
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
      fontSize: 14,
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
        "Satoshi-Medium",
    },
  });