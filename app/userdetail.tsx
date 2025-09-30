import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get("window");

export default function UserDetail() {
  const { user } = useLocalSearchParams();
  const parsedUser = JSON.parse(user as any);
  const router = useRouter();
  const latitude = parsedUser?.address?.geo?.lat? parseFloat(parsedUser.address.geo.lat) : 21.20101714481972;
  const longitude = parsedUser?.address?.geo?.lng ? parseFloat(parsedUser.address.geo.lng)  : 72.79291918286205;
  console.log(latitude,longitude);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Ionicons name="person-circle" size={80} color="#fff" />
        <Text style={styles.headerName}>{parsedUser.name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={22} color="#4cd137" />
          <Text style={styles.text}>{parsedUser.username}</Text>
        </View>

        <View style={styles.row}>
          <MaterialIcons name="cake" size={22} color="#4cd137" />
          <Text style={styles.text}>Birthday</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="call-outline" size={22} color="#4cd137" />
          <Text style={styles.text}>{parsedUser.phone}</Text>
        </View>

        <View style={styles.row}>
          <MaterialIcons name="place" size={20} color="#4cd137" />
          <Text style={styles.text}>{parsedUser.address.city}</Text>
        </View>

        <View style={styles.row}>
          <MaterialIcons name="email" size={22} color="#4cd137" />
          <Text style={styles.text}>{parsedUser.email}</Text>
        </View>

       <View style={styles.row}>
          <Ionicons name="location-outline" size={20} color="#4cd137" />
          <Text style={styles.infoText}>{parsedUser?.address.zipcode || "Zip Code"}</Text>
        </View>
      </View>
    <View style={styles.mapContainer}>
    <MapView
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.05,  
        longitudeDelta: 0.05,
      }}
    >
      <Marker 
        coordinate={{ latitude, longitude }} 
        title={parsedUser?.name} 
      />
    </MapView>
  </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#4cd137",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: {
    position: "absolute",
    top: 40, // safe margin for status bar
    left: 20,
    zIndex: 10,
  },
  headerName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  infoText: { marginLeft: 15, fontSize: 16, color: "#333" },
  mapContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: "hidden",
    height: height * 0.25,
  },
  map: { width: "100%", height: "100%" },
  
});
