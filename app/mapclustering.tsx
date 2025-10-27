import Loader from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import MapViewCluster from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface User {
  id: number;
  name: { firstname: string; lastname: string };
  address: {
    geolocation: { lat: string; long: string };
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
}

const users: User[] = [
  {
    address: {
      geolocation: {
        lat: "-37.3159",
        long: "81.1496",
      },
      city: "kilcoole",
      street: "new road",
      number: 7682,
      zipcode: "12926-3874",
    },
    id: 1,
    name: {
      firstname: "john",
      lastname: "doe",
    },
  },
  {
    address: {
      geolocation: {
        lat: "-37.3159",
        long: "81.1496",
      },
      city: "kilcoole",
      street: "Lovers Ln",
      number: 7267,
      zipcode: "12926-3874",
    },
    id: 2,
    name: {
      firstname: "david",
      lastname: "morrison",
    },
  },
  {
    address: {
      geolocation: {
        lat: "40.3467",
        long: "-30.1310",
      },
      city: "Cullman",
      street: "Frances Ct",
      number: 86,
      zipcode: "29567-1452",
    },
    id: 3,
    name: {
      firstname: "kevin",
      lastname: "ryan",
    },
  },
  {
    address: {
      geolocation: {
        lat: "50.3467",
        long: "-20.1310",
      },
      city: "San Antonio",
      street: "Hunters Creek Dr",
      number: 6454,
      zipcode: "98234-1734",
    },
    id: 4,
    name: {
      firstname: "don",
      lastname: "romer",
    },
  },
  {
    address: {
      geolocation: {
        lat: "40.3467",
        long: "-40.1310",
      },
      city: "san Antonio",
      street: "adams St",
      number: 245,
      zipcode: "80796-1234",
    },
    id: 5,
    name: {
      firstname: "derek",
      lastname: "powell",
    },
  },
  {
    address: {
      geolocation: {
        lat: "20.1677",
        long: "-10.6789",
      },
      city: "el paso",
      street: "prospect st",
      number: 124,
      zipcode: "12346-0456",
    },
    id: 6,
    name: {
      firstname: "david",
      lastname: "russell",
    },
  },
  {
    address: {
      geolocation: {
        lat: "10.3456",
        long: "20.6419",
      },
      city: "fresno",
      street: "saddle st",
      number: 1342,
      zipcode: "96378-0245",
    },
    id: 7,
    name: {
      firstname: "miriam",
      lastname: "snyder",
    },
  },
  {
    address: {
      geolocation: {
        lat: "50.3456",
        long: "10.6419",
      },
      city: "mesa",
      street: "vally view ln",
      number: 1342,
      zipcode: "96378-0245",
    },
    id: 8,
    name: {
      firstname: "william",
      lastname: "hopkins",
    },
  },
  {
    address: {
      geolocation: {
        lat: "40.12456",
        long: "20.5419",
      },
      city: "miami",
      street: "avondale ave",
      number: 345,
      zipcode: "96378-0245",
    },
    id: 9,
    name: {
      firstname: "kate",
      lastname: "hale",
    },
  },
  {
    address: {
      geolocation: {
        lat: "30.24788",
        long: "-20.545419",
      },
      city: "fort wayne",
      street: "oak lawn ave",
      number: 526,
      zipcode: "10256-4532",
    },
    id: 10,
    name: {
      firstname: "jimmie",
      lastname: "klein",
    },
  },
];

const UsersMap = () => {
  const [region, setRegion] = useState<any>(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }
      setLocationGranted(true);

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 40,
        longitudeDelta: 40,
      });
    })();
  }, []);

  if (!region)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </View>
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#4cd137" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
        />
        <TouchableOpacity>
          <Ionicons name="search" size={22} color="#4cd137" />
        </TouchableOpacity>
      </View>

      <MapViewCluster
        style={styles.map}
        region={region}
        provider={PROVIDER_GOOGLE}
        clusterColor="#4cd137"
        radius={50}
      >
        {users.map((user) => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: parseFloat(user.address.geolocation.lat),
              longitude: parseFloat(user.address.geolocation.long),
            }}
            title={`${user.name.firstname} ${user.name.lastname}`}
            description={user.address.city}
          />
        ))}

        {locationGranted && (
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="You are here"
            pinColor="blue"
          />
        )}
      </MapViewCluster>
    </View>
  );
};

export default UsersMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, marginHorizontal: 10, borderRadius: 15, overflow: "hidden" },
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

// import Loader from "@/components/Loader";
// import { Ionicons } from "@expo/vector-icons";
// import Geolocation from "@react-native-community/geolocation";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   PermissionsAndroid,
//   Platform,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import MapViewCluster from "react-native-map-clustering";
// import { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// interface User {
//   id: number;
//   name: { firstname: string; lastname: string };
//   address: {
//     geolocation: { lat: string; long: string };
//     city: string;
//     street: string;
//     number: number;
//     zipcode: string;
//   };
// }

// const users: User[] = [
//   {
//     address: {
//       geolocation: {
//         lat: "-37.3159",
//         long: "81.1496",
//       },
//       city: "kilcoole",
//       street: "new road",
//       number: 7682,
//       zipcode: "12926-3874",
//     },
//     id: 1,
//     name: {
//       firstname: "john",
//       lastname: "doe",
//     },
//   },
//   {
//     address: {
//       geolocation: {
//         lat: "-37.3159",
//         long: "81.1496",
//       },
//       city: "kilcoole",
//       street: "Lovers Ln",
//       number: 7267,
//       zipcode: "12926-3874",
//     },
//     id: 2,
//     name: {
//       firstname: "david",
//       lastname: "morrison",
//     },
//   },
//   {
//     address: {
//       geolocation: {
//         lat: "40.3467",
//         long: "-30.1310",
//       },
//       city: "Cullman",
//       street: "Frances Ct",
//       number: 86,
//       zipcode: "29567-1452",
//     },
//     id: 3,
//     name: {
//       firstname: "kevin",
//       lastname: "ryan",
//     },
//   },
//   {
//     address: {
//       geolocation: {
//         lat: "50.3467",
//         long: "-20.1310",
//       },
//       city: "San Antonio",
//       street: "Hunters Creek Dr",
//       number: 6454,
//       zipcode: "98234-1734",
//     },
//     id: 4,
//     name: {
//       firstname: "don",
//       lastname: "romer",
//     },
//   },
//   {
//     address: {
//       geolocation: {
//         lat: "40.3467",
//         long: "-40.1310",
//       },
//       city: "san Antonio",
//       street: "adams St",
//       number: 245,
//       zipcode: "80796-1234",
//     },
//     id: 5,
//     name: {
//       firstname: "derek",
//       lastname: "powell",
//     },
//   },
//   {
//     address: {
//       geolocation: {
//         lat: "20.1677",
//         long: "-10.6789",
//       },
//       city: "el paso",
//       street: "prospect st",
//       number: 124,
//       zipcode: "12346-0456",
//     },
//     id: 6,
//     name: {
//       firstname: "david",
//       lastname: "russell",
//     },
//   },
//   {
//     address: {
//       geolocation: {
//         lat: "10.3456",
//         long: "20.6419",
//       },
//       city: "fresno",
//       street: "saddle st",
//       number: 1342,
//       zipcode: "96378-0245",
//     },
//     id: 7,
//     name: {
//       firstname: "miriam",
//       lastname: "snyder",
//     },
//   },
//   {
//     address: {
//       geolocation: {
//         lat: "50.3456",
//         long: "10.6419",
//       },
//       city: "mesa",
//       street: "vally view ln",
//       number: 1342,
//       zipcode: "96378-0245",
//     },
//     id: 8,
//     name: {
//       firstname: "william",
//       lastname: "hopkins",
//     },
//   },
//   {
//     address: {
//       geolocation: {
//         lat: "40.12456",
//         long: "20.5419",
//       },
//       city: "miami",
//       street: "avondale ave",
//       number: 345,
//       zipcode: "96378-0245",
//     },
//     id: 9,
//     name: {
//       firstname: "kate",
//       lastname: "hale",
//     },
//   },
//   {
//     address: {
//       geolocation: {
//         lat: "30.24788",
//         long: "-20.545419",
//       },
//       city: "fort wayne",
//       street: "oak lawn ave",
//       number: 526,
//       zipcode: "10256-4532",
//     },
//     id: 10,
//     name: {
//       firstname: "jimmie",
//       lastname: "klein",
//     },
//   },
// ];

// const UsersMap = () => {
//   const [region, setRegion] = useState<any>(null);
//   const [locationGranted, setLocationGranted] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const requestPermission = async () => {
//       if (Platform.OS === "android") {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: "Location Permission",
//             message: "App needs access to your location to show map position",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK",
//           }
//         );

//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           console.log("Location permission denied");
//           return;
//         }
//       }
//       setLocationGranted(true);

//       Geolocation.getCurrentPosition(
//         (position) => {
//           console.log("Current Position:", position);
//           const { latitude, longitude } = position.coords;

//           setRegion({
//             latitude,
//             longitude,
//             latitudeDelta: 40,
//             longitudeDelta: 40,
//           });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 10000,
//         }
//       );
//     };

//     requestPermission();
//   }, []);

//   if (!region)
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Loader />
//       </View>
//     );

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//         <Ionicons name="arrow-back" size={28} color="#4cd137" />
//       </TouchableOpacity>

//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for a location..."
//         />
//         <TouchableOpacity>
//           <Ionicons name="search" size={22} color="#4cd137" />
//         </TouchableOpacity>
//       </View>

//       <MapViewCluster
//         style={styles.map}
//         region={region}
//         provider={PROVIDER_GOOGLE}
//         clusterColor="#4cd137"
//         radius={50}
//       >
//         {users.map((user) => (
//           <Marker
//             key={user.id}
//             coordinate={{
//               latitude: parseFloat(user.address.geolocation.lat),
//               longitude: parseFloat(user.address.geolocation.long),
//             }}
//             title={`${user.name.firstname} ${user.name.lastname}`}
//             description={user.address.city}
//           />
//         ))}

//         {locationGranted && (
//           <Marker
//             coordinate={{
//               latitude: region.latitude,
//               longitude: region.longitude,
//             }}
//             title="You are here"
//             pinColor="blue"
//           />
//         )}
//       </MapViewCluster>
//     </View>
//   );
// };

// export default UsersMap;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1, marginHorizontal: 10, borderRadius: 15, overflow: "hidden" },
//   backButton: {
//     marginLeft: 20,
//     marginTop: 40,
//   },
//   searchContainer: {
//     position: "absolute",
//     top: 80,
//     left: 20,
//     right: 20,
//     backgroundColor: "white",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     elevation: 5,
//     zIndex: 20,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//   },
// });
