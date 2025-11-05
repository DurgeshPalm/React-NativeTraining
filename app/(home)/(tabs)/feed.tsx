import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUploadPhoto } from "../../../hooks/useUploadPhoto";

// ✅ static test values
const STATIC_USER_ID = 90;
const STATIC_TOKEN = "PASTE_YOUR_LOGIN_TOKEN_HERE"; // from login response

interface SelectedImage {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
  fileName?: string;
}

const UploadPhotoScreen: React.FC = () => {
  const { mutate, isPending } = useUploadPhoto();
  const [image, setImage] = useState<SelectedImage | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const file: SelectedImage = {
        uri: asset.uri,
        type: "image/jpeg",
        fileName: asset.fileName ?? "photo.jpg",
        width: asset.width,
        height: asset.height,
      };

      setImage(file);

      mutate(
        { userId: STATIC_USER_ID, file, token: STATIC_TOKEN },
        {
          onSuccess: (res) => {
            Alert.alert("✅ Upload Success", res.message);
          },
          onError: (err) => {
            console.log(err);
            Alert.alert("❌ Upload Failed", "Please try again");
          },
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Profile Image</Text>

      {image && <Image source={{ uri: image.uri }} style={styles.image} />}

      <TouchableOpacity
        style={styles.button}
        onPress={pickImage}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Choose Image</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UploadPhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 15 },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#3498db",
  },
  button: { backgroundColor: "#3498db", padding: 14, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16 },
});
