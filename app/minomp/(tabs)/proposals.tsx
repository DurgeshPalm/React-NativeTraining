import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProposalsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Proposals Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "#6C5B8F", fontSize: 18, fontFamily: "Fredoka_600SemiBold" },
});
