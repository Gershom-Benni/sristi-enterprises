import React, { useEffect, useRef, useState } from "react";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
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
  useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  useEffect(() => {
    fetchProducts();
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

      <Text style={styles.sectionTitle}>Our Products</Text>

      <View style={styles.gridContainer}>
        {allProducts.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push(`/product`)}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.rating}>
              <Text style={styles.ratingTxt}>{item.rating}</Text>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.round(item.rating) ? "star" : "star-outline"}
                  size={14}
                  color="#f5c518"
                />
              ))}
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
    fontSize: 25,
    fontFamily: "Poppins_700Bold",
    fontWeight: "600",
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
    alignItems: "center",
    padding: 10,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
    color: "#333",
    marginTop: 6,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
  },
  rating: { flexDirection: "row", marginTop: 4 },
  ratingTxt: { fontFamily: "Poppins_400Regular", fontSize: 12, marginRight: 5 },
});
