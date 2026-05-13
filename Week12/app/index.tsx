import { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { AndroidImportance } from "expo-notifications/build/NotificationChannelManager.types";
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-notifications/build/NotificationPermissions";
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from "expo-notifications/build/NotificationsEmitter";
import { setNotificationHandler } from "expo-notifications/build/NotificationsHandler";
import type { Notification } from "expo-notifications/build/Notifications.types";
import scheduleNotificationAsync from "expo-notifications/build/scheduleNotificationAsync";
import setNotificationChannelAsync from "expo-notifications/build/setNotificationChannelAsync";
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

setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const defaultCoordinates: Coordinates = {
  latitude: 0,
  longitude: 0,
};

const formatCoordinates = (coords: Coordinates) =>
  `Latitude: ${coords.latitude}\nLongitude: ${coords.longitude}`;

async function registerForLocalNotificationsAsync(): Promise<string> {
  if (Platform.OS === "android") {
    await setNotificationChannelAsync("default", {
      name: "default",
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2563eb",
    });
  }

  const { status: existingStatus } = await getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return "Notification permission not granted.";
  }

  return "Local notifications ready for Expo Go.";
}

export default function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState(
    "Registering notifications..."
  );
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    registerForLocalNotificationsAsync()
      .then((message) => setNotificationStatus(message))
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to register notifications.";
        setNotificationStatus(message);
      });

    const notificationListener = addNotificationReceivedListener(
      (receivedNotification) => {
        setNotification(receivedNotification);
      }
    );

    const responseListener = addNotificationResponseReceivedListener(
      (response) => {
        setNotification(response.notification);
      }
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const showDatabaseNotification = async (
    status: "success" | "failed",
    coords: Coordinates,
    detail?: string
  ) => {
    const title =
      status === "success"
        ? "Data berhasil masuk database"
        : "Data gagal masuk database";
    const body = `${formatCoordinates(coords)}${detail ? `\n${detail}` : ""}`;

    try {
      await scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            status,
            latitude: coords.latitude,
            longitude: coords.longitude,
            detail,
          },
        },
        trigger: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to show notification.";
      setNotificationStatus(message);
    }
  };

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

  const sendTestNotification = async () => {
    const coords = location ?? defaultCoordinates;

    try {
      await showDatabaseNotification(
        "success",
        coords,
        "Test notification from Week12."
      );

      Alert.alert("Success", "Notification sent.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send notification.";
      await showDatabaseNotification("failed", coords, message);
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
      await showDatabaseNotification(
        "success",
        location,
        "Photo and location saved to Supabase."
      );
      Alert.alert("Success", "Photo and location saved to Supabase.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload photo.";
      await showDatabaseNotification("failed", location, message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Week 12 - Notifications</Text>
      <Text style={styles.text}>Hadi Kurniawan - 00000064107</Text>

      <View style={styles.notificationBox}>
        <Text style={styles.label}>Notification status</Text>
        <Text style={styles.value}>{notificationStatus}</Text>
      </View>

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

      <View style={styles.button}>
        <Button
          title="PRESS TO SEND NOTIFICATION"
          onPress={sendTestNotification}
          disabled={loading}
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

      {notification && (
        <View style={styles.notificationBox}>
          <Text style={styles.label}>Last notification</Text>
          <Text style={styles.value}>{notification.request.content.title}</Text>
          <Text style={styles.text}>{notification.request.content.body}</Text>
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
    width: 280,
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
  notificationBox: {
    width: "100%",
    marginBottom: 14,
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
  token: {
    marginTop: 8,
    fontSize: 12,
    color: "#1d4ed8",
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
