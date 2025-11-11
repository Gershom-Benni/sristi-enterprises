// store/useUserStore.ts
import { create } from "zustand";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  DocumentData,
  onSnapshot
} from "firebase/firestore";
import { auth, db } from "..//firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

export type CartItem = { productId: string; qty: number };
export type Order = {
  id?: string;
  userId: string;
  items: CartItem[];
  totalCost: number;
  status: string;
  createdAt?: any;
};

type UserData = {
  id: string;
  email: string;
  username?: string;
  createdAt?: any;
  profilePic?: string;
  cart?: CartItem[];
  wishlist?: string[]; 
  orders?: string[]; 
};

type UserStore = {
  user: UserData | null;
  loading: boolean;
  initAuthListener: () => void;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  loadUserDoc: (uid: string) => Promise<void>;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQty: (productId: string, qty: number) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  placeOrder: (items: CartItem[], totalCost: number) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: true,

  initAuthListener: () => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        await get().loadUserDoc(u.uid);
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  signUp: async (email, password, username) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const userDoc = {
      id: uid,
      email,
      username: username || "",
      createdAt: serverTimestamp(),
      profilePic: "",
      cart: [],
      wishlist: [],
      orders: [],
    };
    await setDoc(doc(db, "users", uid), userDoc);
    set({ user: { ...userDoc, createdAt: new Date() }, loading: false });
  },

  signIn: async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await get().loadUserDoc(cred.user.uid);
  },

  signOutUser: async () => {
    await signOut(auth);
    set({ user: null });
  },

  loadUserDoc: async (uid) => {
    set({ loading: true });
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as UserData;
  set({ user: { ...data, id: uid }, loading: false });

    } else {
      const u = auth.currentUser;
      const userDoc = {
        id: uid,
        email: u?.email || "",
        username: "",
        createdAt: serverTimestamp(),
        profilePic: "",
        cart: [],
        wishlist: [],
        orders: [],
      };
      await setDoc(docRef, userDoc);
      set({ user: userDoc as any, loading: false });
    }
  },

  addToCart: async (productId, qty = 1) => {
    const user = get().user;
    if (!user) throw new Error("Not signed in");
    const uid = user.id;
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    const data = snap.exists() ? (snap.data() as DocumentData) : {};
    const cart: CartItem[] = (data.cart as CartItem[]) || [];

    const idx = cart.findIndex((c) => c.productId === productId);
    if (idx >= 0) {
      cart[idx].qty += qty;
    } else {
      cart.push({ productId, qty });
    }
    await updateDoc(docRef, { cart });
    await get().loadUserDoc(uid);
  },

  removeFromCart: async (productId) => {
    const user = get().user;
    if (!user) throw new Error("Not signed in");
    const uid = user.id;
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    const cart: CartItem[] = (snap.exists() ? (snap.data() as DocumentData).cart : []) || [];
    const newCart = cart.filter((c) => c.productId !== productId);
    await updateDoc(docRef, { cart: newCart });
    await get().loadUserDoc(uid);
  },

  updateCartQty: async (productId, qty) => {
    const user = get().user;
    if (!user) throw new Error("Not signed in");
    const uid = user.id;
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    const cart: CartItem[] = (snap.exists() ? (snap.data() as DocumentData).cart : []) || [];
    const idx = cart.findIndex((c) => c.productId === productId);
    if (idx >= 0) {
      cart[idx].qty = qty;
      await updateDoc(docRef, { cart });
      await get().loadUserDoc(uid);
    }
  },

  toggleWishlist: async (productId) => {
  const user = get().user;
  if (!user) throw new Error("Not signed in");
  const uid = user.id;
  const docRef = doc(db, "users", uid);
  const wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];

  const isInWishlist = wishlist.includes(productId);

  try {
    await updateDoc(docRef, {
      wishlist: isInWishlist
        ? arrayRemove(productId)
        : arrayUnion(productId),
    });

    set({
      user: {
        ...user,
        wishlist: isInWishlist
          ? wishlist.filter((id) => id !== productId)
          : [...wishlist, productId],
      },
    });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
  }
},


  placeOrder: async (items, totalCost) => {
    const user = get().user;
    if (!user) throw new Error("Not signed in");
    const order = {
      userId: user.id,
      items,
      totalCost,
      status: "placed",
      createdAt: serverTimestamp(),
    };
    const orderRef = await addDoc(collection(db, "orders"), order);
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { orders: arrayUnion(orderRef.id), cart: [] }); 
    await get().loadUserDoc(user.id);
  },
}));
