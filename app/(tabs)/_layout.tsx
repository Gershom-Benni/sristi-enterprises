import { Stack, useRouter, usePathname } from "expo-router";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const isPathActive = (tabPath: string) => {
    if (tabPath === "/(tabs)") {
      return (
        pathname === "/(tabs)" ||
        pathname === "/(tabs)/index" ||
        pathname === "/"
      );
    }

    const fullMatch = pathname === tabPath;

    const segmentPath = tabPath.replace("/(tabs)", "");
    const segmentMatch = pathname === segmentPath;

    return fullMatch || segmentMatch;
  };
  const activeColor = "#4CAF50";
  const inactiveColor = "#333";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/(tabs)")}>
          <Ionicons name="home-outline" size={24} color={inactiveColor} />
        </Pressable>
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#888"
          style={styles.searchBar}
        />
        <Pressable onPress={() => router.push("/(tabs)/account")}>
          <Ionicons
            name="person-circle-outline"
            size={28}
            color={inactiveColor}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => router.push("/(tabs)")} style={styles.tab}>
          <Ionicons
            name={isPathActive("/(tabs)") ? "home" : "home-outline"}
            size={22}
            color={isPathActive("/(tabs)") ? activeColor : inactiveColor}
          />
          <Text
            style={[
              styles.tabText,
              isPathActive("/(tabs)") && styles.activeTabText,
            ]}
          >
            Home
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/cart")}
          style={styles.tab}
        >
          <Ionicons
            name={isPathActive("/(tabs)/cart") ? "cart" : "cart-outline"}
            size={22}
            color={isPathActive("/(tabs)/cart") ? activeColor : inactiveColor}
          />
          <Text
            style={[
              styles.tabText,
              isPathActive("/(tabs)/cart") && styles.activeTabText,
            ]}
          >
            Cart
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/orders")}
          style={styles.tab}
        >
          <Ionicons
            name={
              isPathActive("/(tabs)/orders") ? "receipt" : "receipt-outline"
            }
            size={22}
            color={isPathActive("/(tabs)/orders") ? activeColor : inactiveColor}
          />
          <Text
            style={[
              styles.tabText,
              isPathActive("/(tabs)/orders") && styles.activeTabText,
            ]}
          >
            Orders
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/(tabs)/wishlist")}
          style={styles.tab}
        >
          <Ionicons
            name={isPathActive("/(tabs)/wishlist") ? "heart" : "heart-outline"}
            size={22}
            color={
              isPathActive("/(tabs)/wishlist") ? activeColor : inactiveColor
            }
          />
          <Text
            style={[
              styles.tabText,
              isPathActive("/(tabs)/wishlist") && styles.activeTabText,
            ]}
          >
            Wishlist
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/settings")}
          style={styles.tab}
        >
          <Ionicons
            name={
              isPathActive("/(tabs)/settings") ? "settings" : "settings-outline"
            }
            size={22}
            color={
              isPathActive("/(tabs)/settings") ? activeColor : inactiveColor
            }
          />
          <Text
            style={[
              styles.tabText,
              isPathActive("/(tabs)/settings") && styles.activeTabText,
            ]}
          >
            Settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#f8ffe6",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
  },
  content: { flex: 1 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f8ffe6",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
    paddingBottom:20
  },
  tab: { alignItems: "center" },
  activeTab: { opacity: 0.8 },
  tabText: { fontSize: 12, color: "#333", marginTop: 3 },
  activeTabText: { color: "#4CAF50", fontWeight: "600" },
});
