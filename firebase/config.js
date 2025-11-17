import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpQ-U42xyiNIY68diVdNtXLhCuo_4y9qI",
  authDomain: "sristi-enterprise.firebaseapp.com",
  projectId: "sristi-enterprise",
  storageBucket: "sristi-enterprise.appspot.com",
  messagingSenderId: "1023189841205",
  appId: "1:1023189841205:web:ba3cdeb89537956d8dc87c",
  measurementId: "G-C48X9XDKXE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export const  auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app,  db, storage };
