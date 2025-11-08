import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/config";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function AppLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Option 1: Firestore check
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().userCompletedWelcome) {
          router.replace("/home");
        } else {
          router.replace("/welcome");
        }

        // Option 2: AsyncStorage flag
        // const flag = await AsyncStorage.getItem("welcomeCompleted");
        // if (flag === "true") router.replace("/home");
        // else router.replace("/welcome");
      } else {
        router.replace("/welcome");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  return null;
}
