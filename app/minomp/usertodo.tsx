import { Ionicons } from "@expo/vector-icons";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import api from "../fetchapi";
import { useThemeStore } from "../store/themeStore";

const fetchTodos = async ({ pageParam = 1 }) => {
  const res = await api.post("/todos/list", { page: pageParam, limit: 10 });
  return res.data;
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
  const { height: windowHeight } = useWindowDimensions();

  // layout measurement state
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // guard to prevent repeated auto-fetch triggers
  const loadingMoreRef = useRef(false);

  const backgroundColor = theme === "light" ? "#2f3640" : "#f5f6fa";
  const textColor = theme === "light" ? "#f5f6fa" : "#2f3640";

  // ✅ Infinite Query for Pagination
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });

  const todos = data?.pages.flatMap((page) => page.data) || [];

  // Effect: when content height < available viewport and there are more pages,
  // auto-fetch next page. Use guards to avoid duplicate triggers.
  useEffect(() => {
    // only try when we have measured dimensions and have pages
    if (
      headerHeight <= 0 ||
      contentHeight <= 0 ||
      windowHeight <= 0 ||
      !hasNextPage
    ) {
      return;
    }

    // compute available area for list: window height minus header and some padding
    const availableForList = windowHeight - headerHeight - 40; // 40 for top/bottom margins/padding

    // If content doesn't fill the available area, we want to fetch more
    if (
      contentHeight < availableForList &&
      hasNextPage &&
      !isFetchingNextPage &&
      !loadingMoreRef.current
    ) {
      loadingMoreRef.current = true;
      // fetch next page
      fetchNextPage().catch(() => {
        // swallow errors here; React Query will set error state
      });
    }
  }, [
    contentHeight,
    headerHeight,
    windowHeight,
    hasNextPage,
    isFetchingNextPage,
  ]);

  // Reset the guard once fetching finishes
  useEffect(() => {
    if (!isFetchingNextPage) {
      loadingMoreRef.current = false;
    }
  }, [isFetchingNextPage]);

  // ✅ Mutations
  const addTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setText("");
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

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
      <View
        style={styles.headerContainer}
        // measure header height
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h && h !== headerHeight) setHeaderHeight(h);
        }}
      >
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
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Ionicons name="add-circle" size={40} color="#4cd137" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#4cd137"
          style={{ marginTop: 20 }}
        />
      )}

      {isError && (
        <View>
          <Text style={{ color: "red", textAlign: "center" }}>
            Failed to load todos 😞
          </Text>
        </View>
      )}

      <FlatList
        data={todos}
        // measure content height whenever it changes
        onContentSizeChange={(_, h) => {
          if (h && h !== contentHeight) setContentHeight(h);
        }}
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
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="small"
              color="#4cd137"
              style={{ margin: 10 }}
            />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 20 },
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
  backButton: { marginRight: 10, marginTop: 40 },
  headerContainer: { marginBottom: 15 },
});
