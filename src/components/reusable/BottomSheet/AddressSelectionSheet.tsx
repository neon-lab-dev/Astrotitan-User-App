import React from "react";

import {
  ScrollView,
  View,
} from "react-native";
import AddressCard from "../../tabs/profile/address/AddressCard";
import ReusableButton from "../ReusableButton/ReusableButton";


const AddressSelectionSheet = ({
  addresses,
  selectedId,
  onSelect,
  onPress,
}: any) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: "space-between"
    }}>
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,

        }}
      >
        {addresses.map(
          (item: any) => (
            <AddressCard
              key={item._id}
              data={item}
              showSelectOption
              selected={
                item._id ===
                selectedId
              }
              onSelect={() =>
                onSelect(item)
              }
            />
          )
        )}

      </ScrollView>
      <ReusableButton title="Add new Address" style={{marginHorizontal:16,marginVertical:16}} onPress={onPress} /></View>
  );
};

export default AddressSelectionSheet;