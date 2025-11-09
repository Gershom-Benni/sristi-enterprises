import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useProductStore } from "../../store/useProductStore";

const { width } = Dimensions.get("window");

const posters = [
  { id: "1", image: "https://picsum.photos/800/300?random=1" },
  { id: "2", image: "https://picsum.photos/800/300?random=2" },
  { id: "3", image: "https://picsum.photos/800/300?random=3" },
];

export default function HomePage() {
  const router = useRouter();
  const { fetchProducts, products } = useProductStore();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchProducts(); // loads mock data once
  }, []);

  const allProducts = products;

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % posters.length;
      setIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={posters}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.carouselImage} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Text style={styles.sectionTitle}>Products</Text>

      <View style={styles.gridContainer}>
        {allProducts.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push(`/product`)}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.productPrice}>{item.price}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f8ffe6ff", flex: 1 },
  carouselContainer: { width: "100%", height: 200 },
  carouselImage: { width: width, height: 200, resizeMode: "cover" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginVertical: 12,
    color: "#333",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    padding: 10,
    borderWidth:1,
    borderColor:'#d8ff75ff'
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  productName: { fontSize: 14, fontWeight: "500", color: "#333", marginTop: 6 },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 2,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingText: { fontSize: 12, color: "#555", marginLeft: 4 },
});
