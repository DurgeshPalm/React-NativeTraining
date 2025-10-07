import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useUser } from "../../store/UserContext";
import { useThemeStore } from "../../store/themeStore";

const Feed = () => {
  const { user } = useUser();
  const theme = useThemeStore((state) => state.theme);

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacity
  const translateY = useRef(new Animated.Value(100)).current; // slide up from 50px below

  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 2,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Run animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#2f3640" : "#fff" },
      ]}
    >
      {user?.prpfilePictureUrl && (
        <Image source={{ uri: user.prpfilePictureUrl }} style={styles.image} />
      )}
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale }, { translateY: translateY }],
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: theme === "light" ? "#f5f6fa" : "#2f3640" },
            ]}
          >
            {user ? `Profile ${user.name}` : "Profile Guest"}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#f5f6fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});
