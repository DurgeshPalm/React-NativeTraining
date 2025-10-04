import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

const Loader = () => {
  return (
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#4cd137" />
    // </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
