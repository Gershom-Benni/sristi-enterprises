import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useProductStore } from "../../store/useProductStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
export default function SearchResults() {
  const { filteredProducts } = useProductStore();
  const products = filteredProducts();
  const router = useRouter();
  useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Results</Text>

      {products.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No products found.
        </Text>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push({ pathname: "/product", params: { id: item.id } })}

            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>

              <View style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < Math.round(item.rating) ? "star" : "star-outline"}
                    size={14}
                    color="#f5c518"
                  />
                ))}
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8ffe6ff", padding: 10 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
    color: "#333"
  },
  card: {
    width: "48%",
    backgroundColor: "#e4e3bbff",
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  image: { width: "100%", height: 120, borderRadius: 8 },
  name: { fontSize: 14, fontWeight: "500", marginTop: 6,fontFamily: "Poppins_400Regular",color: "#333" },
  price: { fontSize: 13, color: "#4CAF50", marginVertical: 2 ,fontFamily: "Poppins_500Medium",letterSpacing:1},
  rating: { flexDirection: "row", marginTop: 4 },
});
