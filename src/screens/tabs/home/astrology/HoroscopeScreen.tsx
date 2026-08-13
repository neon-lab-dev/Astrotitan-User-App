import ArrowRoundedIcon from '@/assets/icons/actions/arrow-down-round.svg';
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheetService from '../../../../redux/features/ui/GlobalSheet/BottomSheetService';
import SelectZodiacScreen from '../../../../components/reusable/zodiacSigns/zodiacSigns';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import AppHeader from '../../../../components/reusable/AppHeader/AppHeader';
import { getToday } from '../../../../utils/getToday';
import { SansText } from '../../../../components/reusable/Text/SansText';
import SectionTitle from '../../../../components/reusable/SectionTitle/SectionTitle';
import { SatoshiText } from '../../../../components/reusable/Text/SatoshiText';
import InsightSection from '../../../../components/tabs/home/home/InsightSection/InsightSection';
import Tabs from './../../../../components/tabs/home/home/TabOption/TabOption';
import { zodiacSigns } from '../../../../data/zodiacSigns';
import { useRoute } from "@react-navigation/native";
import SkeletonLoader from '../../../../components/reusable/SkeletonLoader/SkeletonLoade';
// import { ChevronDown } from "lucide-react-native";
const HoroscopeScreen = () => {
  const route = useRoute<any>();

  const { sign } = route.params || {};

  const [selectedZodiac, setSelectedZodiac] = useState("aries");
  const [day, setDay] = useState("today");
  const [range, setRange] = useState("daily");

  const [loading, setLoading] = useState(false);
  const [dailyHoroscope, setDailyHoroscope] = useState("");
  const [periodicHoroscope, setPeriodicHoroscope] = useState("");

  // ✅ Sync param
  useEffect(() => {
    if (sign) {
      setSelectedZodiac(sign as string);
    }
  }, [sign]);


  const SelectZodiacSign = () => {
    BottomSheetService.open(
      <SelectZodiacScreen
        handleContinue={(sign: string) => {
          // 1. update state (this triggers API automatically)
          setSelectedZodiac(sign);

          // 2. close bottom sheet
          BottomSheetService.close();
        }}
      />,
      {
        height: "80%",
        hasGradient: true,
      }
    );
  };


  // ✅ API CALL
  const fetchDailyHoroscope = async () => {
    try {
      setLoading(true);

      const url = `https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=${selectedZodiac}`;
      const res = await fetch(url);
      const data = await res.json();

      let text = data?.data?.horoscope || "";

      // 🔥 simulate day variation (since API doesn't support it)
      if (day === "previous") {
        text = "Yesterday: " + text;
      } else if (day === "tomorrow") {
        text = "Tomorrow: " + text;
      }

      setDailyHoroscope(text);
    } catch (err) {
      console.log("DAILY ERROR:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchPeriodicHoroscope = async () => {
    try {
      setLoading(true);

      const url = `https://freehoroscopeapi.com/api/v1/get-horoscope/${range}?sign=${selectedZodiac}`;
      const res = await fetch(url);
      const data = await res.json();

      setPeriodicHoroscope(data?.data?.horoscope || "");
    } catch (err) {
      console.log("PERIODIC ERROR:", err);
    } finally {
      setLoading(false);
    }
  };
  // 🔥 trigger API on change
  useEffect(() => {
    fetchDailyHoroscope();
  }, [selectedZodiac, day]);

  useEffect(() => {
    fetchPeriodicHoroscope();
  }, [selectedZodiac, range]);
  const currentSign = zodiacSigns.find(
    (z) => z.id === selectedZodiac
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenWrapper>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ gap: 24 }}>

            {/* TITLE */}
            <AppHeader backgroundColor="transparent" borderColor="transparent" backText={<SansText style={{ fontSize: 14, color: "#4A4A4A" }}>
              {getToday()}
            </SansText>}>
              <SectionTitle
                title={`Daily horoscope for ${selectedZodiac.charAt(0).toUpperCase() +
                  selectedZodiac.slice(1)
                  }`}
              />

            </AppHeader>


            {/* DAY TABS */}
            <Tabs
              options={[
                { label: "Today", value: "today" },
                { label: "Previous Day", value: "previous" },
                { label: "Tomorrow", value: "tomorrow" },
              ]}
              selected={day}
              onChange={setDay}
            />
            <View style={{ flexDirection: "column", alignItems: "flex-start", gap: 6, paddingHorizontal: 16 }}>

              <Image
                source={currentSign?.image}
                style={styles.image}
              />

              <TouchableOpacity onPress={SelectZodiacSign} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <SatoshiText style={styles.label}>
                  {currentSign?.name}


                </SatoshiText>
                <ArrowRoundedIcon width={24} height={24} style={{ marginLeft: 6 }} />

              </TouchableOpacity>
              <SatoshiText style={{ fontSize: 16, color: "#4A4A4A" }}>
                Based on general planetary positions for {currentSign?.name}.
              </SatoshiText>
              <SatoshiText style={{ fontSize: 21, fontFamily: "Satoshi-Bold", color: "#0D0D0D", marginBottom: 6, marginTop: 18 }}>`{
                day === "today"
                  ? "Today's"
                  : day === "previous"
                    ? "Yesterday's"
                    : "Tomorrow's"
              } overview</SatoshiText>
              {dailyHoroscope !== "" && dailyHoroscope !== null ? <SatoshiText style={{ fontSize: 16, color: "#4A4A4A" }}>
                {dailyHoroscope}
              </SatoshiText> : <View style={styles.skeletonContentContainer}>
                <View style={{ gap: 14 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9,].map(
                    (_, index) => (
                      <SkeletonLoader
                        key={index}
                        width={index % 2 === 0 ? "100%" : "88%"}
                        height={16}
                        borderRadius={8}
                        array={[1]}
                      />
                    ),
                  )}
                </View>
              </View>}
            </View>


            <InsightSection />

            {/* RANGE TABS */}
            <Tabs
              options={[
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
              ]}
              selected={range}
              onChange={setRange}
            />
            <View style={{ paddingHorizontal: 16 }}>
              <SatoshiText style={{ fontSize: 21, fontFamily: "SatoshiBold", color: "#0D0D0D", marginBottom: 6, marginTop: 18 }}>`{
                range.charAt(0).toUpperCase() + range.slice(1)
              } insights`</SatoshiText>
              <SatoshiText style={{ fontSize: 16, color: "#4A4A4A" }}>
                {periodicHoroscope}
              </SatoshiText>
            </View>

            <InsightSection />

          </View>
        </ScrollView>
      </ScreenWrapper>
    </SafeAreaView>
  );
};

export default HoroscopeScreen;

const styles = StyleSheet.create({

  image: {
    width: 70,
    height: 50,
    marginBottom: 10,
  },

  label: {
    fontSize: 21,
    fontFamily: "Satoshi-Bold",
    color: "#0d0d0d",
  },
  skeletonContentContainer: {
    paddingTop: 28,
  },
});