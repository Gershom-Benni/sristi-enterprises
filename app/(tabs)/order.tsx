import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { MotiView } from "moti";
import { Feather } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";


const PRIMARY_COLOR = "#34C759";
const SUCCESS_COLOR = "#34C759"; 
const INACTIVE_COLOR = "#D1D1D6"; 
const BACKGROUND_COLOR = "#f8ffe6";
const CARD_COLOR = "#e4e3bb"; 
const TEXT_COLOR_DARK = "#333"; 
const TEXT_COLOR_MEDIUM = "#4a4a4aff";

const stages = [
  { key: "placed", label: "Order Placed", icon: "shopping-bag" },
  { key: "dispatched", label: "Dispatched", icon: "truck" },
  { key: "shipped", label: "Shipped", icon: "package" },
  { key: "delivered", label: "Delivered", icon: "check-circle" },
];

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const { user } = useUserStore();
    
  useEffect(() => {
    const loadOrder = async () => {
      const orderSnap = await getDoc(doc(db, "orders", id));
      if (!orderSnap.exists()) return;

      const orderData = orderSnap.data();
      const detailedItems = await Promise.all(
        orderData.items.map(async (it: any) => {
          const prodSnap = await getDoc(doc(db, "products", it.productId));
          if (!prodSnap.exists()) return it;
          const prodData = prodSnap.data();
          return { ...it, ...prodData };
        })
      );

      setOrder({ id, ...orderData, items: detailedItems });
    };
    loadOrder();
  }, [id]);

  if (!order)
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: BACKGROUND_COLOR }}>
        <Text style={{ textAlign: "center", fontSize: 16, color: TEXT_COLOR_MEDIUM }}>Loading Order Details...</Text>
      </View>
    );

  const currentStageIndex = stages.findIndex((s) => s.key === order.status);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: BACKGROUND_COLOR, 
        flexGrow: 1,
      }}
    >
      <View
  style={{
    backgroundColor: CARD_COLOR,
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
  }}
>
  <Text
    style={{
      fontSize: 18,
      color: PRIMARY_COLOR,
      marginBottom: 10,
      textAlign: "center",
      fontWeight:700
    }}
  >
    Order ID: {order.id.substring(0, 8).toUpperCase()}
  </Text>

  {order.items.map((product: any, index: number) => (
    <View
      key={index}
      style={{
        marginBottom: 15,
        backgroundColor: "#f8ffe6ff",
        borderRadius: 12,
        padding: 10,
        display:'flex',
        flexDirection:'row'
      }}
    >
      <Image
        source={{
          uri:
            product?.images?.[0] ||
            product?.image ||
            "https://via.placeholder.com/150",
        }}
        style={{
          width: 90,
          height: 80,
          borderRadius: 10,
          resizeMode: "cover",
          marginRight:15
        }}
      />
      <View>
        <Text
        style={{
          fontSize: 18,
          color: TEXT_COLOR_DARK,
          fontWeight:700
        }}
      >
        {product?.name || "Unnamed Product"}
      </Text>
      <Text
        style={{
          fontSize: 14,
           fontWeight:500,
          color: TEXT_COLOR_MEDIUM,
          marginTop: 4,
        }}
      >
        Quantity: {product.qty}
      </Text>
      <Text
        style={{
          fontSize: 14,
           fontWeight:500,
          color: TEXT_COLOR_MEDIUM,
        }}
      >
        Price: ₹{product.price || "—"}
      </Text>
      </View>
    </View>
  ))}
</View>


      <View style={{
        backgroundColor: CARD_COLOR,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 25,
        
      }}>
        <Text style={{ fontWeight: 700, fontSize: 20, marginBottom: 5, color: PRIMARY_COLOR }}>
          Order Status
        </Text>
        {stages.map((stage, i) => {
          const isDone = i <= currentStageIndex;
          const isCurrent = i === currentStageIndex;
          return (
            <View key={stage.key} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: i < stages.length - 1 ? 0 : 10,marginTop:10 }}>
              <MotiView
                from={{ scale: 0.8, backgroundColor: INACTIVE_COLOR }}
                animate={{
                  scale: isDone ? (isCurrent ? 1.1 : 1) : 0.8, 
                  backgroundColor: isDone ? SUCCESS_COLOR : INACTIVE_COLOR,
                }}
                transition={{ type: "timing", duration: 400, delay: i * 100 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 15,
                  borderWidth: isCurrent ? 2 : 0,
                  borderColor: CARD_COLOR, 
                }}
              >
                <Feather name={stage.icon as any} size={20} color={CARD_COLOR} />
              </MotiView>

              <View style={{ flex: 1, paddingVertical: 8 }}>
                <Text style={{
                  fontWeight: isCurrent ? "700" : "500",
                  fontSize: 16,
                  color: isDone ? TEXT_COLOR_DARK : TEXT_COLOR_MEDIUM,
                }}>
                  {stage.label}
                </Text>
              </View>

              {i < stages.length - 1 && (
                <MotiView
                  from={{ height: 0, backgroundColor: INACTIVE_COLOR }}
                  animate={{
                    height: 45, 
                    backgroundColor: i < currentStageIndex ? SUCCESS_COLOR : INACTIVE_COLOR,
                  }}
                  transition={{ type: "timing", duration: 500, delay: i * 100 }}
                  style={{
                    width: 3,
                    alignSelf: "center",
                    position: 'absolute',
                    left: 18.5,
                    top: 40, 
                  }}
                />
              )}
            </View>
          );
        })}
      </View>

      <View style={{
        backgroundColor: CARD_COLOR,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
      }}>
        <Text style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: PRIMARY_COLOR }}>
        Delivery Address
        </Text>
        <Text style={{ color: TEXT_COLOR_DARK, fontSize: 15, lineHeight: 22,  }}>
          {user?.address || "No delivery address provided in user data."}
        </Text>
      </View>
    </ScrollView>
  );
}