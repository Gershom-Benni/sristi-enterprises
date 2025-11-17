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
import { useBannerStore } from "@/store/useBannerStore";

const { width } = Dimensions.get("window");

export default function HomePage() {
  const router = useRouter();
  const { fetchProducts, products } = useProductStore();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { posters, fetchPosters } = useBannerStore();
  useEffect(() => {
    fetchPosters();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, []);

  const allProducts = products;

  useEffect(() => {
    if (posters.length === 0) return;
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % posters.length;
      setIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={posters}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.carouselImage} />
          )}
          keyExtractor={(item, idx) => idx.toString()}
        />
      </View>

      <Text style={styles.sectionTitle}>Our Products</Text>

      <View style={styles.gridContainer}>
        {allProducts.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/product", params: { id: item.id } })
            }
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.productImage}
            />
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.rating}>
              <Text style={styles.ratingTxt}>{item.rating}</Text>
              {item.rating &&
                [...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={
                      i <
                      Math.round(item.rating === undefined ? 0 : item.rating)
                        ? "star"
                        : "star-outline"
                    }
                    size={14}
                    color="#f5c518"
                  />
                ))}
            </View>
            <Text style={styles.productPrice}>₹{item.price}</Text>
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
    fontSize: 28,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginVertical: 12,
    color: "#333",
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "#e4e3bbff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 14.5,
    fontWeight: "500",
    color: "#333",
    marginTop: 7,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
  rating: { flexDirection: "row", marginTop: 10 },
  ratingTxt: { fontSize: 12, marginRight: 5 },
});
