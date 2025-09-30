import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Goback = () => {
  return (
  <View >
       <TouchableOpacity style={styles.button} onPress={() => router.back()}>
         <Text style={styles.buttonText}>Go Back</Text>
       </TouchableOpacity>
     </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    padding: 12,
    margin: 10,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontSize: 16 },
});

export default Goback