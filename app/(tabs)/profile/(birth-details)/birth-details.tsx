import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import FormInput from "@/components/reusable/InputField/FormInput";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";

import {
  formatDate,
  formatTime,
  isValidDate,
  isValidTime,
} from "@/utils/validators/dateValidators";

import React, { useEffect } from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useUpdateProfileMutation } from "@/redux/features/auth/authApi";
import { RootState } from "@/redux/store";
import {
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";

type FormValues = {
  dob: string;
  time: string;
  place: string;
};

const BirthDetails = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      dob: "",
      time: "",
      place: "",
    },
    mode: "onChange",
  });
  const [
    updateProfile,
    {
      isLoading:
      updateLoading,
    },
  ] = useUpdateProfileMutation();
  const dob = watch("dob");
  const time = watch("time");
  const place = watch("place");
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user)
  useEffect(() => {
    const profile =
      user?.profile;
    if (!profile) return;
    /* DATE */
    if (profile?.dateOfBirth) {
      const date =
        new Date(
          profile.dateOfBirth
        );
      const formattedDate = `${String(
        date.getDate()
      ).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;
      setValue(
        "dob",
        formattedDate
      );
    }

    /* TIME */

    if (profile?.timeOfBirth) {
      setValue(
        "time",
        profile.timeOfBirth
      );
    }
    if (profile?.placeOfBirth) {
      setValue(
        "place",
        profile.placeOfBirth
      );
    }
  }, [user]);

  const isFormValid =
    isValidDate(dob) &&
    isValidTime(time) &&
    place?.trim()?.length > 2;


  const onSubmit = async (
    data: FormValues
  ) => {
    try {
      const res=await updateProfile({
        dateOfBirth:
          data.dob,

        timeOfBirth:
          data.time,

        placeOfBirth:
          data.place,
      }).unwrap();

      console.log(
        "PROFILE UPDATED",res
      );
    } catch (error) {
      console.log(
        "UPDATE PROFILE ERROR:",
        error
      );
    }
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={40}
            contentContainerStyle={
              styles.scrollContent
            }
          >
            {/* HEADER */}

            <AppHeader>
              <AuthTitle title="Birth details" />
            </AppHeader>

            {/* FORM */}

            <View
              style={
                styles.formContainer
              }
            >
              {/* DOB */}

              <FormInput
                control={control}
                name="dob"
                label="Birth Date"
                placeholder="DD/MM/YYYY"
                maxLength={10}
                rules={{
                  required:
                    "Birth date is required",

                  validate: (
                    value: string
                  ) =>
                    isValidDate(
                      value
                    ) ||
                    "Enter valid birth date",
                }}
                onChangeText={(
                  text: string
                ) => {
                  return formatDate(
                    text
                  );
                }}
              />

              {/* TIME */}

              <FormInput
                control={control}
                name="time"
                label="Birth Time"
                placeholder="09:30 AM"
                autoCapitalize="characters"
                maxLength={8}
                rules={{
                  validate: (
                    value: string
                  ) =>
                    isValidTime(
                      value
                    ) ||
                    "Enter valid birth time",
                }}
                onChangeText={(
                  text: string
                ) => {
                  return formatTime(
                    text
                  );
                }}
              />

              {/* PLACE */}

              <FormInput
                control={control}
                name="place"
                label="Birth Place"
                placeholder="Enter city, state, country...."
                rules={{
                  required:
                    "Birth place is required",

                  minLength: {
                    value: 3,
                    message:
                      "Enter valid birth place",
                  },

                  validate: (
                    value: string
                  ) =>
                    /^[a-zA-Z\s,.-]+$/.test(
                      value
                    ) ||
                    "Invalid characters entered",
                }}
              />
            </View>
          </KeyboardAwareScrollView>

          {/* FIXED BOTTOM */}

          {isFormValid && (
            <View
              style={
                styles.bottomContainer
              }
            >
              <ReusableButton
                title="Save Birth Details"
                onPress={handleSubmit(
                  onSubmit
                )}
                width="100%"
                loading={updateLoading}
                disabled={updateLoading}
              />

              <SansText
                style={
                  styles.footerText
                }
              >
                These details are
                used to generate
                accurate charts &
                insights
              </SansText>
            </View>
          )}
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default BirthDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 140,
  },

  formContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 14,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: "#F7F1DF", gap: 10,
  },

  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#777",
    lineHeight: 16,
  },
});