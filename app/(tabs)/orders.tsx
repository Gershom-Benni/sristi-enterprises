import React, { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "../../store/useUserStore";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState<"pending" | "completed">("pending");
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useUserStore();
  const router = useRouter();
useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.orders) return;
      const orderDocs = await Promise.all(
        user.orders.map(async (orderId) => {
          const docSnap = await getDoc(doc(db, "orders", orderId));
          if (!docSnap.exists()) return null;
          const orderData = docSnap.data();

          const detailedItems = await Promise.all(
            orderData.items.map(async (it: any) => {
              const prodSnap = await getDoc(doc(db, "products", it.productId));
              if (!prodSnap.exists()) return it;
              const prodData = prodSnap.data();
              return { ...it, ...prodData }; 
            })
          );

          return { id: orderId, ...orderData, items: detailedItems };
        })
      );
      setOrders(orderDocs.filter(Boolean));
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((o) => {
  const status = o.status?.toLowerCase().trim();
  return selectedTab === "pending" ? status !== "delivered" : status === "delivered";
});


  const renderOrder = ({ item }: { item: any }) => {
    const firstItem = item.items[0];
    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/order?id=${item.id}`)}
      >
        <Image
          source={{
            uri:
              firstItem?.images?.[0] ||
              firstItem?.image ||
              "https://via.placeholder.com/100",
          }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{firstItem?.name || "Unnamed product"}</Text>
          <Text style={styles.status}>Status: {item.status}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, selectedTab === "pending" && styles.activeTab]}
          onPress={() => setSelectedTab("pending")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "pending" && styles.activeTabText,
            ]}
          >
            To be Delivered
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === "completed" && styles.activeTab]}
          onPress={() => setSelectedTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8ffe6ff", padding: 10 },
  tabContainer: { flexDirection: "row", marginBottom: 15,width:'100%',gap:20},
  tab: {
    flex: 1,
    paddingTop:10,
    paddingBottom:7,
    borderRadius: 10,
    backgroundColor: "#e4e3bbff",
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#4CAF50" },
  tabText: { fontSize: 14, color: "#333",fontFamily: "Poppins_500Medium" },
  activeTabText: { color: "#fff", fontWeight: "600" },
  card: {
    flexDirection: "row",
    backgroundColor: "#e4e3bbff",
    marginVertical: 6,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  image: { width: 60, height: 60, borderRadius: 10 },
  info: { marginLeft: 10, justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "500",fontFamily: "Poppins_500Medium" },
  status: { fontSize: 12, color: "gray",fontFamily: "Poppins_400Regular" },
});
