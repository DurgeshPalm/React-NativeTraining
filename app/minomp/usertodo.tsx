import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../fetchapi";
import { useThemeStore } from "../store/themeStore";

const fetchTodos = async () => {
  const res = await api.get("/todos");
  return res.data.data;
};

const createTodo = async (title: string) => {
  await api.post("/todos", { title });
};

const updateTodo = async ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  await api.patch(`/todos/${id}`, { completed: !completed });
};

const deleteTodo = async (id: number) => {
  await api.delete(`/todos/${id}`);
};

export default function TodoApp() {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const theme = useThemeStore((state) => state.theme);
  const router = useRouter();

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
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setText("");
    },
  });

  // ✅ 3. Toggle Complete
  const toggleCompleteMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // ✅ 4. Delete Todo
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleAdd = () => {
    if (!text.trim()) return;
    addTodoMutation.mutate(text);
  };

  const handleToggle = (id: number, completed: boolean) => {
    toggleCompleteMutation.mutate({ id, completed });
  };

  const handleDelete = (id: number) => {
    deleteTodoMutation.mutate(id);
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

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Enter a new task..."
            value={text}
            onChangeText={setText}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Ionicons name="add-circle" size={40} color="#4cd137" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Loading */}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#4cd137"
          style={{ marginTop: 20 }}
        />
      )}

      {/* Error */}
      {isError && (
        <View>
          <Text style={{ color: "red", textAlign: "center" }}>
            Failed to load todos 😞
          </Text>
        </View>
      )}

      {/* List */}
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
              onPress={() => handleToggle(item.id, item.completed)}
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

            <TouchableOpacity onPress={() => handleDelete(item.id)}>
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
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
  },
  addButton: { marginLeft: 10 },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
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
  todoText: { flex: 1, marginLeft: 10, fontSize: 16, color: "#2f3640" },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    marginTop: 40,
  },
  headerContainer: {
    marginBottom: 15,
  },
});
