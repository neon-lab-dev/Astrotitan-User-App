/* eslint-disable react-native/no-inline-styles */
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  getAllCountries,
  getStatesByCountryId,
  getCitiesByStateId,
} from 'react-native-country-state-city';

// 👇 Replace these with your actual theme values
const theme = {
  colors: {
    background: '#FFFFFF',
    border: '#E0E0E0',
    borderFocused: '#D4AF37', // your primary color
    text: '#1A1A1A',
    placeholder: '#9E9E9E',
    error: '#FF3B30',
    dropdownBackground: '#FFFFFF',
    selectedItemBackground: '#F0F0FF',
  },
  radius: {
    input: 10,
    dropdown: 10,
  },
  spacing: {
    inputPaddingH: 14,
    inputPaddingV: 12,
    marginTop: 24,
  },
  typography: {
    input: {
      fontSize: 15,
    },
    error: {
      fontSize: 12,
    },
  },
};

const isValidCity = (text: string) => {
  if (!text) return false;
  const trimmed = text.trim();
  return /^[A-Za-z\s,'-]{2,50}$/.test(trimmed);
};

const CityInput = ({ value, setValue }: any) => {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  const cities = useMemo(() => {
    const india = getAllCountries().find(c => c.name === 'India');
    if (!india) return [];

    const states = getStatesByCountryId(india.id);
    const allCities: { label: string; value: string }[] = [];

    states.forEach(state => {
      const stateCities = getCitiesByStateId(state.id);
      stateCities.forEach(city => {
        allCities.push({ label: city.name, value: city.name });
      });
    });

    return allCities;
  }, []);

  const error = touched && !isValidCity(value) ? 'Please select a valid city' : '';

  return (
    <View style={styles.wrapper}>
      <DropDownPicker
        open={open}
        value={value}
        items={cities}
        setOpen={setOpen}
        setValue={setValue}
        placeholder="Select your city"
        searchable={true}
        searchPlaceholder="Search for a city..."
        listMode="FLATLIST"
        maxHeight={300}
        onClose={() => setTouched(true)}

        // 🎨 Themed styles
        style={[
          styles.input,
          error ? styles.inputError : null,
          open ? styles.inputFocused : null,
        ]}
        dropDownContainerStyle={styles.dropdownContainer}
        labelStyle={styles.inputText}
        placeholderStyle={styles.placeholder}
        textStyle={styles.inputText}
        searchContainerStyle={styles.searchContainer}
        searchTextInputStyle={styles.searchInput}
        listItemLabelStyle={styles.listItemLabel}
        selectedItemLabelStyle={styles.selectedItemLabel}
        selectedItemContainerStyle={styles.selectedItemContainer}
        arrowIconStyle={styles.arrowIcon}
        tickIconStyle={styles.tickIcon}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: theme.spacing.marginTop,
    zIndex: 1000,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    paddingHorizontal: theme.spacing.inputPaddingH,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: theme.colors.borderFocused,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputText: {
    color: theme.colors.text,
    fontSize: theme.typography.input.fontSize,
  },
  placeholder: {
    color: theme.colors.placeholder,
    fontSize: theme.typography.input.fontSize,
  },
  dropdownContainer: {
    backgroundColor: theme.colors.dropdownBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.dropdown,
    marginTop: 4,
  },
  searchContainer: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    color: theme.colors.text,
    fontSize: theme.typography.input.fontSize,
    borderColor: 'transparent',
  },
  listItemLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.input.fontSize,
  },
  selectedItemLabel: {
    color: theme.colors.borderFocused,
    fontWeight: '600',
  },
  selectedItemContainer: {
    backgroundColor: theme.colors.selectedItemBackground,
  },
  arrowIcon: {
    tintColor: theme.colors.placeholder,
  },
  tickIcon: {
    tintColor: theme.colors.borderFocused,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.error.fontSize,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default CityInput;