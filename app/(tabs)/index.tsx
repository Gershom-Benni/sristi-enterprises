import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Image } from "expo-image";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
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
    backgroundColor: pressed ? "#e4b93aff" : "#eec33d",
    transform: [{ scale: pressed ? 0.99 : 1 }],
  };
  return [baseStyles, dynamicStyles];
};
const LoginButtonClickAnimation = ({
  pressed,
}: {
  pressed: boolean;
}): StyleProp<ViewStyle> => {
  const baseStyles: ViewStyle = {
    width: 300,
    alignItems: "center",
    borderColor: "#eec33d",
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  };

  const dynamicStyles: ViewStyle = {
    borderColor: pressed ? "#4CAF50" : "#eec33d",
    transform: [{ scale: pressed ? 0.99 : 1 }],
  };
  return [baseStyles, dynamicStyles];
};

export default function WelcomePage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.8, translateY: -30 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 900,
          easing: Easing.out(Easing.exp),
        }}
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
        <Text style={styles.welcomeTxt}>Let’s get you started..</Text>
        <Pressable
          style={ButtonClickAnimation}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.signupbtnText}>Sign Up</Text>
        </Pressable>
        <Pressable style={LoginButtonClickAnimation}>
          <Text style={styles.signupbtnText}>Login</Text>
        </Pressable>
        <Text style={styles.terms}>
          By continuing, you agree to our Terms & Privacy Policy.
        </Text>
      </MotiView>
      <Text style={styles.copyrightText}>
        © {currentYear} Sristi Enterprises. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  terms: {
    fontSize: 9,
    marginTop: 15,
    color: "#333333",
    fontFamily: "Poppins_400Regular",
  },
  welcomeTxt: {
    color: "#333333",
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    marginBottom: 20,
  },
  container: {
    paddingTop: Platform.select({
      ios: 40,
      android: StatusBar.currentHeight || 24,
      default: 0,
    }),
    paddingHorizontal: 16,
    backgroundColor: "#f8ffe6ff",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  logo: {
    width: 280,
    height: 280,
    borderRadius: 20,
    marginTop: 70,
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginbtn: {
    width: 300,
    alignItems: "center",
    borderColor: "#eec33d",
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  signupbtnText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    color: "#333333",
  },
  copyrightText: {
    position: "absolute",
    bottom: 25,
    fontSize: 10,
    color: "#888",
    textAlign: "center",
    width: "100%",
  },
});
