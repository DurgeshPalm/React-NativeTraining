import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUser } from '../../store/UserContext';

const Feed = () => {
  const { user, logout } = useUser();
  return (
    <View style={styles.container}>
      <Text style={styles.title}> {user ? `About ${user.name}` : "About Guest"}</Text>
    </View>
  )
}

export default Feed

const styles = StyleSheet.create({
      container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2f3640',
    marginBottom: 40,
  },
})