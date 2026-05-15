import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ContentSection from "@/components/reusable/ContentSectoin/ContentSection";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function BlogDetailsPage() {
  return (<AnimatedScreen>
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {/* HERO IMAGE */}
          <View style={styles.heroContainer}>
            <Image
              source={require("@/assets/images/consmos1.png")}
              style={styles.heroImage}
              contentFit="cover"
            />

            {/* OVERLAY */}
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

            {/* TEXT OVERLAY */}
            <View style={styles.overlayContent}>
              <SatoshiText style={styles.title}>
                Why Patience Matters During Saturn Transits
              </SatoshiText>

              <SansText style={styles.meta}>
                Saturn • Life Guidance • 3 min read
              </SansText>
            </View>
          </View>

          {/* CONTENT */}
          <View style={styles.contentContainer}>
            <View style={styles.card}>
              {/* OVERVIEW */}
              <ContentSection title="Overview">
                <SansText style={styles.bodyText}>
                  Saturn is often associated with discipline,
                  responsibility, and long-term growth in astrology.
                  During Saturn-influenced periods, progress may feel
                  slower than expected. This article explains why
                  patience becomes important during such times and how
                  approaching situations calmly can lead to better
                  outcomes.
                </SansText>
              </ContentSection>

              <View style={styles.divider} />

              {/* SECTION 1 */}
              <ContentSection title="What Saturn Represents in Astrology">
                <SansText style={styles.bodyText}>
                  In astrology, Saturn is linked to structure,
                  effort, and lessons that unfold over time.
                  Unlike fast-moving planets, Saturn’s influence
                  encourages steady progress rather than quick
                  results. Its role is often to highlight areas
                  where consistency and responsibility are needed.
                </SansText>

                <SansText style={styles.bodyText}>
                  This doesn’t indicate negativity — it signals a
                  phase of learning and strengthening foundations.
                </SansText>
              </ContentSection>

              {/* <View style={styles.divider} /> */}

              {/* SECTION 2 */}
              {/* <ContentSection title="Why Things May Feel Slower">
                <SansText style={styles.bodyText}>
                  During Saturn transits, outcomes often require:
                </SansText>

                <View style={styles.bulletContainer}>
                  <SansText style={styles.bullet}>
                    • More discipline and focus
                  </SansText>

                  <SansText style={styles.bullet}>
                    • Long-term thinking
                  </SansText>

                  <SansText style={styles.bullet}>
                    • Emotional maturity
                  </SansText>

                  <SansText style={styles.bullet}>
                    • Better decision-making
                  </SansText>
                </View>

                <SansText style={styles.bodyText}>
                  These phases may initially feel restrictive,
                  but they often help create stronger life
                  foundations over time.
                </SansText>
              </ContentSection> */}

              {/* <View style={styles.divider} /> */}

              {/* SECTION 3 */}
              {/* <ContentSection title="How To Navigate Saturn Periods">
                <SansText style={styles.bodyText}>
                  Instead of rushing outcomes, focus on:
                </SansText>

                <View style={styles.bulletContainer}>
                  <SansText style={styles.bullet}>
                    • Maintaining healthy routines
                  </SansText>

                  <SansText style={styles.bullet}>
                    • Building patience gradually
                  </SansText>

                  <SansText style={styles.bullet}>
                    • Taking practical decisions
                  </SansText>

                  <SansText style={styles.bullet}>
                    • Avoiding emotional impulsiveness
                  </SansText>
                </View>

                <SansText style={styles.bodyText}>
                  Saturn periods can become powerful growth phases
                  when approached with consistency and calmness.
                </SansText>
              </ContentSection> */}
            </View>
          </View>
        </ScrollView>

        {/* FIXED BOTTOM BUTTON */}
        <View style={styles.fixedBottom}>
          <ReusableButton
            title="Consult An Astrologer"
            onPress={() => { }}
            width="100%"
            variant="solid"
            iconName="CallIcon"
            iconPosition="left"
          />

          <SansText style={styles.footerText}>
            For personalized guidance based on your chart
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

  contentContainer: { 
  },

  card: {
    // backgroundColor: "#F6F0DA",
    borderRadius: 24,
    padding: 20,
    gap: 24,
  },

  bodyText: {
    color: "#4A4A4A",
    fontSize: 16,
    lineHeight: 28,
  },

  divider: {
    height: 1,
    backgroundColor: "#D8CCAA",
  },

  bulletContainer: {
    marginTop: 12,
    gap: 10,
  },

  bullet: {
    color: "#4A4A4A",
    fontSize: 16,
    lineHeight: 24,
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
});