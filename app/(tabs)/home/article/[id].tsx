import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ContentSection from "@/components/reusable/ContentSectoin/ContentSection";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import { useGetBlogByIdQuery } from "@/redux/features/blog/blogApi";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

import React from "react";

import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function BlogDetailsPage() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetBlogByIdQuery(id!, {
    skip: !id,
  });

  const blog = data?.data;
  console.log(blog)
  /* ---------------- LOADING ---------------- */

  if (isLoading || isFetching) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 140,
            }}
          >
            {/* HERO IMAGE */}

            <View style={styles.skeletonHeroContainer}>
              <SkeletonLoader
                width="100%"
                height={SCREEN_WIDTH * 0.95}
                borderTopLeftRadius={0}
                borderTopRightRadius={0}
                borderBottomLeftRadius={24}
                borderBottomRightRadius={24}
              />

              {/* BACK BUTTON */}

              <View style={styles.skeletonBackWrapper}>
                <SkeletonLoader
                  width={42}
                  height={42}
                  borderRadius={999}
                  array={[1]}
                />
              </View>

              {/* OVERLAY TEXT */}

              <View style={styles.skeletonOverlayContent}>
                <SkeletonLoader
                  width="78%"
                  height={32}
                  borderRadius={10}
                  array={[1]}
                />

                <SkeletonLoader
                  width="40%"
                  height={14}
                  borderRadius={8}
                  array={[1]}
                />
              </View>
            </View>

            {/* CONTENT */}

            <View style={styles.skeletonContentContainer}>
              <SkeletonLoader
                width="25%"
                height={24}
                borderRadius={8}
              />

              <View style={{ marginTop: 24, gap: 14 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((_, index) => (
                  <SkeletonLoader
                    key={index}
                    width={
                      index % 2 === 0 ? "100%" : "88%"
                    }
                    height={16}
                    borderRadius={8}
                  />
                ))}
              </View>
            </View>
          </ScrollView>


        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (isError || !blog) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <View style={styles.centerContainer}>
            <SansText style={styles.errorText}>
              Failed to load blog
            </SansText>
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 140,
            }}
          >
            {/* HERO */}

            <View style={styles.heroContainer}>
              <Image
                source={{
                  uri:
                    blog?.thumbnail ||
                    "https://via.placeholder.com/800x600",
                }}
                style={styles.heroImage}
                contentFit="cover"
                transition={300}
              />

              <LinearGradient
                colors={[
                  "rgba(0,0,0,0)",
                  "rgba(0,0,0,0.85)",
                ]}
                style={styles.gradient}
              />

              {/* BACK BUTTON */}

              <TouchableOpacity
                style={styles.backBtn}
                activeOpacity={0.8}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color="#4A4A4A"
                />
              </TouchableOpacity>

              {/* OVERLAY */}

              <View style={styles.overlayContent}>
                <SatoshiText style={styles.title}>
                  {blog?.title}
                </SatoshiText>

                <SansText style={styles.meta}>
                  {blog?.category} •{" "}
                  {new Date(
                    blog?.createdAt,
                  ).toLocaleDateString()}
                </SansText>
              </View>
            </View>

            {/* CONTENT */}

            <View style={styles.contentContainer}>
              <View style={styles.card}>
                <ContentSection title="Article">
                  <SansText style={styles.bodyText}>
                    {blog?.content}
                  </SansText>
                </ContentSection>
              </View>
            </View>
          </ScrollView>

          {/* FIXED BOTTOM */}

          <View style={styles.fixedBottom}>
            <ReusableButton
              title="Consult An Astrologer"
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/astrologers/(astrologer)/[id]",
                  params: {
                    id: blog.addedBy,
                  },
                });
              }}
              width="100%"
              variant="solid"
              iconName="CallIcon"
              iconPosition="left"
            />

            <SansText style={styles.footerText}>
              For personalized guidance based on your
              chart
            </SansText>
          </View>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: "red",
    fontSize: 16,
  },

  heroContainer: {
    marginTop: 12,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: "hidden",
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: SCREEN_WIDTH * 0.95,
  },

  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },

  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    height: 42,
    width: 42,
    borderRadius: 999,
    backgroundColor: "#EDDEAD",
    justifyContent: "center",
    alignItems: "center",
  },

  overlayContent: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    gap: 8,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    color: "#F5F5F5",
    fontFamily: "SatoshiBold",
  },

  meta: {
    color: "#E0E0E0",
    fontSize: 14,
  },

  contentContainer: {},

  card: {
    borderRadius: 24,
    padding: 20,
  },

  bodyText: {
    color: "#4A4A4A",
    fontSize: 16,
    lineHeight: 30,
  },

  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FBF7EB",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: "#E8DCB5",
    gap: 10,
  },

  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#8C8C8C",
  },
  skeletonHeroContainer: {
    marginTop: 12,
    position: "relative",
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,

  },

  skeletonBackWrapper: {
    position: "absolute",
    top: 20,
    left: 20,
  },

  skeletonOverlayContent: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    gap: 12,
  },

  skeletonContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
});