import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const settingsOptions = [
    {
      label: "Edit Profile",
      icon: require("../../../../assets/editprofileicon.png"),
      route: "/minomp/(tabs)/(settings)/editprofile",
    },
    {
      label: "Language",
      icon: require("../../../../assets/languageicon.png"),
      route: "/minomp/(tabs)/(settings)/language",
    },
    {
      label: "Connect with parent",
      icon: require("../../../../assets/connectparenticon.png"),
      route: "/minomp/(tabs)/(settings)/connectwithparentkid",
    },
    {
      label: "Change password",
      icon: require("../../../../assets/changepasswordicon.png"),
      route: "/minomp/(tabs)/(settings)/changepassword",
    },
    {
      label: "Privacy Policy",
      icon: require("../../../../assets/privacypolicyicon.png"),
      route: "/minomp/(tabs)/(settings)/privacypolicy",
    },
    {
      label: "Terms & Conditions",
      icon: require("../../../../assets/termsicon.png"),
      route: "/minomp/(tabs)/(settings)/terms",
    },
    {
      label: "Delete Account",
      icon: require("../../../../assets/deleteicon.png"),
      onPress: () => setDeleteVisible(true),
    },
    {
      label: "Logout",
      icon: require("../../../../assets/logouticon.png"),
      onPress: () => setLogoutVisible(true),
    },
  ];

  return (
    <ImageBackground
      source={require("../../../../assets/minompback.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
      imageStyle={{ opacity: 0.06 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>SETTINGS</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {settingsOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              activeOpacity={0.8}
              onPress={() =>
                item.route ? router.push(item.route as any) : item.onPress?.()
              }
            >
              <View style={styles.leftSection}>
                <Image source={item.icon} style={styles.icon} />
                <Text style={styles.optionText}>{item.label}</Text>
              </View>
              <Image
                source={require("../../../../assets/rightarrow.png")}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 🔹 Logout Modal */}
        <Modal visible={logoutVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Image
                source={require("../../../../assets/logouticonbig.png")}
                style={styles.modalIcon}
              />
              <Text style={styles.modalText}>
                Are you sure you want to logout?
              </Text>
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalBtn, styles.noBtn]}
                  onPress={() => setLogoutVisible(false)}
                >
                  <Text style={styles.modalBtnText}>NO</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalBtn, styles.yesBtn]}
                  onPress={() => {
                    setLogoutVisible(false);
                    // Add logout logic here
                  }}
                >
                  <Text style={styles.modalBtnText}>YES</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* 🔹 Delete Account Modal */}
        <Modal visible={deleteVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Image
                source={require("../../../../assets/deletebigicon.png")}
                style={styles.modalIcon}
              />
              <Text style={styles.modalText}>
                Are you sure you want to delete the account?
              </Text>
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalBtn, styles.noBtn]}
                  onPress={() => setDeleteVisible(false)}
                >
                  <Text style={styles.modalBtnText}>NO</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalBtn, styles.yesBtn]}
                  onPress={() => {
                    setDeleteVisible(false);
                    // Add delete account logic here
                  }}
                >
                  <Text style={styles.modalBtnText}>YES</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 25,
    color: "#4D4264",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Fredoka_700Bold",
    marginTop: 50,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 15,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 12,
    tintColor: "#4D4264",
  },
  optionText: {
    fontSize: 18,
    color: "#4D4264",
    fontFamily: "Fredoka_700Bold",
  },
  arrowIcon: {
    width: 14,
    height: 14,
    tintColor: "#4D4264",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#4D4264",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
    width: "80%",
  },
  modalIcon: { width: 50, height: 50, marginBottom: 15, tintColor: "#FFFFFF" },
  modalText: {
    color: "#FFFFFF",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "Fredoka_700Bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  noBtn: { borderRightWidth: 1, borderRightColor: "#FFFFFF" },
  yesBtn: {},
  modalBtnText: {
    color: "#FFFFFF",
    fontFamily: "Fredoka_700Bold",
    fontSize: 25,
  },
});
