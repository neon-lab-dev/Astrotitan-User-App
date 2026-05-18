import StarIcon from "@/assets/icons/visual/star.svg";

import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

import ContentSection from "@/components/reusable/ContentSectoin/ContentSection";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";

import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";

import {
  useGetAstrologerByIdQuery,
} from "@/redux/features/astrologer/astrologerApi";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";

import React, { useState } from "react";

import AstrologerDetailSkeleton from "@/components/tabs/astrologer/astrologer/AstrologerDetailSkeleton/AstrologerDetailSkeleton ";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH =
  Dimensions.get("window").width;

const AstrologerDetail =
  () => {
    const params = useLocalSearchParams();

    const id = params?.id as string;
    const [refreshing, setRefreshing] = useState(false);
    const previewAstrologer =
      params?.astrologer
        ? JSON.parse(
          params.astrologer as string
        )
        : null;

    const {
      data,
      isLoading,
      isFetching,
      refetch,
    } =
      useGetAstrologerByIdQuery(
        id,
        {
          skip: !id,
        }
      );

    const astrologer =
      data?.data ||
      previewAstrologer;
    const onRefresh =
      async () => {
        try {
          setRefreshing(true);

          await refetch();
        } finally {
          setRefreshing(false);
        }
      };
    if (
      isLoading &&
      !previewAstrologer
    ) {
      return (
        <AstrologerDetailSkeleton />
      );
    }

    return (
      <AnimatedScreen>
        <ScreenWrapper>
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
          >
            {/* HEADER */}

            <View
              style={
                styles.header
              }
            >
              {/* IMAGE */}

              <Image
                source={
                  astrologer?.profilePicture
                    ? {
                      uri:
                        astrologer.profilePicture,
                    }
                    : require("@/assets/images/dummy/experts/expert1.png")
                }
                style={
                  styles.image
                }
              />

              {/* GRADIENT */}

              <LinearGradient
                colors={[
                  "rgba(0,0,0,0)",

                  "rgba(0,0,0,0.88)",
                ]}
                style={
                  styles.gradient
                }
              />

              {/* BACK BUTTON */}

              <TouchableOpacity
                style={
                  styles.backBtn
                }
                onPress={() =>
                  router.back()
                }
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#0D0D0D"
                />
              </TouchableOpacity>

              {/* OVERLAY CONTENT */}

              <View
                style={
                  styles.overlayContent
                }
              >
                <SatoshiText
                  style={
                    styles.name
                  }
                >
                  {astrologer?.displayName ||
                    `${astrologer?.firstName || ""} ${astrologer?.lastName || ""}`}
                </SatoshiText>

                <SansText
                  style={
                    styles.sub
                  }
                >
                  {astrologer?.areaOfPractice?.join(
                    ", "
                  ) ||
                    "Vedic Astrology"}
                </SansText>

                <View
                  style={
                    styles.status
                  }
                >
                  <View
                    style={{
                      width: 10,

                      height: 10,

                      borderRadius: 100,

                      backgroundColor:
                        "#E9F7EB",
                    }}
                  />

                  <SansText
                    style={
                      styles.statusText
                    }
                  >
                    {astrologer
                      ?.availability
                      ?.availableTime
                      ?.startTime &&
                      astrologer
                        ?.availability
                        ?.availableTime
                        ?.endTime
                      ? `Available ${astrologer.availability.availableTime.startTime} - ${astrologer.availability.availableTime.endTime}`
                      : "Available for guidance"}
                  </SansText>
                </View>
              </View>
            </View>

            {/* CONTENT */}

            <View
              style={
                styles.container
              }
            >
              {/* STATS */}

              <View
                style={
                  styles.statsRow
                }
              >
                {/* RATING */}

                <View
                  style={
                    styles.statBox
                  }
                >
                  <View
                    style={{
                      flexDirection:
                        "row",

                      alignItems:
                        "center",

                      gap: 4,
                    }}
                  >
                    <StarIcon
                      width={
                        20
                      }
                      height={
                        20
                      }
                    />

                    <SatoshiText
                      style={
                        styles.statValue
                      }
                    >
                      {astrologer?.rating ||
                        4.5}
                    </SatoshiText>
                  </View>

                  <SansText
                    style={
                      styles.statLabel
                    }
                  >
                    Based on{" "}
                    {astrologer
                      ?.reviews
                      ?.length ||
                      0}{" "}
                    reviews
                  </SansText>
                </View>

                {/* EXPERIENCE */}

                <View
                  style={
                    styles.statBox
                  }
                >
                  <SatoshiText
                    style={
                      styles.statValue
                    }
                  >
                    {astrologer?.experience ||
                      "0 Years"}
                  </SatoshiText>

                  <SansText
                    style={
                      styles.statLabel
                    }
                  >
                    Years of
                    experience
                  </SansText>
                </View>
              </View>

              {/* ABOUT */}

              <View
                style={{
                  gap: 24,
                }}
              >
                <ContentSection
                  title="About the astrologer"
                  descriptionColor="#4A4A4A"
                >
                  <SansText>
                    {astrologer?.bio ||
                      "Experienced astrologer providing thoughtful guidance and practical remedies."}
                  </SansText>
                </ContentSection>

                {/* LANGUAGES */}

                <View>
                  <ContentSection
                    title="Languages spoken"
                    descriptionColor="#4A4A4A"
                  >
                    <SansText>
                      Choose the
                      language
                      you’re most
                      comfortable
                      with
                    </SansText>
                  </ContentSection>

                  <View
                    style={
                      styles.tagRow
                    }
                  >
                    {astrologer?.consultLanguages
                      ?.length >
                      0
                      ? astrologer.consultLanguages.map(
                        (
                          lang: string
                        ) => (
                          <View
                            key={
                              lang
                            }
                            style={
                              styles.tag
                            }
                          >
                            <SansText
                              style={
                                styles.tagText
                              }
                            >
                              {
                                lang
                              }
                            </SansText>
                          </View>
                        )
                      )
                      : ["English"].map(
                        (
                          lang: string
                        ) => (
                          <View
                            key={
                              lang
                            }
                            style={
                              styles.tag
                            }
                          >
                            <SansText
                              style={
                                styles.tagText
                              }
                            >
                              {
                                lang
                              }
                            </SansText>
                          </View>
                        )
                      )}
                  </View>
                </View>

                {/* AREAS */}

                <View>
                  <ContentSection
                    title="Areas of Guidance"
                    descriptionColor="#4A4A4A"
                  >
                    <SansText>
                      Choose the
                      area you
                      need
                      guidance
                      in
                    </SansText>
                  </ContentSection>

                  <View
                    style={
                      styles.tagRow
                    }
                  >
                    {astrologer?.areaOfPractice
                      ?.length >
                      0
                      ? astrologer.areaOfPractice.map(
                        (
                          item: string
                        ) => (
                          <View
                            key={
                              item
                            }
                            style={
                              styles.tag
                            }
                          >
                            <SansText
                              style={
                                styles.tagText
                              }
                            >
                              {
                                item
                              }
                            </SansText>
                          </View>
                        )
                      )
                      : ["Career"].map(
                        (
                          item: string
                        ) => (
                          <View
                            key={
                              item
                            }
                            style={
                              styles.tag
                            }
                          >
                            <SansText
                              style={
                                styles.tagText
                              }
                            >
                              {
                                item
                              }
                            </SansText>
                          </View>
                        )
                      )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* FIXED BOTTOM */}

          <View
            style={
              styles.fixedBottom
            }
          >
            <ReusableButton
              onPress={() => { }}
              title="Call Now"
              variant="outline"
              iconName="CallIcon"
              iconPosition="left"
              style={{
                flex: 1,
              }}
            />

            <ReusableButton
              onPress={() => { }}
              title="Chat Now"
              variant="solid"
              iconName="ChatIcon"
              iconPosition="left"
              style={{
                flex: 1,
              }}
            />
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  };

export default AstrologerDetail;

const styles =
  StyleSheet.create({
    header: {
      position:
        "relative",

      overflow:
        "hidden",
    },

    image: {
      width:
        SCREEN_WIDTH,

      height:
        SCREEN_WIDTH,
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 12
    },

    gradient: {
      position:
        "absolute",

      left: 0,

      right: 0,

      bottom: 0,

      height: "100%",
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 12
    },

    backBtn: {
      position:
        "absolute",

      top: 36,

      left: 20,

      width: 48,

      height: 48,

      borderRadius: 100,

      backgroundColor:
        "#EDDEAD",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    overlayContent: {
      position:
        "absolute",

      left: 20,

      right: 20,

      bottom: 24,

      gap: 8,

    },

    name: {
      fontSize: 28,

      color:
        "#FFFFFF",

      fontFamily:
        "SatoshiBold",
    },

    sub: {
      color:
        "#F5F5F5",

      fontSize: 16,

      lineHeight: 24,
    },

    status: {
      alignSelf:
        "flex-start",

      backgroundColor:
        "#1B7726",

      paddingHorizontal: 14,

      paddingVertical: 10,

      borderRadius: 100,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 8,

      marginTop: 6,
    },

    statusText: {
      color:
        "#E9F7EB",

      fontSize: 12,
    },

    container: {
      padding: 16,

      gap: 24,
    },

    statsRow: {
      flexDirection:
        "row",

      gap: 12,
    },

    statBox: {
      flex: 1,

      backgroundColor:
        "#FBF7EB",

      borderRadius: 16,

      borderWidth: 1,

      borderColor:
        "#D4AF37",

      padding: 24,

      alignItems:
        "center",

      gap: 6,
    },

    statValue: {
      fontSize: 22,

      color:
        "#0D0D0D",

      fontFamily:
        "SatoshiBold",
    },

    statLabel: {
      fontSize: 13,

      color:
        "#4A4A4A",

      textAlign:
        "center",

      lineHeight: 20,
    },

    tagRow: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      gap: 10,

      marginTop: 14,
    },

    tag: {
      backgroundColor:
        "#EDDEAD",

      borderWidth: 1,

      borderColor:
        "#E6D18B",

      paddingHorizontal: 20,

      paddingVertical: 10,

      borderRadius: 12,
    },

    tagText: {
      fontSize: 15,

      color:
        "#0D0D0D",
    },

    fixedBottom: {
      position:
        "absolute",

      left: 0,

      right: 0,

      bottom: 0,

      flexDirection:
        "row",

      gap: 12,

      paddingHorizontal: 16,

      paddingTop: 16,

      paddingBottom: 24,

      backgroundColor:
        "#FBF7EB",
    },
  });