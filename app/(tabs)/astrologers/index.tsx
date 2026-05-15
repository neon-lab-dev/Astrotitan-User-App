import CancelIcon from "@/assets/icons/actions/cancel.svg";
import StarIcon from "@/assets/icons/visual/star.svg";

import AuthTitle from "@/components/auth/AuthTitle";

import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

import AppHeader from "@/components/reusable/AppHeader/AppHeader";

import FilterSection from "@/components/reusable/BottomSheet/FilterSection";
import SortBySection from "@/components/reusable/BottomSheet/SortBy";

import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";

import {
  useGetAstrologersQuery,
} from "@/redux/features/astrologer/astrologerApi";

import BottomSheetService from "@/redux/features/ui/GlobalSheet/BottomSheetService";

import { router } from "expo-router";

import React, {
  useEffect,
  useState,
} from "react";

import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

type Filters = {
  specialization: string[];

  language: string[];

  ratings: string[];
};

const LIMIT = 10;

const Astrologer = () => {
  const [skip, setSkip] =
    useState(0);

  const [refreshing, setRefreshing] =
    useState(false);

  const [sortValue, setSortValue] =
    useState("relevance");

  const [filters, setFilters] =
    useState<Filters>({
      specialization: [],

      language: [],

      ratings: [],
    });

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } =
    useGetAstrologersQuery({
      isIdentityVerified: true,

      country: "India",

      skip,

      limit: LIMIT,

      areaOfPractice:
        filters.specialization.join(
          ","
        ),

      consultLanguages:
        filters.language.join(","),

      sortBy: sortValue,
    });

  const astrologers =
    data?.data?.astrologers ||
    [];

  const meta =
    data?.data?.meta;

  const hasMore =
    meta?.hasMore;

  const onRefresh =
    async () => {
      try {
        setRefreshing(true);

        setSkip(0);

        await refetch();
      } finally {
        setRefreshing(false);
      }
    };

  const onEndReached =
    () => {
      if (
        hasMore &&
        !isFetching
      ) {
        setSkip(
          (prev) =>
            prev + LIMIT
        );
      }
    };

  const removeTag = (
    tag: string
  ) => {
    if (tag === sortValue) {
      setSortValue(
        "relevance"
      );

      return;
    }

    setFilters((prev) => ({
      specialization:
        prev.specialization.filter(
          (item) =>
            item !== tag
        ),

      language:
        prev.language.filter(
          (item) =>
            item !== tag
        ),

      ratings:
        prev.ratings.filter(
          (item) =>
            item !== tag
        ),
    }));

    setSkip(0);
  };

  const allSelectedTags =
    [
      ...filters.specialization,

      ...filters.language,

      ...filters.ratings,
    ];

  const displayTags =
    sortValue !==
    "relevance"
      ? [
          sortValue,

          ...allSelectedTags,
        ]
      : allSelectedTags;

  useEffect(() => {
    setSkip(0);
  }, [filters, sortValue]);

  const onSortBy = () => {
    BottomSheetService.open(
      <SortBySection
        onApply={(val) => {
          setSortValue(val);

          setSkip(0);

          BottomSheetService.close();
        }}
      />,
      {
        height: 320,

        hasGradient: true,
      }
    );
  };

  const onFilter = () => {
    BottomSheetService.open(
      <FilterSection
        value={filters}
        onChange={setFilters}
        onApply={(
          finalFilters
        ) => {
          setFilters(
            finalFilters
          );

          setSkip(0);

          BottomSheetService.close();
        }}
        onClear={() => {
          setFilters({
            specialization: [],

            language: [],

            ratings: [],
          });

          setSkip(0);
        }}
      />,
      {
        height: 650,

        hasGradient: true,
      }
    );
  };

  return (
    <AnimatedScreen>
    <ScreenWrapper>
      <AppHeader
        showBack={false}
      >
        <AuthTitle title="Astrologers">
          <SansText
            style={{
              fontSize: 16,
            }}
          >
            Experts available
            to guide you right
            now.
          </SansText>
        </AuthTitle>
      </AppHeader>

      <FlatList
        data={astrologers}
        keyExtractor={(item) =>
          item._id
        }
        showsVerticalScrollIndicator={
          false
        }
       refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                onRefresh
              }
              tintColor="#816B22"
              colors={[
                "#816B22",
              ]}
              progressBackgroundColor="#FBF7EB"
            />
          }
        onEndReached={
          onEndReached
        }
        onEndReachedThreshold={
          0.4
        }
        ListHeaderComponent={
          <View
            style={
              styles.container
            }
          >
            {/* FILTERS */}

            <View
              style={{
                flexDirection:
                  "row",

                gap: 12,

                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <ReusableButton
                  title="Filter"
                  onPress={
                    onFilter
                  }
                  variant="solid"
                  width="100%"
                  iconName="FilterIcon"
                  iconPosition="left"
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <ReusableButton
                  title="Sort By"
                  onPress={
                    onSortBy
                  }
                  variant="ghost"
                  width="100%"
                  iconName="DashboardCircleIcon"
                  iconPosition="left"
                />
              </View>
            </View>

            {/* TAGS */}

            <View
              style={
                styles.tagsRow
              }
            >
              {displayTags.map(
                (tag) => (
                  <View
                    key={tag}
                    style={
                      styles.tag
                    }
                  >
                    <SansText>
                      {tag}
                    </SansText>

                    <CancelIcon
                      width={
                        14
                      }
                      height={
                        14
                      }
                      onPress={() =>
                        removeTag(
                          tag
                        )
                      }
                    />
                  </View>
                )
              )}
            </View>

            {/* COUNT */}

            <View
              style={
                styles.countRow
              }
            >
              <View
                style={
                  styles.dot
                }
              />

              <SansText>
                {
                  meta?.filteredTotal
                }{" "}
                astrologers
                available
              </SansText>
            </View>
          </View>
        }
        renderItem={({
          item,
        }) => (
          <AstrologerCard
            item={item}
          />
        )}
        contentContainerStyle={{
          padding: 16,

          gap: 16,

          paddingBottom: 40,
        }}
        ListEmptyComponent={
          isLoading || isFetching ? (
            <View
              style={{
                gap: 16,
              }}
            >
              {[1, 2, 3].map(
                (
                  item
                ) => (
                  <SkeletonLoader
                    key={
                      item
                    }
                    width="100%"
                    height={
                      180
                    }
                    borderRadius={
                      16
                    }
                    array={[
                      1,
                    ]}
                  />
                )
              )}
            </View>
          ) : (
            <View
              style={{
                alignItems:
                  "center",

                marginTop: 80,
              }}
            >
              <SansText>
                No astrologers
                found
              </SansText>
            </View>
          )
        }
        // ske;letn loder is not visible
        ListFooterComponent={
         isLoading || isFetching &&
          skip !== 0 ? (
            <View
              style={{
                marginTop: 20,
              }}
            >
              <SkeletonLoader
                width="100%"
                height={180}
                borderRadius={
                  16
                }
                array={[1]}
              />
            </View>
          ) : null
        }
      />
    </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default Astrologer;

const AstrologerCard = ({
  item,
}: any) => {
  return (
    <AnimatedScreen>
      <View style={styles.card}>
        <View
          style={
            styles.cardTop
          }
        >
          <Image
            source={{
              uri: item.profilePicture,
            }}
            style={
              styles.avatar
            }
          />

          <View
            style={{
              flex: 1, 
            }}
          >
            <SatoshiText
              style={
                styles.name
              }
            >
              {
                item.displayName
              }
            </SatoshiText>

            <SansText
              style={
                styles.sub
              }
            >
              {item.areaOfPractice.slice(0,2)?.join(
                " • "
              )}
            </SansText>

            <View
              style={{
                flexDirection:
                  "row",

                gap: 4,

                alignItems:
                  "center",
              }}
            >
              <StarIcon
                height={
                  20
                }
                width={
                  20
                }
              />

              <SatoshiText
                style={
                  styles.rating
                }
              >
                {
                  item.rating
                }
              </SatoshiText>

              <SansText
                style={{
                  color:
                    "#757575",
                }}
              >
                (
                {item
                  ?.reviews
                  ?.length || 0}{" "}
                Reviews)
              </SansText>
            </View>

            <SansText
              style={
                styles.desc
              }
            >
              {item.bio.slice(
                          0,
                          30
                        ) + "..."}
            </SansText>

            {/* <SansText
              style={{
                marginTop: 4,

                color:
                  "#816B22",
              }}
            >
              {
                item.experience
              }
            </SansText> */}
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
    container: {},

    tagsRow: {
      flexDirection:
        "row",

      gap: 8,

      flexWrap: "wrap",

      marginBottom: 12,
    },

    tag: {
      backgroundColor:
        "#F5F5F5",

      paddingHorizontal: 20,

      paddingVertical: 12,

      borderRadius: 48,

      flexDirection: "row",

      alignItems: "center",

      gap: 6,
    },

    countRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 8,

      marginBottom: 24,
    },

    dot: {
      width: 8,

      height: 8,

      borderRadius: 100,

      backgroundColor:
        "green",
    },

    card: {
      backgroundColor:
        "#FBF7EB",

      borderRadius: 12,

      padding: 16,

      borderWidth: 1,

      borderColor:
        "#D4AF37",
    },

    cardTop: {
      flexDirection:
        "row",

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

      fontFamily:
        "SatoshiBold",

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