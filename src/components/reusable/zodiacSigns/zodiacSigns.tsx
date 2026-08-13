// app/(zodiac)/select-zodiac.tsx

import React, { useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import ReusableButton from "../ReusableButton/ReusableButton";
import { SatoshiText } from "../Text/SatoshiText";
import { zodiacSigns } from "../../../data/zodiacSigns";
import { useUpdateProfileMutation } from "../../../redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

type Props = {
  handleContinue: (selected: string) => void;
};

export default function SelectZodiacScreen({ handleContinue }: Props) {
    const [selected, setSelected] = useState< null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    console.log(user,"fomrselsct")
const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation(
    {},
  );

   const handleAddZodiacSign = async () => {
    console.log("caed")
    if (!selected) {
      return;
    }

    try {
      const payload = {
       zodiacSign: selected.charAt(0).toUpperCase() + selected.slice(1),
      };
      await updateProfile(payload).unwrap();

    } catch (err: any) {
      console.error("Error updating zodiac sign:", err);
    }
  };

    const renderItem = ({ item }: any) => {
        const isSelected = selected === item.id;

        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => setSelected(item.id)}
                activeOpacity={0.8}
            >
                <Image
                    source={item.image}
                    style={styles.image}
                />

                <SatoshiText style={styles.label}>{item.name}</SatoshiText>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={zodiacSigns}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            />
           {selected && <View style={styles.footer}>
                <ReusableButton
                    title="View Insights"
                    variant="solid"
                   onPress={() => {handleContinue(selected)
                    if(user?.zodiacSign==null){
                        handleAddZodiacSign()
                    }
                   }}
                    disabled={!selected}
                />
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    card: {
        width: "48%",
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: "center",
        marginBottom: 20,
    },

    selectedCard: {
        borderWidth: 2,
        borderColor: "#E6D18B",
        backgroundColor: "#EDDEAD",
    },

    image: {
        width: 150,
        height: 100,
        marginBottom: 10,
    },

    label: {
        fontSize: 16,
        fontFamily: "Satoshi-Bold",
        color: "#4A4A4A",
    },

    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 16,
    },
});