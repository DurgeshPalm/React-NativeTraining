import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GetUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  if (users.length === 0 ) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4cd137" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.friendRow}>
            <Text style={styles.friendName}>{item.username}</Text>
            <TouchableOpacity style={styles.button} onPress={() =>router.push({pathname: "/userdetail", params: { user: JSON.stringify(item) },})}>
              <Text style={styles.buttonText}>GetDetail</Text>
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default GetUsers;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  button: {
    backgroundColor: "#4cd137",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  friendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  friendName: { fontSize: 18 },
});
