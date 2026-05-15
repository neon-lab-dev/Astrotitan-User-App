import CrownIcon from "@/assets/icons/navigation/crown.svg";
import NotificationIcon from "@/assets/icons/navigation/notifications.svg";

import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

import ContentSection from "@/components/reusable/ContentSectoin/ContentSection";
import IconButton from "@/components/reusable/IconButton/IconButton";
import SectionTitle from "@/components/reusable/SectionTitle/SectionTitle";
import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";

import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";

import ExpertCard from "@/components/tabs/home/home/ExpertCard";
import FeatureCard from "@/components/tabs/home/home/FeatureCard/FeatureCard";
import GemCard from "@/components/tabs/home/home/GemCard/GemCard";

import { GEMS } from "@/data/dummy/gems";

import {
  useGetAstrologersQuery,
} from "@/redux/features/astrologer/astrologerApi";

import {
  useGetBlogsQuery,
} from "@/redux/features/blog/blogApi";

import { RootState } from "@/redux/store";

import { getTimeBasedGreeting } from "@/utils/greetings";

import { router } from "expo-router";

import React, {
  useCallback,
  useState,
} from "react";

import {
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { useSelector } from "react-redux";

const HomeScreen = () => {
  /* ---------------- USER ---------------- */

  const user = useSelector(
    (state: RootState) =>
      state.auth.user
  );
  console.log(user)

  /* ---------------- REFRESH ---------------- */

  const [refreshing, setRefreshing] =
    useState(false);

  /* ---------------- ASTROLOGERS API ---------------- */

  const {
    data: astrologersResponse,

    isLoading:
    astrologersLoading,
    refetch:
    refetchAstrologers,
    isFetching: astrologerFetching
  } =
    useGetAstrologersQuery(
      {
        isIdentityVerified: true,

        country: "India",

        gender: "",

        skip: 0,

        limit: 10,

        areaOfPractice: "",

        consultLanguages:
          "",
      },
      {
        refetchOnFocus: true,

        refetchOnReconnect: true,
      }
    );

  /* ---------------- BLOGS API ---------------- */

  const {
    data: blogsResponse,

    isLoading: blogsLoading,

    refetch: refetchBlogs,
    isFetching: blogFetching
  } = useGetBlogsQuery(
    {
      skip: 0,

      limit: 5,
    },
    {
      refetchOnFocus: true,

      refetchOnReconnect: true,
    }
  );

  /* ---------------- DATA ---------------- */

  const astrologers =
    astrologersResponse
      ?.data?.astrologers || [];

  const blogs =
    blogsResponse?.data
      ?.data || [];

  /* ---------------- REFRESH ---------------- */

  const onRefresh =
    useCallback(async () => {
      if (refreshing) return;

      try {
        setRefreshing(true);

        await Promise.all([
          refetchAstrologers().unwrap(),

          refetchBlogs().unwrap(),
        ]);
      } catch (error) {
        console.log(
          "REFRESH ERROR:",
          error
        );
      } finally {
        setRefreshing(false);
      }
    }, [
      refreshing,
      refetchAstrologers,
      refetchBlogs,
    ]);

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <ScrollView
          style={{ flex: 1 }}
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
        >
          {/* HEADER */}

          <View
            style={{
              flexDirection: "row",

              alignItems:
                "flex-end",
            }}
          >
            {/* LEFT */}

            <View
              style={{
                flex: 1,

                gap: 8,

                paddingHorizontal: 16,
              }}
            >
              <SansText
                style={{
                  fontSize: 18,

                  color:
                    "#4A4A4A",

                  lineHeight: 26,
                }}
              >
                {
                  getTimeBasedGreeting()
                }
                ,
              </SansText>

              <SatoshiText
                style={{
                  fontSize: 18,

                  color:
                    "#0D0D0D",

                  fontFamily:
                    "SatoshiBold",

                  lineHeight: 26,
                }}
              >
                {
                  user?.profile
                    ?.firstName
                }{" "}
                {
                  user?.profile
                    ?.lastName
                }
              </SatoshiText>
            </View>

            {/* RIGHT */}

            <View
              style={{
                flexDirection:
                  "row",

                gap: 18,

                padding: 16,
              }}
            >
              <IconButton
                Icon={
                  NotificationIcon
                }
                iconColor="#0D0D0D"
                onPress={() => {
                  router.push(
                    "/notification/notification"
                  );
                }}
              />

              <IconButton
                Icon={CrownIcon}
                iconColor="#0D0D0D"
                onPress={() => {
                  router.push(
                    "/subscription/subscription"
                  );
                }}
              />
            </View>
          </View>

          {/* CONTENT */}

          <View
            style={{
              paddingTop: 26,

              gap: 24,

              marginBottom: 40,
            }}
          >
            {/* TODAY */}

            <View
              style={{
                paddingHorizontal: 16,
              }}
            >
              <SectionTitle title="Today at a glance" />
            </View>

            {/* HOROSCOPE */}

            <View
              style={{
                gap: 12,

                paddingHorizontal: 16,
              }}
            >
              <ContentSection title="Daily Horoscope">
                <SansText>
                  A quick overview
                  of how today’s
                  planetary
                  positions may
                  influence your
                  day.
                </SansText>
              </ContentSection>

              <FeatureCard
                title="Today's Cosmic Pulse"
                description="Tap to select your zodiac sign and reveal today’s guidance."
                ctaText="Reveal Today’s Insight"
                image={require("@/assets/images/consmos1.png")}
                onPress={() =>
                  router.push(
                    "/(tabs)/home/(astrology)/select-zodiac-signs"
                  )
                }
                date={new Date()}
              />
            </View>

            {/* KUNDLI */}

            <View
              style={{
                gap: 12,

                paddingHorizontal: 16,
              }}
            >
              <ContentSection title="Kundli">
                <SansText>
                  A short insight
                  from your birth
                  chart based on
                  today’s
                  planetary
                  movement.
                </SansText>
              </ContentSection>

              <FeatureCard
                title="Today’s Chart Insight"
                description="Saturn influences discipline & patience."
                image={require("@/assets/images/consmos2.png")}
                onPress={() =>
                  router.push(
                    "/(tabs)/kundali"
                  )
                }
                height={214}
              />
            </View>

            {/* ASTROLOGERS */}

            <View
              style={{ gap: 12 }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                }}
              >
                <ContentSection title="Featured Astrologers">
                  <SansText>
                    Verified experts
                    who help
                    interpret charts
                    and planetary
                    periods.
                  </SansText>
                </ContentSection>
              </View>

              {astrologersLoading || astrologerFetching ? (
                <FlatList
                  data={[1, 2, 3]}
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                  }}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        width: 12,
                      }}
                    />
                  )}
                  renderItem={() => (
                    <View
                      style={{
                        width: 160,
                        height: 255,

                        borderRadius: 16,

                        backgroundColor:
                          "#FBF7EB",

                        borderWidth: 1,

                        borderColor:
                          "#E7D7A8",

                        paddingVertical: 20,

                        paddingHorizontal: 12,

                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          alignItems:
                            "center",

                          marginBottom: 18,
                        }}
                      >
                        <SkeletonLoader
                          width={84}
                          height={84}
                          array={[1]}
                          borderRadius={100}
                        />

                        <View
                          style={{
                            marginTop:
                              -10,
                          }}
                        >
                          <SkeletonLoader
                            width={58}
                            height={24}
                            array={[1]}
                            borderRadius={40}
                          />
                        </View>
                      </View>

                      <SkeletonLoader
                        width={110}
                        height={18}
                        array={[1]}
                        borderRadius={8}
                      />

                      <View
                        style={{
                          marginTop: 10,
                        }}
                      >
                        <SkeletonLoader
                          width={80}
                          height={14}
                          array={[1]}
                          borderRadius={8}
                        />
                      </View>

                      <View
                        style={{
                          marginTop: 16,

                          gap: 6,

                          alignItems:
                            "center",
                        }}
                      >
                        <SkeletonLoader
                          width={120}
                          height={10}
                          array={[1]}
                          borderRadius={6}
                        />

                        <SkeletonLoader
                          width={100}
                          height={10}
                          array={[1]}
                          borderRadius={6}
                        />
                      </View>
                    </View>
                  )}
                />
              ) : (
                <FlatList
                  data={
                    astrologers
                  }
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  keyExtractor={(
                    item
                  ) => item._id}
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                  }}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        width: 12,
                      }}
                    />
                  )}
                  renderItem={({
                    item,
                  }) => (
                    <ExpertCard
                      name={
                        item?.displayName ||
                        `${item?.firstName || ""} ${item?.lastName || ""}`
                      }
                      experience={
                        item?.experience ||
                        "0 Years"
                      }
                      description={
                        item?.bio ||
                        "Experienced astrologer"
                      }
                      tags={
                        item?.areaOfPractice ||
                        []
                      }
                      rating={
                        item?.rating ||
                        4.5
                      }
                      image={{
                        uri:
                          item?.profilePicture,
                      }}
                    />
                  )}
                />
              )}
            </View>

            {/* GEMS */}

            <View
              style={{ gap: 12 }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                }}
              >
                <ContentSection title="Recommended Gems">
                  <SansText>
                    Spiritual tools
                    recommended
                    based on
                    planetary
                    alignment and
                    energies.
                  </SansText>
                </ContentSection>
              </View>

              <FlatList
                data={GEMS}
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                keyExtractor={(
                  item
                ) => item.id}
                contentContainerStyle={{
                  paddingHorizontal: 16,

                  marginTop: 30,
                }}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      width: 12,
                    }}
                  />
                )}
                renderItem={({
                  item,
                }) => (
                  <GemCard
                    title={
                      item.title
                    }
                    description={
                      item.description
                    }
                    benefits={
                      item.benefits
                    }
                    image={
                      item.image
                    }
                  />
                )}
              />
            </View>

            {/* BLOGS */}

            {/* BLOGS */}

            <View
              style={{
                gap: 12,

                paddingHorizontal: 16,
              }}
            >
              <ContentSection title="Today’s Insights">
                <SansText>
                  Short reads to
                  help you
                  understand
                  ongoing
                  planetary
                  themes.
                </SansText>
              </ContentSection>

              {blogsLoading || blogFetching ? (
                <View
                  style={{
                    gap: 14,
                  }}
                >
                  {[1, 2].map(
                    (item) => (
                      <SkeletonLoader
                        key={item}
                        width={"100%"}
                        height={214}
                        array={[1]}
                        borderRadius={16}
                        innerSkeleton={
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "space-between",
                              padding: 24,
                            }}
                          >
                            {/* TOP DATE */}

                            <View
                              style={{
                                width: 90,
                                height: 30,
                                borderRadius: 20,
                                backgroundColor: "#E7D7A8",
                              }}
                            />

                            {/* BOTTOM CONTENT */}

                            <View
                              style={{
                                gap: 10,
                              }}
                            >
                              {/* TITLE */}

                              <View
                                style={{
                                  width: "78%",
                                  height: 22,
                                  borderRadius: 8,
                                  backgroundColor: "#E7D7A8",
                                }}
                              />

                              {/* DESCRIPTION LINE 1 */}

                              <View
                                style={{
                                  width: "100%",
                                  height: 12,
                                  borderRadius: 6,
                                  backgroundColor: "#E7D7A8",
                                }}
                              />

                              {/* DESCRIPTION LINE 2 */}

                              <View
                                style={{
                                  width: "82%",
                                  height: 12,
                                  borderRadius: 6,
                                  backgroundColor: "#E7D7A8",
                                }}
                              />

                              {/* CTA */}

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 8,
                                  marginTop: 6,
                                }}
                              >
                                <View
                                  style={{
                                    width: 110,
                                    height: 14,
                                    borderRadius: 6,
                                    backgroundColor: "#E7D7A8",
                                  }}
                                />

                                <View
                                  style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 100,
                                    backgroundColor: "#E7D7A8",
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                        }
                      />
                    )
                  )}
                </View>
              ) : blogs?.length >
                0 ? (
                blogs.map(
                  (
                    blog: any
                  ) => (
                    <FeatureCard
                      key={blog._id}
                      title={
                        blog?.title ||
                        "Untitled Blog"
                      }
                      description={
                        blog?.content?.slice(
                          0,
                          60
                        ) + "..."
                      }
                      image={{
                        uri:
                          blog?.thumbnail,
                      }}
                      date={new Date(
                        blog?.createdAt
                      )}
                      ctaText="Read Article"
                      height={194}
                      onPress={() =>
                        router.push({
                          pathname:
                            "/home/article/[id]",

                          params: {
                            id: blog?._id,
                          },
                        })
                      }
                    />
                  )
                )
              ) : (
                <SansText>
                  No blogs available
                </SansText>
              )}
            </View>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default HomeScreen;