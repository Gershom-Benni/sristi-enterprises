import { Text, StyleSheet, View, Platform, StatusBar } from "react-native";
export default function account() {
  return (
    <>
      <View style={styles.container}>
        <Text>Welcome to account</Text>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: Platform.select({
      ios: 40,
      android: StatusBar.currentHeight || 24,
      default: 0,
    }),
    backgroundColor: "#f8ffe6ff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  btn: {
    width: 100,
    height: 50,
    backgroundColor: "red",
    marginTop: 10,
  },
});
