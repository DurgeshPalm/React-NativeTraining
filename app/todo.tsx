import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../app/firebase/firebaseconfig";
import { useThemeStore } from "../app/store/themeStore";

export default function TodoApp() {
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);
  const [text, setText] = useState("");
  const theme = useThemeStore((state) => state.theme);

  const backgroundColor = theme == "light" ? "#2f3640" : "#f5f6fa";
  const textColor = theme === "light" ? "#f5f6fa" : "#2f3640";
  const subtitleColor = theme === "light" ? "#ccc" : "#666";

  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setTodos(list);
    });
    return () => unsubscribe();
  }, []);

  const addTodo = async () => {
    if (text.trim() === "") return;
    try {
      await addDoc(collection(db, "todos"), {
        title: text,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.log("Error adding todo:", err);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    const ref = doc(db, "todos", id);
    await updateDoc(ref, { completed: !completed });
  };

  const deleteTodo = async (id: string) => {
    const ref = doc(db, "todos", id);
    await deleteDoc(ref);
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
  addButton: {
    marginLeft: 10,
  },
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
