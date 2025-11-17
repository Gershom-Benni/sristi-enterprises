import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import { useUserStore } from "../../store/useUserStore";
import { useProductStore } from "../../store/useProductStore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useMemo } from "react";

export default function OrderSummary() {
  const { user, updateContactInfo, placeOrder } = useUserStore();
  const { products } = useProductStore();
  const router = useRouter();
  const { from } = useLocalSearchParams();
  

  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const items = useMemo(() => {
    const fromParam = Array.isArray(from) ? from[0] : from;

    if (fromParam === "cart") return user?.cart || [];

    if (typeof fromParam === "string" && fromParam.startsWith("product-")) {
      const productId = fromParam.replace("product-", "");
      return [{ productId, qty: 1 }];
    }

    return [];
  }, [from, user]);

  const enrichedItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        ...item,
        name: product.name,
        price: product.price,
      };
    })
    .filter(Boolean);

  const totalCost = enrichedItems.reduce(
    (sum, i) => sum + (i?.price || 0) * (i?.qty || 1),
    0
  );

  const handleBuy = async () => {
    if (!address.trim() || !phone.trim()) {
      Alert.alert("Error", "Please enter address and phone number.");
      return;
    }
    try {
      await updateContactInfo(address, phone);
      await placeOrder(items, totalCost, paymentMethod, address, phone);
      router.push("/(tabs)/orderPlaced");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : undefined}
  keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
>
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f8ffe6ff", padding: 16 }}
    
  >
    <Text style={styles.heading}>Order Summary</Text>

    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>S.No</Text>
      <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
      <Text style={styles.headerCell}>Qty</Text>
      <Text style={styles.headerCell}>Cost</Text>
    </View>

    {enrichedItems.map((item, index) => {
  if (!item) return null;

  return (
    <View key={index} style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
      <Text style={styles.cell}>{item.qty}</Text>
      <Text style={styles.cell}>₹{item.price * item.qty}</Text>
    </View>
  );
})}


    <Text style={styles.total}>Total: ₹{totalCost}</Text>

    <Text style={styles.label}>Address:</Text>
    <TextInput
      style={styles.input}
      value={address}
      onChangeText={setAddress}
      placeholder="Enter delivery address"
      multiline
    />

    <Text style={styles.label}>Phone Number:</Text>
    <TextInput
      style={styles.input}
      value={phone}
      onChangeText={setPhone}
      keyboardType="phone-pad"
      placeholder="Enter phone number"
    />

    <Text style={styles.label}>Payment Method:</Text>
    <View style={styles.paymentRow}>
      {["COD", "UPI", "NetBanking"].map((method) => (
        <Pressable
          key={method}
          onPress={() => setPaymentMethod(method)}
          style={[
            styles.paymentOption,
            paymentMethod === method && styles.selectedPayment,
          ]}
        >
          <Text
            style={{
              color: paymentMethod === method ? "white" : "black",
            }}
          >
            {method}
          </Text>
        </Pressable>
      ))}
    </View>

    {/* <Pressable style={styles.buyBtn} onPress={handleBuy}>
      <Text style={styles.buyText}>Place Order</Text>
    </Pressable> */}
    <Pressable style={({ pressed }) => [
            styles.buyBtn,
            {
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
          onPress={handleBuy}>
      <Text style={styles.buyText}>Place Order</Text>
    </Pressable>
  </ScrollView>
</KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  container: { flex: 1, padding: 16, backgroundColor: "#f8ffe6ff" },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
    color: "#333",
  },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, paddingBottom: 4 },
  headerCell: { flex: 1, fontWeight: 700, },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
  },
  cell: { flex: 1,  fontSize: 13 },
  total: {
    fontSize: 20,
    fontWeight: 700,
    marginVertical: 10,
  },
  label: { marginTop: 10, fontWeight: 600 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius:10,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 6,
    marginTop: 4,
    fontSize: 13,
    backgroundColor: "#e4e3bbff",
    height: "auto",
  },
  paymentRow: { flexDirection: "row", marginTop: 8 },
  paymentOption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  selectedPayment: { backgroundColor: "#eec33d", borderColor: "#e4b93a" },
  buyBtn: {
    backgroundColor: "#4CAF50",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
