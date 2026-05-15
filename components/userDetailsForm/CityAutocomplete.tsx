// components/CityInput.tsx

import AppInput from '@/components/reusable/InputField/AppInput';
import React, { useState } from 'react';
import { View } from 'react-native';

const isValidCity = (text: string) => {
    if (!text) return false;

    const trimmed = text.trim();

    // basic validation
    return /^[A-Za-z\s,'-]{2,50}$/.test(trimmed);
};

const CityInput = ({ value, setValue }: any) => {
    const [touched, setTouched] = useState(false);

    const error =
        touched && !isValidCity(value)
            ? "Enter a valid city name"
            : "";

    return (
        <View style={{ marginTop: 24 }}>
            <AppInput
                value={value || ""}
                onChangeText={(text) => setValue(text)}
                onBlur={() => setTouched(true)}
                placeholder="Enter city (e.g. Pune)"
                error={error}
            />
        </View>
    );
};

export default CityInput;