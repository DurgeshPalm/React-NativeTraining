import Loader from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeStore } from "../../app/store/themeStore";
import api from "../fetchapi";

// ✅ Fetch Todos
const fetchTodos = async () => {
  const res = await api.get("/todos");
  return res.data;
};

export default function TodoApp() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useThemeStore((state) => state.theme);

  const [text, setText] = useState("");

  const backgroundColor = theme === "light" ? "#2f3640" : "#f5f6fa";
  const textColor = theme === "light" ? "#f5f6fa" : "#2f3640";

  // ✅ 1. Fetch Todos
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // ✅ 2. Add Todo
  const addTodoMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!title.trim()) throw new Error("Task title cannot be empty");
      await api.post("/todos", { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setText("");
    },
  });

  // ✅ 3. Toggle Complete
  const toggleCompleteMutation = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: number;
      completed: boolean;
    }) => {
      await api.put(`/todos/${id}`, { completed: !completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // ✅ 4. Delete Todo
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <Loader />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <Text style={{ color: "tomato" }}>Failed to load todos 😢</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#4cd137" />
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor }]}>
          React Query TODO
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Enter a new task..."
            value={text}
            onChangeText={setText}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={() => addTodoMutation.mutate(text)}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addTodoMutation.mutate(text)}
            disabled={addTodoMutation.isPending}
          >
            <Ionicons
              name="add-circle"
              size={40}
              color={addTodoMutation.isPending ? "#ccc" : "#4cd137"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={todos || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              style={[
                styles.checkCircle,
                item.completed && { backgroundColor: "#4cd137" },
              ]}
              onPress={() =>
                toggleCompleteMutation.mutate({
                  id: item.id,
                  completed: item.completed,
                })
              }
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

            <TouchableOpacity
              onPress={() => deleteTodoMutation.mutate(item.id)}
              disabled={deleteTodoMutation.isPending}
            >
              <Ionicons
                name="trash"
                size={22}
                color={deleteTodoMutation.isPending ? "#ccc" : "tomato"}
              />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: { marginBottom: 15 },
  backButton: { marginRight: 10, marginTop: 40 },
  inputRow: { flexDirection: "row", alignItems: "center" },
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 40,
    alignSelf: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
