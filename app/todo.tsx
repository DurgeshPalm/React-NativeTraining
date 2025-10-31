import Loader from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeStore } from "../app/store/themeStore";

export default function TodoApp() {
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);
  const [text, setText] = useState("");
  const theme = useThemeStore((state) => state.theme);

  const backgroundColor = theme == "light" ? "#2f3640" : "#f5f6fa";
  const textColor = theme === "light" ? "#f5f6fa" : "#2f3640";

  // ✅ Realtime listener using @react-native-firebase/firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("todos")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const list: any[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setTodos(list);
      });

    return () => unsubscribe();
  }, []);

  // ✅ Add new todo
  const addTodo = async () => {
    if (text.trim() === "") return;
    try {
      await firestore().collection("todos").add({
        title: text,
        completed: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.log("Error adding todo:", err);
    }
  };

  // ✅ Toggle complete/incomplete
  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      await firestore().collection("todos").doc(id).update({
        completed: !completed,
      });
    } catch (err) {
      console.log("Error updating todo:", err);
    }
  };

  // ✅ Delete todo
  const deleteTodo = async (id: string) => {
    try {
      await firestore().collection("todos").doc(id).delete();
    } catch (err) {
      console.log("Error deleting todo:", err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#4cd137" />
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor }]}>AddTask TODO</Text>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Enter a new task..."
            value={text}
            onChangeText={setText}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Ionicons name="add-circle" size={40} color="#4cd137" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              style={[
                styles.checkCircle,
                item.completed && { backgroundColor: "#4cd137" },
              ]}
              onPress={() => toggleComplete(item.id, item.completed)}
            >
              {item.completed && (
                <Ionicons name="checkmark" size={18} color="white" />
              )}
            </TouchableOpacity>

            <Text
              style={[
                styles.todoText,
                item.completed && {
                  textDecorationLine: "line-through",
                  color: "#4cd137",
                },
              ]}
            >
              {item.title}
            </Text>

            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Ionicons name="trash" size={22} color="tomato" />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      {todos.length === 0 && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loader />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { marginBottom: 15 },
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  backButton: {
    marginRight: 10,
    marginTop: 40,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderColor: "#dcdde1",
    borderWidth: 1,
    fontSize: 16,
  },
  addButton: { marginLeft: 10 },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#2f3640",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4cd137",
    justifyContent: "center",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2f3640",
    marginBottom: 40,
    justifyContent: "center",
    alignSelf: "center",
  },
});
