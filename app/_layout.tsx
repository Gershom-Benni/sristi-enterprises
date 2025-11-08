// app/_layout.js
import { Stack } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
// import { Easing } from "react-native-reanimated";
import { MotiView } from "moti";
export default function RootLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <MotiView
          from={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{
            type: "timing",
            duration: 800,
            repeat: Infinity,
            repeatReverse: true,
          }}
        >
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.logo}
          />
        </MotiView>
      </View>
    );
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8ffe6",
  },
  logo: {
    width: 280,
    height: 280,
    borderRadius: 20,
  }
});
