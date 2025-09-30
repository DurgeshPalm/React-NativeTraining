import { Ionicons } from '@expo/vector-icons';
import { GoogleMaps } from 'expo-maps';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const AboutApp = () => {
  const router = useRouter();
  return (
    <View style={[styles.mapContainer,{flex:1}]}>
       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4cd137" />
        </TouchableOpacity>
      <GoogleMaps.View
                style={{ flex: 1 ,marginTop:20}}
                cameraPosition={{
                  coordinates: {
                    latitude: 22.307159,
                    longitude: 79.187197,
                  },
                  zoom: 13,
                }}
                markers={[
                  {
                    coordinates: {
                      latitude: 22.307159,
                      longitude: 79.187197,
                    },
                    title: "India",
                  }
                ]}
              />
    </View>
  )
}

export default AboutApp

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
  },
})