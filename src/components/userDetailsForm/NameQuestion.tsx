
import React, { useState } from 'react';
import { View } from 'react-native';
import AppInput from '../reusable/InputField/AppInput';

const isValidName = (name: string) => {
    const trimmed = name?.trim();
    return /^[A-Za-z\s'-]{2,50}$/.test(trimmed);
};

const NameQuestion = ({ value, setValue }: any) => {
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
    });

    const firstName = value?.firstName || '';
    const lastName = value?.lastName || '';

    const errors = {
        firstName:
            touched.firstName && !isValidName(firstName)
                ? "Please enter a valid first name."
                : "",
        lastName:
            touched.lastName && !isValidName(lastName)
                ? "Please enter a valid last name."
                : "",
    };

    return (
        <View style={{ gap: 16, marginTop: 24 }}>
            <AppInput
                value={firstName}
                onChangeText={(text) => {
                    setTouched((prev) => ({ ...prev, firstName: true }));
                    setValue({ ...value, firstName: text });
                }}
                onBlur={() =>
                    setTouched((prev) => ({ ...prev, firstName: true }))
                }
                error={errors.firstName}
                placeholder="Enter first name"
            />

            <AppInput
                value={lastName}
                onChangeText={(text) => {
                    setTouched((prev) => ({ ...prev, lastName: true }));
                    setValue({ ...value, lastName: text });
                }}
                onBlur={() =>
                    setTouched((prev) => ({ ...prev, lastName: true }))
                }
                error={errors.lastName}
                placeholder="Enter last name"
            />
        </View>
    );
};

export default NameQuestion;