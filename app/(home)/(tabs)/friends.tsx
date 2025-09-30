import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFriendsStore } from "../../store/friendsStore";
import { useUser } from "../../store/UserContext";

export default function FriendsTab() {
  const { friends, addFriend, removeFriend, reset } = useFriendsStore();
  const [name, setName] = useState("");
  const { user } = useUser();

  const handleAddFriend = () => {
    if (name.trim()) {
      addFriend(name.trim());
      setName("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {" "}
        {user ? `${user.name}'s ` : "Login to add "}Friends List
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter friend name"
          style={[styles.input, styles.inputContainer]}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: user?.name ? "#4cd137" : "gray" },
        ]}
        onPress={() => handleAddFriend()}
        disabled={!user?.name}
      >
        <Text style={styles.buttonText}>AddFriends</Text>
      </TouchableOpacity>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendRow}>
            <Text style={styles.friendName}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeFriend(item.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No friends added yet.</Text>
        }
      />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: friends.length === 0 ? "gray" : "#4cd137" },
        ]}
        onPress={() => reset()}
        disabled={friends.length === 0}
      >
        <Text style={[styles.buttonText, { color: "tomato" }]}>RemoveAll</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  inputRow: { flexDirection: "row", marginBottom: 16, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    fontSize: 16,
    color: "#2f3640",
  },
  friendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  friendName: { fontSize: 18 },
  remove: {
    color: "tomato",
    fontWeight: "bold",
    backgroundColor: "#4cd137",
    borderRadius: 12,
    padding: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  button: {
    width: "100%",
    backgroundColor: "#4cd137",
    padding: 15,
    borderRadius: 12,
    // marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
});
