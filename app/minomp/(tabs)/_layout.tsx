import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";

function TabIcon({
  iconSource,
  focused,
  ellipseBack,
  ellipseFront,
}: {
  iconSource: any;
  focused: boolean;
  ellipseBack: any;
  ellipseFront: any;
}) {
  return (
    <View style={styles.iconWrapper}>
      {focused && (
        <>
          {/* Purple curved background */}
          <Image
            source={ellipseBack}
            style={styles.ellipseBack}
            resizeMode="contain"
          />
          {/* Turquoise front circle */}
          <Image
            source={ellipseFront}
            style={styles.ellipseFront}
            resizeMode="contain"
          />
        </>
      )}
      {/* Tab icon itself */}
      <Image
        source={iconSource}
        style={[
          styles.iconImage,
          { tintColor: focused ? "#6C5B8F" : "#FFFFFF" },
          focused && { transform: [{ translateY: -25 }] },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* 📜 Proposal Tab */}
      <Tabs.Screen
        name="proposals"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconSource={require("../../../assets/Proposaltabicon.png")}
              focused={focused}
              ellipseBack={require("../../../assets/EllipseselectedtabBack.png")}
              ellipseFront={require("../../../assets/Ellipseselectedtab.png")}
            />
          ),
        }}
      />

      {/* 🏠 Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconSource={require("../../../assets/Home 2.png")}
              focused={focused}
              ellipseBack={require("../../../assets/EllipseselectedtabBack.png")}
              ellipseFront={require("../../../assets/Ellipseselectedtab.png")}
            />
          ),
        }}
      />

      {/* ⚙️ Settings Tab */}
      <Tabs.Screen
        name="(settings)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconSource={require("../../../assets/Settings.png")}
              focused={focused}
              ellipseBack={require("../../../assets/EllipseselectedtabBack.png")}
              ellipseFront={require("../../../assets/Ellipseselectedtab.png")}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#9370DB",
    height: 70,
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    top: Platform.OS === "ios" ? -5 : -2,
    width: 90,
    height: 85,
    marginTop: 15,
  },
  ellipseBack: {
    position: "absolute",
    width: 62.99,
    height: 62.99,
    bottom: 35, // pulls the purple curve down like in design
    zIndex: -1,
  },
  ellipseFront: {
    position: "absolute",
    width: 150,
    height: 90,
    bottom: 20, // aligns turquoise circle within the purple curve
    zIndex: -2,
  },
  iconImage: {
    width: 40,
    height: 40,
    marginBottom: -5,
  },
});
