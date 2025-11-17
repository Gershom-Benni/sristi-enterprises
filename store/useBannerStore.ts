import { create } from "zustand";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

type BannerStore = {
  posters: string[];
  fetchPosters: () => Promise<void>;
  subscribePosters: () => () => void;
};

export const useBannerStore = create<BannerStore>((set) => ({
  posters: [],

  fetchPosters: async () => {
    const docRef = doc(db, "banners", "home");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      set({ posters: snap.data().posters || [] });
    }
  },

  subscribePosters: () => {
    const docRef = doc(db, "banners", "home");
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        set({ posters: snap.data().posters || [] });
      }
    });
    return unsub;
  },
}));
