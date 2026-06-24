import BookIcon from '@/assets/icons/visual/intent/book.svg';
import BriefcaseIcon from '@/assets/icons/visual/intent/briefcase.svg';
import HeartIcon from '@/assets/icons/visual/intent/favourite.svg';
import MarriageIcon from '@/assets/icons/visual/intent/marriage.svg';
import TieIcon from '@/assets/icons/visual/intent/tie.svg';
import WellnessIcon from '@/assets/icons/visual/intent/wellness.svg';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import NameQuestion from '../../components/userDetailsForm/NameQuestion';
import SelectableOptions from '../../components/reusable/SelectableOptions/SelectableOptions';
import BirthdateQuestion from '../../components/userDetailsForm/BirthdateQuestion';
import TimePicker from '../../components/userDetailsForm/TimePicker';
import CityInput from '../../components/userDetailsForm/CityAutocomplete';
import { useCompleteProfileMutation } from '../../redux/features/auth/authApi';
import QuestionScreen from '../../components/userDetailsForm/QuestionScreen';
import { RootState } from '../../redux/store';
import { Storage } from '../../services/storage/storage';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import AnimatedScreen from '../../components/layout/AnimatedScreen';

const isValidName = (name: string) => {
    const trimmed = name?.trim();
    return /^[A-Za-z\s'-]{2,50}$/.test(trimmed);
};
const isValidDate = (date: string) => {
    if (!date) return false;

    // Format: DD/MM/YYYY
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
const questions = [
    {
        key: 'name',
        initialValue: { firstName: '', lastName: '' }, // ✅
        text: 'What should we call you?',
        description: "This helps personalize your experience.",
        render: ({ value, setValue }: any) => (
            <NameQuestion value={value} setValue={setValue} />
        ),
        validate: (value: any) =>
            isValidName(value.firstName) && isValidName(value.lastName)
    },
    {
        key: 'gender',
        initialValue: '', // ✅
        text: 'Select your gender',
        description: "This helps us generate more accurate insights.",
        render: ({ value, setValue }: any) => (
            <View style={{ marginTop: 24 }}>
                <SelectableOptions
                    options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                        { label: 'Non-binary', value: 'non_binary' },
                    ]}
                    value={value}
                    onChange={setValue}
                />
            </View>
        ),
        validate: (value: string) => !!value
    },
    {
        key: 'birthdate',
        initialValue: '', // 🔥 THIS WAS MISSING
        text: 'Select your date of birth',
        description: "Used to calculate your birth chart accurately.",
        render: ({ value, setValue }: any) => (
            <BirthdateQuestion value={value} setValue={setValue} />
        ),
        validate: (value: string) => isValidDate(value)
    },
    {
        key: 'birthTime',
        text: 'What time were you born?',
        description: 'This helps calculate your chart accurately.',
        initialValue: { hours: '', minutes: '', period: 'AM' },

        render: ({ value, setValue }: any) => (
            <View style={{ alignItems: "center", marginTop: 24 }}>
                <TimePicker value={value} setValue={setValue} />
            </View>
        ),

        validate: (value: any) => {
            return (
                value?.hours &&
                value?.minutes &&
                Number(value.hours) >= 1 &&
                Number(value.hours) <= 12 &&
                Number(value.minutes) >= 0 &&
                Number(value.minutes) <= 59
            );
        }
    },
    {
        key: 'birthPlace',
        initialValue: '',
        text: 'Where were you born?',
        description: 'Enter your city of birth.',

        render: ({ value, setValue }: any) => (
            <CityInput value={value} setValue={setValue} />
        ),

        validate: (value: string) =>
            value?.trim().length > 1
    },
    {
        key: 'guidance',
        initialValue: [], // ✅
        text: 'What would you like guidance on?',
        description: "Select your primary focus areas.",
        render: ({ value, setValue }: any) => (
            <View style={{ marginTop: 24 }}>
                <SelectableOptions
                    options={[
                        { label: 'Wealth & Finance', value: 'Wealth & Finance', icon: TieIcon },
                        { label: 'Education', value: 'Education', icon: BookIcon },
                        { label: 'Marriage', value: 'marriage', icon: MarriageIcon },
                        { label: 'Health & Wellness', value: 'Health & Wellness', icon: WellnessIcon },
                        { label: 'Career Growth', value: 'Career Growth', icon: BriefcaseIcon },
                        { label: 'Love & Relationship', value: 'Love & Relationship', icon: HeartIcon },
                    ]}
                    value={value}
                    onChange={setValue}
                    multiple
                />
            </View>
        ),
        validate: (value: string) => !!value
    },
];

const MultiStepForm = () => {
    const navigation = useNavigation<any>()
    const step = useSelector((state: RootState) => state.userDetailForm.step);
    const [completeProfile] = useCompleteProfileMutation();
    const convertToISO = (date: string) => {
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
    };

    const handleFinalSubmit = async (formData: any) => {
        try {
            const payload = {
                firstName: formData.name.firstName,
                lastName: formData.name.lastName,
                phoneNumber: null,
                gender: formData.gender,
                dateOfBirth: convertToISO(formData.birthdate),
                timeOfBirth: `${formData.birthTime.hours}:${formData.birthTime.minutes} ${formData.birthTime.period}`,
                placeOfBirth: formData.birthPlace,
                intents: formData.guidance.map((g: string) =>
                    g.charAt(0).toUpperCase() + g.slice(1)
                ),
            };

            await completeProfile(payload).unwrap();
            await Storage.setProfileCompleted(true);
            navigation.replace("ProfileCompleted")

        } catch (err) {
            console.log("PROFILE ERROR:", err);
        }
    };

    const currentQuestion = questions[step];

    if (!currentQuestion) return null;

    return (
        <AnimatedScreen>
            <ScreenWrapper>
                <QuestionScreen
                    key={currentQuestion.key}
                    questionKey={currentQuestion.key}
                    questionDescription={currentQuestion.description}
                    questionText={currentQuestion.text}
                    validate={currentQuestion.validate}
                    initialValue={currentQuestion.initialValue}
                    onFinalSubmit={handleFinalSubmit} // 🔥 PASS THIS
                >
                    {currentQuestion.render}
                </QuestionScreen>
            </ScreenWrapper>
        </AnimatedScreen>
    );
};

export default MultiStepForm;