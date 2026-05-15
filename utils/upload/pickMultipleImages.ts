import * as ImagePicker from "expo-image-picker";

export const pickMultipleImages = async () => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      throw new Error("Gallery permission denied");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsMultipleSelection: true,

      quality: 1,

      selectionLimit: 5,
    });

    if (result.canceled) {
      return [];
    }

    return result.assets;
  } catch (error) {
    console.log("IMAGE PICK ERROR:", error);

    return [];
  }
};
