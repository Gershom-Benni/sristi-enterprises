import React, { useRef, useEffect, useState } from "react";
import { View, Text, FlatList, Image, Pressable, Dimensions, StyleSheet, ScrollView,Platform,StatusBar } from "react-native";
import { useRouter } from "expo-router";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

const posters = [
  { id: "1", image: "https://picsum.photos/800/300?random=1" },
  { id: "2", image: "https://picsum.photos/800/300?random=2" },
  { id: "3", image: "https://picsum.photos/800/300?random=3" },
];

const products = [
  { id: "1", name: "Product A", price: "₹499", image: "https://picsum.photos/800/300?random=1" },
  { id: "2", name: "Product B", price: "₹699", image: "https://picsum.photos/800/300?random=2" },
  { id: "3", name: "Product C", price: "₹799", image: "https://picsum.photos/800/300?random=3" },
  { id: "4", name: "Product D", price: "₹999", image: "https://picsum.photos/800/300?random=5" },
  { id: "5", name: "Product E", price: "₹1199", image: "https://picsum.photos/800/300?random=6" },
  { id: "6", name: "Product F", price: "₹1299", image: "https://picsum.photos/800/300?random=7" },
];

export default function HomePage() {
    const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  

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

      <Text style={styles.sectionTitle}>Our Products</Text>

      <View style={styles.gridContainer}>
        {products.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            // onPress={() => router.push(`/product/${item.id}`)}
            onPress={() => router.push(`/product`)}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8ffe6",
    flex: 1,
    paddingTop:7,
  },
  carouselContainer: {
    width: "100%",
    height: 200,
  },
  carouselImage: {
    width: width,
    height: 200,
    resizeMode: "cover",
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 25,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginVertical: 12,
    color: "#333",
    textAlign:'center'
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
    color: "#333",
    marginTop: 6,
    fontFamily:'Poppins_500Medium',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 2,
    fontFamily:'Poppins_500Medium',
  },
});
