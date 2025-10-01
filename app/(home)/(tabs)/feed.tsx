import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useUser } from "../../store/UserContext";
import { useThemeStore } from "../../store/themeStore";

const Feed = () => {
  const { user } = useUser();
  const theme = useThemeStore((state) => state.theme);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#2f3640" : "##fff" },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme === "light" ? "#f5f6fa" : "#2f3640" },
        ]}
      >
        {" "}
        {user ? `About ${user.name}` : "About Guest"}
      </Text>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2f3640",
    marginBottom: 40,
  },
});
