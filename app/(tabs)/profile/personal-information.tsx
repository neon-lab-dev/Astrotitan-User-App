import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

import UserIcon from "@/assets/icons/visual/user-circle.svg";

import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import FormInput from "@/components/reusable/InputField/FormInput";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";

import {
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/redux/features/auth/authApi";

import * as ImagePicker from "expo-image-picker";

import { Image } from "expo-image";

import React, {
  useEffect,
  useState,
} from "react";

import { useForm } from "react-hook-form";

import { isValidDate } from "@/utils/validators/dateValidators";

import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type FormValues = {
  firstName: string;

  lastName: string;

  gender: string;

  intents: string[];

  phoneNumber: string;

  email: string;

  dateOfBirth: string;
};

const PersonalInformation = () => {
  /* =======================================================
   * API
   * ======================================================= */

  const { data: userData } =
    useGetMeQuery({});

  const [
    updateProfile,
    {
      isLoading:
      updateLoading,
    },
  ] =
    useUpdateProfileMutation();
  const profile =
    userData?.data?.profile;

  const account =
    userData?.data?.account;


    console.log(userData.data
      
    )

  const {
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",

      lastName: "",

      gender: "",

      intents: [],

      phoneNumber: "",

      email: "",

      dateOfBirth: "",
    },
  });

  const [
    profileImage,
    setProfileImage,
  ] = useState<any>(null);

useEffect(() => {
  if (!profile) return;

  /* FIRST NAME */

  setValue(
    "firstName",
    profile?.firstName || ""
  );

  /* LAST NAME */

  setValue(
    "lastName",
    profile?.lastName || ""
  );

  /* GENDER */

  setValue(
    "gender",
    profile?.gender || ""
  );

  /* INTENTS */

  let formattedIntents =
    [];

  if (
    Array.isArray(
      profile?.intents
    )
  ) {
    formattedIntents =
      profile.intents.filter(
        (
          item: string
        ) =>
          item &&
          item !== "[]"
      );
  }

  setValue(
    "intents",
    formattedIntents
  );

  /* PHONE */

  setValue(
    "phoneNumber",
    account?.phoneNumber ||
      ""
  );

  /* EMAIL */

  setValue(
    "email",
    account?.email || ""
  );

  /* DOB */

  if (
    profile?.dateOfBirth
  ) {
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
      "dateOfBirth",
      formattedDate
    );
  }
}, [profile, account]);

  const pickImage =
    async () => {
      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes:
              ImagePicker
                .MediaTypeOptions
                .Images,

            quality: 0.7,

            allowsEditing:
              true,

            aspect: [1, 1],
          }
        );

      if (
        !result.canceled
      ) {
        setProfileImage(
          result.assets[0]
        );
      }
    };

  /* =======================================================
   * SUBMIT
   * ======================================================= */

  const onSubmit =
    async (
      data: FormValues
    ) => {
      try {
        await updateProfile({
          profilePicture:
            profileImage,

          firstName:
            data.firstName,

          lastName:
            data.lastName,

          gender:
            data.gender,

          intents:
            data.intents,

          phoneNumber:
            data.phoneNumber,

          dateOfBirth:
            data.dateOfBirth,
        }).unwrap();

        console.log(
          "PROFILE UPDATED"
        );
      } catch (error) {
        console.log(
          "UPDATE PROFILE ERROR:",
          error
        );
      }
    };

  /* =======================================================
   * VALIDATION
   * ======================================================= */

  const dob =
    watch("dateOfBirth");

  const isFormValid =
    watch("firstName")
      ?.trim()
      ?.length > 1 &&
    watch("lastName")
      ?.trim()
      ?.length > 1 &&
    watch("gender")
      ?.trim()
      ?.length > 1 &&
    watch("intents")
      ?.length > 0 &&
    isValidDate(dob);

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader>
          <AuthTitle title="Personal information">
            <SansText
              style={{
                lineHeight: 22,
              }}
            >
              Help us tailor
              guidance that feels
              more relevant to
              you.
            </SansText>
          </AuthTitle>
        </AppHeader>

        <View
          style={{
            flex: 1,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,

              paddingTop: 24,

              paddingBottom: 140,

              gap: 20,
            }}
            showsVerticalScrollIndicator={
              false
            }
          >
            {/* PROFILE IMAGE */}
            <View
              style={{
                alignItems:
                  "center",

                gap: 14,
              }}
            >
              <TouchableOpacity
                onPress={
                  pickImage
                }
                activeOpacity={
                  0.8
                }
                style={
                  styles.imageWrapper
                }
              >
                <Image
                  source={
                    profileImage
                      ?.uri
                      ? {
                        uri:
                          profileImage.uri,
                      }
                      : profile?.profilePicture
                        ? {
                          uri:
                            profile.profilePicture,
                        }
                        : require("@/assets/images/dummy/experts/expert1.png")
                  }
                  style={
                    styles.image
                  }
                  contentFit="cover"
                />

                <View
                  style={
                    styles.cameraButton
                  }
                >
                  <UserIcon
                    width={18}
                    height={18}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={
                  pickImage
                }
              >
                <SansText
                  style={{
                    fontSize: 13,

                    textDecorationLine:
                      "underline",
                  }}
                >
                  Upload photo
                </SansText>
              </TouchableOpacity>
            </View>

            {/* EMAIL */}
            <FormInput
              control={control}
              name="email"
              label="Email Address"
              placeholder="Enter email"
              editable={false}
            />

            {/* FIRST NAME */}
            <FormInput
              control={control}
              name="firstName"
              label="First Name"
              placeholder="Enter first name"
              rules={{
                required:
                  "First name is required",
              }}
            />

            {/* LAST NAME */}
            <FormInput
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Enter last name"
              rules={{
                required:
                  "Last name is required",
              }}
            />

            {/* GENDER */}
            <FormInput
              control={control}
              name="gender"
              variant="dropdown"
              label="Gender"
              placeholder="Select your gender"
              dropdownData={[
                {
                  label: "Male",
                  value: "male",
                },
                {
                  label: "Female",
                  value: "female",
                },
                {
                  label:
                    "Non-binary",
                  value:
                    "non_binary",
                },
              ]}
              rules={{
                required:
                  "Please select gender",
              }}
            />

            {/* INTENT */}
            <FormInput
              control={control}
              name="intents"
              variant="dropdown"
              multiple
              label="Intent"
              placeholder="Select intent"
              dropdownData={[
                {
                  label: "Job",
                  value: "job",
                },
                {
                  label:
                    "Education",
                  value:
                    "education",
                },
                {
                  label:
                    "Marriage",
                  value:
                    "marriage",
                },
                {
                  label:
                    "Health",
                  value:
                    "health",
                },
                {
                  label:
                    "Business",
                  value:
                    "business",
                },
                {
                  label: "Love",
                  value: "love",
                },
              ]}
              rules={{
                validate: (
                  value: string[]
                ) =>
                  value?.length >
                  0 ||
                  "Please select at least one intent",
              }}
            />

            {/* PHONE */}
            <FormInput
              control={control}
              name="phoneNumber"
              label="Phone number"
              placeholder="Enter phone number"
              keyboardType="numeric"
            />

            {/* DOB */}
            <FormInput
              control={control}
              name="dateOfBirth"
              label="Date of birth"
              placeholder="DD/MM/YYYY"
              rules={{
                validate: (
                  value: string
                ) =>
                  isValidDate(
                    value
                  ) ||
                  "Invalid DOB",
              }}
            />
          </ScrollView>

          {/* BUTTON */}
          <View
            style={
              styles.bottomContainer
            }
          >
            <ReusableButton
              title="Save changes"
              onPress={handleSubmit(
                onSubmit
              )}
              width="100%"
              loading={
                updateLoading
              }
              disabled={
                !isFormValid ||
                updateLoading
              }
            />
          </View>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default PersonalInformation;

const styles =
  StyleSheet.create({
    imageWrapper: {
      width: 120,

      height: 120,

      borderRadius: 999,

      overflow: "hidden",

      backgroundColor:
        "#E9E9E9",

      justifyContent:
        "center",

      alignItems:
        "center",

      position:
        "relative",
    },

    image: {
      width: "100%",

      height: "100%",
    },

    cameraButton: {
      position:
        "absolute",

      bottom: 8,

      right: 8,

      backgroundColor:
        "#FBF7EB",

      padding: 8,

      borderRadius: 999,
    },

    bottomContainer: {
      position:
        "absolute",

      bottom: 0,

      left: 0,

      right: 0,

      paddingHorizontal: 16,

      paddingTop: 16,

      paddingBottom: 24,

      backgroundColor:
        "#FBF7EB",
    },
  });