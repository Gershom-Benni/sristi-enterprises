
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { useUserStore } from "@/store/useUserStore";



const ButtonClickAnimation = ({
  pressed,
}: {
  pressed: boolean;
}): StyleProp<ViewStyle> => {
  const baseStyles: ViewStyle = {
    width: 300,
    alignItems: "center",
    backgroundColor: "#eec33d",
    padding: 10,
    borderRadius: 10,
  };

  const dynamicStyles: ViewStyle = {
    backgroundColor: pressed ? "#e4b93a" : "#eec33d",
    transform: [{ scale: pressed ? 0.99 : 1 }],
  };

  return [baseStyles, dynamicStyles];
};

export default function Signup() {
  
  const { signUp } = useUserStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [retype, setRetype] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignup = async () => {
    if (!email || !password || !retype) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password !== retype) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, username);

      setEmail("");
      setPassword("");
      setRetype("");
      setusername("");
      setLoading(false);
      Alert.alert(
      "Account created successfully!",
      "Verify your email in accounts tab before proceeding",
      [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
    );
      
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Signup failed", error.message);
    } 
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.8, translateY: -30 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 900,
              easing: Easing.out(Easing.exp),
            }}
            style={styles.logoContainer}
          >
            <Image
              source={require("../../assets/images/Logo.png")}
              style={styles.logo}
            />
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 800,
              delay: 400,
              easing: Easing.out(Easing.exp),
            }}
            style={styles.formContainer}
          >
            <Text style={styles.signupTxt}>Sign Up</Text>

            <TextInput
              placeholder="User Name"
              style={styles.input}
              keyboardType="default"
              autoCapitalize="none"
              value={username}
              onChangeText={setusername}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              placeholder="Retype Password"
              style={styles.input}
              secureTextEntry
              value={retype}
              onChangeText={setRetype}
            />

            <Pressable style={ButtonClickAnimation} onPress={handleSignup}>
              <Text style={styles.signupbtnText}>
                {loading ? "Creating..." : "Sign Up"}
              </Text>
            </Pressable>

            <Text style={{ fontSize: 16, color: "#333", marginTop: 20 }}>
              Already a user?{" "}
              <Link href="/login" style={{ color: "#eec33d", fontWeight: "bold" }}>
                Login
              </Link>
            </Text>
          </MotiView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  signupbtnText: {
    fontSize: 16,
    color: "#333333",
    fontWeight:700
  },
  signupTxt: {
    color: "#333333",
    fontSize: 25,
    marginBottom: 20,
    fontWeight:700
  },
  input: {
    width: 300,
    padding: 15,
    borderColor: "#333333",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  logoContainer: {},
  formContainer: {
    alignItems: "center",
  },
});
