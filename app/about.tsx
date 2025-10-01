import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { GoogleMaps } from "expo-maps";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { showMessage } from "react-native-flash-message";

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

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          showMessage({
            message: "Location permission denied",
            type: "danger",
          });
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        console.log("currentLocation: ", currentLocation);

        let location = currentLocation;
        if (!currentLocation) {
          const lastLocation = await Location.getLastKnownPositionAsync();
          if (!lastLocation) {
            throw new Error("Unable to fetch location");
          }
          location = lastLocation;
        }

        const { latitude, longitude } = location.coords;
        setCameraPosition({
          coordinates: { latitude, longitude },
          zoom: 14,
        });

        const address = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (address.length > 0) {
          const { city, region } = address[0];
          setUserAddress(`${city}, ${region}`);
          console.log(address);
        }
      } catch (error) {
        console.log("Location error:", error);
        showMessage({
          message: "Failed to get location",
          type: "danger",
        });
      }
    };

    getUserLocation();
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
      console.log("Search data:", data);

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
        <Ionicons name="arrow-back" size={24} color="#4cd137" />
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
              title: "Selected Place",
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
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 20,
    elevation: 4,
    marginLeft: 20,
  },
  searchContainer: {
    position: "absolute",
    top: 60,
    left: 30,
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
