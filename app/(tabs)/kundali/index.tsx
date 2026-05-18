import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import ContentSection from "@/components/reusable/ContentSectoin/ContentSection";
import { SansText } from "@/components/reusable/Text/SansText";
import Tabs from "@/components/tabs/home/home/TabOption/TabOption";
import { ScrollView } from "react-native-gesture-handler";

const chartImage = require("@/assets/images/chart.png");

const chartData = [
  {
    id: "1",
    title: "Lagna chart (D1)",
    description:
      "Shows your core personality and life direction.",
  },
  {
    id: "2",
    title: "Navamsa chart (D9)",
    description:
      "Used to understand deeper strengths and long-term outcomes.",
  },
  {
    id: "3",
    title: "Moon chart",
    description:
      "Represents emotional patterns and mental tendencies.",
  },
];

const Astrologer = () => {
  const [day, setDay] = useState("basic_charts");

  const renderCard = ({ item }: any) => {
    return (
      <TouchableOpacity activeOpacity={0.8}>
        <ContentSection title={item.title}>
          <SansText style={styles.topDescription}>
            {item.description}
          </SansText>
        </ContentSection>

        <Image
          source={chartImage}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader showBack={false}>
          <AuthTitle title="Kundli" />
        </AppHeader>

        <View style={styles.tabContainer}>
          <Tabs
            options={[
              { label: "Basic Charts", value: "basic_charts" },
              {
                label: "Planetary Positions",
                value: "planetary_positions",
              },
              { label: "House System", value: "house_system" },
            ]}
            selected={day}
            onChange={setDay}
          />
        </View>

        <ScrollView style={styles.container}>
          <ContentSection title="Birth charts">
            <SansText style={styles.topDescription}>
              These charts form the base of your astrological analysis.
            </SansText>
          </ContentSection>

          <FlatList
            data={chartData}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default Astrologer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },

  tabContainer: {
    marginTop: 10,
  },

  topDescription: {
    color: "#4A4A4A",
    marginTop: 4,
    lineHeight: 22,
  },

  listContent: {
    paddingBottom: 120,
    gap: 18,
    marginTop: 10,
  },

  image: {
    width: "100%",
    height: 253,
    borderRadius: 12,
    alignSelf: "stretch",
    backgroundColor: "lightgray",
    marginTop:12
  },
});