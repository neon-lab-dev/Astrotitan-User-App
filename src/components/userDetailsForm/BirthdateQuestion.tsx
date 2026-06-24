import React, { useState } from 'react';
import { View } from 'react-native';
import AppInput from '../reusable/InputField/AppInput';

/**
 * Simple formatter (NO aggressive correction)
 */
const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 8);

    let result = '';

    if (cleaned.length >= 1) {
        result += cleaned.slice(0, 2);
    }

    if (cleaned.length >= 3) {
        result += '/' + cleaned.slice(2, 4);
    }

    if (cleaned.length >= 5) {
        result += '/' + cleaned.slice(4, 8);
    }

    return result;
};

/**
 * Validate real date
 */
const isValidDate = (date: string) => {
    if (!date) return false;

    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    if (!regex.test(date)) return false;

    const [day, month, year] = date.split('/').map(Number);
    const d = new Date(year, month - 1, day);

    return (
        d.getFullYear() === year &&
        d.getMonth() === month - 1 &&
        d.getDate() === day
    );
};

const BirthdateQuestion = ({ value, setValue }: any) => {
    const [touched, setTouched] = useState(false);
    
    const isComplete = value?.length === 10;

    const error =
        (touched || isComplete) && !isValidDate(value)
            ? "Please enter a valid date (DD/MM/YYYY)"
            : "";

    return (
        <View style={{ marginTop: 24 }}>
            <AppInput
                value={value || ""}
                onChangeText={(text) => {
                    const formatted = formatDate(text);
                    setValue(formatted);
                }}
                onBlur={() => setTouched(true)}
                placeholder="DD/MM/YYYY"
                keyboardType="numeric"
                maxLength={10} // 🔥 important
                error={error}
            />
        </View>
    );
};

export default BirthdateQuestion;