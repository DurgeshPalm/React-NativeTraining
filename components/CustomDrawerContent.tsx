import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Image, StyleSheet, Text, View } from "react-native";
import { useUser } from "../app/store/UserContext";
import LogoutButton from "./LogoutButton";

const CustomDrawerContent = (props: any) => {
  const { user } = useUser();

  const guestuser = {
    name: user?.name || "Guest User",
    email: user?.email || "Guest@example.com",
    avatar: user?.prpfilePictureUrl || "https://i.pravatar.cc/150?img=3",
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.drawerHeader}>
        <Image source={{ uri: guestuser.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{guestuser.name}</Text>
        <Text style={styles.email}>{guestuser.email}</Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <View style={styles.logoutContainer}>
          <LogoutButton />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: "#4cd137",
    padding: 20,
    alignItems: "center",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  avatar: { width: 70, height: 70, borderRadius: 35, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "white" },
  email: { fontSize: 14, color: "white" },
  logoutContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});
