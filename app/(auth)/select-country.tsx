import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import { SansText } from "@/components/reusable/Text/SansText";
import { Ionicons } from "@expo/vector-icons";
import { countries } from "country-data";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SelectCountryScreen() {
  const [search, setSearch] = useState("");
  const params = useLocalSearchParams();
  // 🔥 CLEAN DATA SOURCE
  const allCountries = useMemo(() => {
    return countries.all.map((c) => ({
      name: c.name,
      code: c.alpha2,
      callingCode: c.countryCallingCodes[0]?.replace("+", "") || "",
      flag: getFlagEmoji(c.alpha2),
    }));
  }, []);

  // 🔍 FILTER
  const filteredCountries = useMemo(() => {
    return allCountries.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, allCountries]);
  const handleSelect = (country: any) => {
    const targetScreen =
      params.source === "login" ? "/(auth)/login" : "/(auth)/register";

    router.replace({
      pathname: targetScreen,
      params: {
        countryName: country.name,
        countryCode: country.code,
        callingCode: country.callingCode,
        flag: country.flag,
      },
    });
  };

  return (<AnimatedScreen>
    <View style={styles.container}>
      {/* HEADER */}
      <AppHeader>
        <AuthTitle title="Select country code">
          <SansText>Used to verify your mobile number.</SansText>
        </AuthTitle>
      </AppHeader>

      {/* SEARCH */}
      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#6B5E2E" />
          <TextInput
            placeholder="Search country or code..."
            placeholderTextColor="#6B5E2E"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* LIST */}
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.code}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => handleSelect(item)}
            >
              <View style={styles.left}>
                <SansText style={styles.flag}>{item.flag}</SansText>
                <SansText style={styles.name}>
                  {item.name.toUpperCase()}
                </SansText>
              </View>

              <SansText style={styles.code}>+{item.callingCode}</SansText>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </AnimatedScreen>
  );
}

/* 🔥 FLAG GENERATOR */
function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4AF37",
    paddingHorizontal: 24,
    marginBottom: 16,
    height: 72,
    borderRadius: 12,
    fontSize: 15,
    color: "#1C1C1C",
    backgroundColor: "#E9D8A6",
    flex: 1,
    fontFamily: "Sans",
    textAlignVertical: "center", // 🔥 MOST IMPORTANT
    includeFontPadding: false,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1C1C1C",
    fontFamily: "Sans",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  flag: {
    fontSize: 18,
  },

  name: {
    fontSize: 16,
    color: "#1C1C1C",
  },

  code: {
    fontSize: 14,
    color: "#1C1C1C",
  },
});
