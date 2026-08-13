

import React, {
  useMemo,
  useState,
} from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useForm,
} from "react-hook-form";
import { pickMultipleImages } from "../../../../utils/upload/pickMultipleImages";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";
import { SansText } from "../../../../components/reusable/Text/SansText";
import FormInput from "../../../../components/reusable/InputField/FormInput";
import AddIcon  from '@/assets/icons/actions/add.svg';
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";

type FormValues = {
  review: string;
};

const WriteReview = () => {
  const {
    control,
    handleSubmit,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      review: "",
    },

    mode: "onChange",
  });

  const [images, setImages] =
    useState<any[]>([]);

  /* ---------------- WATCH ---------------- */

  const review = watch("review");

  /* ---------------- VALIDATION ---------------- */

  const isFormValid =
    useMemo(() => {
      return (
        review?.trim()?.length >=
        10
      );
    }, [review]);

  /* ---------------- IMAGE PICK ---------------- */

  const handlePickImages =
    async () => {
      const selectedImages =
        await pickMultipleImages();

      if (
        selectedImages.length > 0
      ) {
        setImages((prev) => [
          ...prev,
          ...selectedImages,
        ]);
      }
    };

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = (
    data: FormValues
  ) => {
    const payload = {
      ...data,

      images,
    };

    console.log(
      "REVIEW DATA:",
      payload
    );
  };

  const order = {
    id: "#AT-483921",

    title: "5 Mukhi Rudraksha Mala",

    image: require("@/assets/images/dummy/gems/gems1.png"),
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          {/* HEADER */}

          <AppHeader>
            <View
              style={styles.productRow}
            >
              <Image
                source={order.image}
                style={styles.image}
              />

              <View
                style={{ flex: 1 }}
              >
                <SatoshiText
                  style={
                    styles.productTitle
                  }
                >
                  {order.title}
                </SatoshiText>

                <SansText
                  style={styles.orderId}
                >
                  {order.id}
                </SansText>
              </View>
            </View>
          </AppHeader>

          {/* CONTENT */}

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.scrollContent
            }
          >
            {/* REVIEW */}

            <View style={styles.section}>
              <SatoshiText
                style={styles.sectionTitle}
              >
                Write a review
              </SatoshiText>

              <FormInput
                control={control}
                name="review"
                placeholder="Ex - Exceptional Quality & Safe Delivery....."
                multiline
                numberOfLines={7}
                inputStyle={{
                  height: 150,

                  textAlignVertical:
                    "top",

                  paddingTop: 18,
                }}
                rules={{
                  required:
                    "Review is required",

                  minLength: {
                    value: 10,

                    message:
                      "Minimum 10 characters required",
                  },
                }}
              />
            </View>

            {/* DIVIDER */}

            <View style={styles.divider} />

            {/* PHOTOS */}

            <View style={styles.section}>
              <SatoshiText
                style={styles.sectionTitle}
              >
                Upload photos
              </SatoshiText>

              <SansText
                style={
                  styles.sectionSubtitle
                }
              >
                Upload images to help
                other customers have a
                look of product quality
                and usage.
              </SansText>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={{
                  gap: 12,
                  marginTop: 16,
                }}
              >
                {/* ADD */}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={
                    handlePickImages
                  }
                  style={
                    styles.uploadBox
                  }
                >
                  <AddIcon
                    width={22}
                    height={22}
                  />

                  <SatoshiText
                    style={
                      styles.uploadText
                    }
                  >
                    Add{"\n"}Photo
                  </SatoshiText>
                </TouchableOpacity>

                {/* PREVIEW */}

                {images.map(
                  (
                    item,
                    index
                  ) => (
                    <Image
                      key={index}
                      source={{
                        uri: item.uri,
                      }}
                      style={
                        styles.previewImage
                      }
                    />
                  )
                )}
              </ScrollView>
            </View>
          </ScrollView>

          {/* BUTTON */}

          {isFormValid && (
            <View
              style={
                styles.bottomContainer
              }
            >
              <ReusableButton
                title="Submit Review"
                width="100%"
                onPress={handleSubmit(
                  onSubmit
                )}
              />
            </View>
          )}
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default WriteReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  productRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,
  },

  image: {
    width: 83,

    height: 83,

    borderRadius: 14,
  },

  productTitle: {
    fontSize: 16,

    color: "#0D0D0D",

    lineHeight: 24,

    fontFamily: "Satoshi-Bold",
  },

  orderId: {
    marginTop: 2,

    fontSize: 14,

    color: "#0D0D0D",

    fontFamily: "Satoshi-Bold",
  },

  section: {
    marginTop: 18,

    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 21,

    color: "#0D0D0D",

    fontFamily: "Satoshi-Bold",

    marginBottom: 12,
  },

  sectionSubtitle: {
    fontSize: 14,

    lineHeight: 22,

    color: "#4A4A4A",
  },

  divider: {
    height: 1,

    backgroundColor: "#E4D7AE",

    marginTop: 16,

    marginHorizontal: 16,
  },

  uploadBox: {
    width: 100,

    height: 100,

    borderRadius: 14,

    borderWidth: 1,

    borderColor: "#D4AF37",

    backgroundColor: "#FBF7EB",

    justifyContent: "center",

    alignItems: "center",

    gap: 8,
  },

  uploadText: {
    textAlign: "center",

    fontSize: 14,

    lineHeight: 22,

    color: "#0D0D0D",

    fontFamily: "Satoshi-Bold",
  },

  previewImage: {
    width: 100,

    height: 100,

    borderRadius: 14,
  },

  bottomContainer: {
    position: "absolute",

    bottom: 0,

    left: 0,

    right: 0,

    paddingHorizontal: 16,

    paddingTop: 16,

    paddingBottom: 24,

    backgroundColor: "#F7F1DF",

    borderTopWidth: 1,

    borderTopColor: "#E4D7AE",
  },
});