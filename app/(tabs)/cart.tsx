import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useUserStore } from "../../store/useUserStore";
import { useProductStore } from "../../store/useProductStore";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
export default function CartPage() {
  const { user, removeFromCart, updateCartQty } = useUserStore();
  const { products } = useProductStore();

  useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!user?.cart?.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Your cart is empty 🛒</Text>
      </View>
    );
  }

  const totalProducts = user.cart.length;
  const totalCost = user.cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const handleRemove = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleIncrease = async (productId: string, qty: number) => {
    await updateCartQty(productId, qty + 1);
  };

  const handleDecrease = async (productId: string, qty: number) => {
    if (qty > 1) await updateCartQty(productId, qty - 1);
  };

  const renderItem = ({ item }: any) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return null;

    return (
      <View style={styles.card}>
        <View style={styles.leftRight}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>₹{product.price}</Text>
            <View style={styles.qtyRow}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => handleDecrease(item.productId, item.qty)}
              >
                <Text>-</Text>
              </Pressable>
              <Text style={styles.qty}>{item.qty}</Text>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => handleIncrease(item.productId, item.qty)}
              >
                <Text>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.images?.[0] }} style={styles.image} />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.removeBtn,
            {
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
          onPress={() => handleRemove(item.productId)}
        >
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={user.cart}
        renderItem={renderItem}
        keyExtractor={(i) => i.productId}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Products: {totalProducts}</Text>
        <Text style={[styles.totalText, styles.totalAmount]}>
          Total Amount: ₹{totalCost.toFixed(2)}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
    styles.buyBtn,
    { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
  ]}
        onPress={() => Alert.alert("Buy Now clicked")}
      >
        <Text style={styles.buyText}>Buy Now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 90,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
  },
  leftRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: { flex: 1, padding: 16, backgroundColor: "#f8ffe6ff" },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8ffe6",
  },
  emptyText: { fontSize: 18, color: "#666", fontFamily: "Poppins_500Medium" },
  card: {
    backgroundColor: "#e4e3bbff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: { fontSize: 16, fontFamily: "Poppins_700Bold", fontWeight: "600" },
  price: {
    color: "#2ecc71",
    fontFamily: "Poppins_500Medium",
    marginVertical: 4,
  },
  qtyRow: { flexDirection: "row", alignItems: "center", marginVertical: 3 },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    width: 30,
    alignItems: "center",
  },
  qty: { marginHorizontal: 10, fontSize: 16 },
  removeBtn: {
    backgroundColor: "#e74c3c",
    borderRadius: 6,
    paddingVertical: 6,
    marginTop: 6,
    alignItems: "center",
  },
  removeText: { color: "white" },
  totalContainer: {
    backgroundColor: "#e4e3bbff",
    paddingTop: 6,
    paddingHorizontal: 10,
    paddingBottom: 3,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 3,
    elevation: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333",
  },
  totalAmount: {
    fontFamily: "Poppins_400Regular",
    color: "#2ecc71",
    fontSize: 14,
  },
  buyBtn: {
    backgroundColor: "#81C784",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buyText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
