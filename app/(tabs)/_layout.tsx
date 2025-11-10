import { Stack, useRouter, usePathname } from "expo-router";
import { View, Text, Pressable, StyleSheet, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProductStore } from "../../store/useProductStore";
import { useEffect, useState } from "react";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, filteredProducts, fetchProducts } = useProductStore();
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const suggestions = searchQuery.trim() && isFocused ? filteredProducts().slice(0, 5) : [];

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
  useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/(tabs)")}>
          <Ionicons name="home-outline" size={24} color={inactiveColor} />
        </Pressable>
        
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#888"
            style={styles.searchBar}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => {
              setIsFocused(false);
              router.push("/(tabs)/searchResults");

            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />

          {suggestions.length > 0 && (
            <View style={styles.suggestionBox}>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setSearchQuery(item.name);
                      setIsFocused(false);
                      router.push("/(tabs)/searchResults");
                    }}
                    style={styles.suggestionItem}
                  >
                    <Text style={styles.suggestionText}>{item.name}</Text>
                    <Text style={styles.suggestionPrice}>{item.price}</Text>
                  </Pressable>
                )}
              />
            </View>
          )}
        </View>

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
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
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
    zIndex: 1000,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
    position: "relative",
  },
  searchBar: {
    backgroundColor: "#f0fcd3ff",
    borderRadius: 20,
    borderWidth:1,
    borderColor:'#eec33d',
    padding:20,
    fontSize:13,
    width: "100%",
    fontFamily:'Poppins_400Regular',
    paddingLeft:10,
  },
  suggestionBox: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 'auto',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex:1000
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  suggestionText: {
    color: "#333",
    fontSize: 14,
    flex: 1,
    fontFamily:'Poppins_400Regular'
  },
  suggestionPrice: {
    color: "#4CAF50",
    fontSize: 13,
    fontWeight: "600",
    fontFamily:'Poppins_400Regular'
  },
  content: { 
    flex: 1 
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f8ffe6",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
    paddingBottom: 20,
  },
  tab: { 
    alignItems: "center" 
  },
  activeTab: { 
    opacity: 0.8 
  },
  tabText: { 
    fontSize: 12, 
    color: "#333", 
    marginTop: 3 ,
    fontFamily:'Poppins_400Regular'
    
  },
  activeTabText: { 
    color: "#4CAF50", 
    fontWeight: "600" 
  },
});