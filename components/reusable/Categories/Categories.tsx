import * as Haptics from "expo-haptics";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SansText } from "../Text/SansText";

const Categories = ({
  setSelectedCategory,
  selectedCategory,
  allCategories,
  isLoading = false,
}: any) => {
  const data = ["All", ...allCategories];

  return (
    <View style={styles.categoriesContainer}>
      {isLoading ? (
        <Text>Loading categories...</Text>
      ) : (
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingLeft: 16, gap: 10 }}
          renderItem={({ item }) => {
            const isActive =
              selectedCategory === item ||
              (item === "All" && selectedCategory === "");

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Light
                  );
                  setSelectedCategory(item === "All" ? "" : item);
                }}
              >
                <View
                  style={
                    isActive
                      ? styles.activeChip
                      : styles.inactiveChip
                  }
                >
                  <SansText
                    style={
                      isActive
                        ? styles.activeText
                        : styles.inactiveText
                    }
                  >
                    {item}
                  </SansText>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderWidth: 1,
    gap: 8,
  },
  categoryChipActive: {
    backgroundColor: "#38A169",
    borderColor: "#38A169",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  activeChip: {
    borderRadius: 48,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor:"#D4AF37"
  },

  inactiveChip: {
    borderRadius: 48,
  paddingHorizontal: 32,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },

  activeText: {
     fontSize: 16,
    fontFamily: "SansMedium",
    color: "#0D0D0D",
  },

  inactiveText: {
    fontSize: 16,
    fontFamily: "SansMedium",
    color: "#0D0D0D",
  },
});
