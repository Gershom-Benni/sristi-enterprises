import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

export default function OrderPlaced() {
  const animation = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(tabs)/orders");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        loop={false}
        ref={animation}
        style={{ width: 200, height: 200 }}
        source={require("../../assets/success.json")} 
      />
      <Text style={styles.text}>Order Placed Successfully!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8ffe6",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    color: "#27ae60",
  },
});
