import { useState } from "react";
import { Camera } from "expo-camera";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import {
  Alert,
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { photoBucket, photoTable, supabase } from "../lib/supabase";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async (): Promise<Coordinates | null> => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required!");
      return null;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    return {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
  };

  const openCamera = async () => {
    const permission = await Camera.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission denied", "Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const coords = await getCurrentLocation();

      setImage(result.assets[0].uri);
      setLocation(coords);
      setImageUrl(null);
    }
  };

  const saveImage = async () => {
    if (!image) return;

    try {
      const needsSavePermission =
        Platform.OS !== "android" || Number(Platform.Version) < 33;

      if (needsSavePermission) {
        const permission = await MediaLibrary.requestPermissionsAsync(true);

        if (!permission.granted) {
          Alert.alert("Permission denied", "Gallery permission is required!");
          return;
        }
      }

      await MediaLibrary.saveToLibraryAsync(image);

      Alert.alert("Success", "Image saved to gallery");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save image.";
      Alert.alert("Error", message);
    }
  };

  const uploadToSupabase = async () => {
    if (!image) {
      Alert.alert("No photo", "Please take a photo first.");
      return;
    }

    if (!location) {
      Alert.alert("No location", "Please allow location before uploading.");
      return;
    }

    try {
      setLoading(true);

      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: "base64",
      });
      const filePath = `camera/photo-${Date.now()}.jpeg`;

      const { error: uploadError } = await supabase.storage
        .from(photoBucket)
        .upload(filePath, decode(base64), {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(photoBucket)
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: insertError } = await supabase.from(photoTable).insert([
        {
          latitude: String(location.latitude),
          longitude: String(location.longitude),
          image_url: publicUrl,
        },
      ]);

      if (insertError) throw insertError;

      setImageUrl(publicUrl);
      Alert.alert("Success", "Photo and location saved to Supabase.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload photo.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Week 11 - Supabase</Text>
      <Text style={styles.text}>Hadi Kurniawan - 00000064107</Text>

      <View style={styles.button}>
        <Button title="OPEN CAMERA" onPress={openCamera} disabled={loading} />
      </View>

      <View style={styles.button}>
        <Button
          title={loading ? "UPLOADING..." : "UPLOAD TO SUPABASE"}
          onPress={uploadToSupabase}
          disabled={!image || !location || loading}
        />
      </View>

      {image && (
        <View style={styles.button}>
          <Button title="SAVE IMAGE" onPress={saveImage} disabled={loading} />
        </View>
      )}

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {location && (
        <View style={styles.locationBox}>
          <Text style={styles.label}>Latitude</Text>
          <Text style={styles.value}>{location.latitude}</Text>
          <Text style={styles.label}>Longitude</Text>
          <Text style={styles.value}>{location.longitude}</Text>
        </View>
      )}

      {imageUrl && (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>Data saved</Text>
          <Text style={styles.url}>{imageUrl}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f6f8fb",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#132238",
  },
  text: {
    marginBottom: 18,
    color: "#334155",
  },
  button: {
    marginVertical: 5,
    width: 220,
  },
  image: {
    width: 280,
    height: 220,
    marginTop: 18,
    borderRadius: 8,
    backgroundColor: "#dbe4ef",
  },
  locationBox: {
    width: "100%",
    marginTop: 18,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    marginTop: 8,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: "#0f172a",
  },
  successBox: {
    width: "100%",
    marginTop: 14,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#e8f7ef",
  },
  successTitle: {
    fontWeight: "700",
    color: "#166534",
    marginBottom: 6,
  },
  url: {
    color: "#14532d",
  },
});
