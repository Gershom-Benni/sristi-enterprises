import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useUserStore } from "@/store/useUserStore";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function Wishlist() {
  const { user, toggleWishlist } = useUserStore();
  const { products, fetchProducts } = useProductStore();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const router = useRouter();
  useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (!products.length) fetchProducts?.();
  }, []);

  useEffect(() => {
    if (user?.wishlist?.length && products.length) {
      const filtered = products.filter((p) =>
        user.wishlist?.includes(p.id)
      );
      setWishlistProducts(filtered);
    } else {
      setWishlistProducts([]);
    }
  }, [user?.wishlist, products]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>Please sign in to view your wishlist.</Text>
      </View>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="heart-outline" size={50} color="gray" />
        <Text style={styles.msg}>Your wishlist is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
      data={wishlistProducts}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable onPress={()=>router.push({ pathname: "/product", params: { id: item.id } })}>
          <View style={styles.card} >
            <Pressable style={styles.imageContainer} >
              <Image source={{ uri: item.images?.[0] }} style={styles.image} />
            </Pressable>

          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </View>

          <Pressable onPress={() => toggleWishlist(item.id)}>
            <Ionicons name="heart" size={28} color="red" />
          </Pressable>
        </View>
        </Pressable>
        
      )}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 10,
    backgroundColor: "#f8ffe6",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:'#e4e3bbff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    flex: 1,
  },
  name: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#333",
  },
  price: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    color: "green",
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  msg: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333",
    marginTop: 10,
  },
});
