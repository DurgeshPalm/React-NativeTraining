import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { GoogleMaps } from "expo-maps";
import { useRouter } from "expo-router";
import * as TaskManager from "expo-task-manager";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { LOCATION_TASK_NAME } from "./background-location-task";

const GOOGLE_API_KEY = "AIzaSyBYV7xf7gDYvtDzdKD_GHJm8H6SIeJup5k";

const AboutApp = () => {
  const router = useRouter();
  const mapRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [cameraPosition, setCameraPosition] = useState({
    coordinates: { latitude: 20.5937, longitude: 78.9629 },
    zoom: 13,
  });

  // ✅ Get User’s Current Location
  const getUserLocation = async () => {
    try {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        showMessage({
          message: "Location permission denied",
          type: "danger",
        });
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const { city, region } = address[0];
        setUserAddress(`${city || ""}, ${region || ""}`);
        console.log(" Address:", address);
      }

      // Move map camera to user location
      setCameraPosition({
        coordinates: { latitude, longitude },
        zoom: 15,
      });
    } catch (error) {
      console.log("❌ Location error:", error);
      showMessage({
        message: "Failed to get location",
        type: "danger",
      });
    }
  };

  // ✅ Start Background Tracking
  const startBackgroundTracking = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== "granted") {
      showMessage({
        message: "Location permission denied",
        type: "danger",
      });
      return;
    }

    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus !== "granted") {
      showMessage({
        message: "Background location permission denied",
        type: "danger",
      });
      return;
    }

    const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );

    if (!hasStarted && isTaskDefined) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 50, // meters
        timeInterval: 10000, // milliseconds
        pausesUpdatesAutomatically: false,
        foregroundService: {
          notificationTitle: "Tracking your location",
          notificationBody: "We are getting your location in background.",
          notificationColor: "#4cd137",
        },
      });
      console.log("✅ Background location tracking started");
    }
  };

  useEffect(() => {
    getUserLocation();
    startBackgroundTracking();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    console.log("Searching for:", searchQuery);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          searchQuery
        )}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setCameraPosition({
          coordinates: { latitude: lat, longitude: lng },
          zoom: 14,
        });
      } else {
        showMessage({
          message: "No results found",
          type: "warning",
        });
      }
    } catch (error) {
      console.log("Search error:", error);
      showMessage({
        message: "Error searching location",
        type: "danger",
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#4cd137" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={22} color="#4cd137" />
        </TouchableOpacity>
      </View>

      <View style={[styles.mapContainer, { flex: 1 }]}>
        <GoogleMaps.View
          ref={mapRef}
          style={{ flex: 1, marginTop: 20 }}
          cameraPosition={cameraPosition}
          markers={[
            {
              coordinates: cameraPosition.coordinates,
              title: userAddress || "Your Location",
            },
          ]}
        />
      </View>
    </View>
  );
};

export default AboutApp;

const styles = StyleSheet.create({
  mapContainer: {
    marginTop: 40,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  backButton: {
    marginLeft: 20,
    marginTop: 40,
  },
  searchContainer: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 5,
    zIndex: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});
