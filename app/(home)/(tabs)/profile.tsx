import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useUser } from "../../store/UserContext";
import { useThemeStore } from "../../store/themeStore";

const Feed = () => {
  const { user } = useUser();
  const theme = useThemeStore((state) => state.theme);
  // console.log(user);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#2f3640" : "##fff" },
      ]}
    >
      {user?.prpfilePictureUrl && (
        <Image
          source={{ uri: user.prpfilePictureUrl }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 20,
          }}
        />
      )}
      <Text
        style={[
          styles.title,
          { color: theme === "light" ? "#f5f6fa" : "#2f3640" },
        ]}
      >
        {user ? `Profile ${user.name}` : "Profile Guest"}
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
