import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProductDetail = () => {
  const { product } = useLocalSearchParams<{ product: string }>();
  const parsedProduct = product ? JSON.parse(product) : null;
  const router = useRouter();

  if (!parsedProduct) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product details not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#4cd137" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: parsedProduct.image }} style={styles.image} />
        <View style={styles.card}>
          <Text style={styles.title}>{parsedProduct.title}</Text>
          <Text style={styles.price}>${parsedProduct.price.toFixed(2)}</Text>
          <Text style={styles.category}>
            Category: {parsedProduct.category}
          </Text>
          <Text style={styles.description}>{parsedProduct.description}</Text>
          <Text style={styles.rating}>
            ⭐ {parsedProduct.rating.rate} ({parsedProduct.rating.count}{" "}
            reviews)
          </Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart" size={20} color="#fff" />
            <Text style={styles.cartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scroll: {
    paddingBottom: 20,
    alignItems: "center",
  },
  error: { fontSize: 18, textAlign: "center", marginTop: 20 },
  image: {
    width: "90%",
    height: 300,
    resizeMode: "contain",
    marginTop: 60,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#333" },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4cd137",
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
    fontStyle: "italic",
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color: "#555",
  },
  rating: { fontSize: 14, color: "#444", marginBottom: 20 },

  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    padding: 8,
    borderRadius: 30,
    zIndex: 10,
  },

  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4cd137",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
