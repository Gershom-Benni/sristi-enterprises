// store/useProductStore.ts
import { create } from "zustand";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export type Review = {
  id: string;
  productId: string;
  userId: string;
  username: string;
  comment: string;
  rating: number;
  createdAt?: any;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  rating?: number;
  description?: string;
  createdAt?: any;
  reviews?: Review[];
};

type ProductStore = {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: () => Product[];
  fetchProducts: () => Promise<void>;
  subscribeToProducts: () => () => void;
  getProductById: (id: string) => Product | undefined;
  getReviewsByProductId: (productId: string) => Promise<Review[]>;
  addReview: (
    productId: string,
    review: Omit<Review, "id" | "createdAt">
  ) => Promise<void>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  searchQuery: "",
  fetchProducts: async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const products = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as DocumentData),
    })) as Product[];
    set({ products });
  },

  subscribeToProducts: () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as DocumentData),
      })) as Product[];
      set({ products });
    });
    return unsubscribe;
  },

  getProductById: (id) => {
    const { products } = get();
    return products.find((p) => p.id === id);
  },

  getReviewsByProductId: async (productId) => {
    const reviewsCol = collection(db, "products", productId, "reviews");
    const q = query(reviewsCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as DocumentData),
    })) as Review[];
  },

  addReview: async (productId, review) => {
    const reviewsCol = collection(db, "products", productId, "reviews");
    await addDoc(reviewsCol, { ...review, createdAt: serverTimestamp() });
  },

  setSearchQuery: (text) => set({ searchQuery: text }),

  filteredProducts: () => {
    const { products, searchQuery } = get();
    if (!searchQuery.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },

}));
