import { create } from "zustand";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  description?: string;
};

type ProductStore = {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: () => Product[];
  fetchProducts: () => void; // mock now, Firebase later
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  searchQuery: "",

  fetchProducts: () => {
    const mockData: Product[] = [
      { id: "1", name: "Product A", price: "₹499", image: "https://picsum.photos/800/300?random=1", rating: 4.5 },
      { id: "2", name: "Product B", price: "₹699", image: "https://picsum.photos/800/300?random=2", rating: 3.8 },
      { id: "3", name: "Product C", price: "₹799", image: "https://picsum.photos/800/300?random=3", rating: 5 },
      { id: "4", name: "Product D", price: "₹999", image: "https://picsum.photos/800/300?random=4", rating: 4 },
      { id: "5", name: "Product E", price: "₹1199", image: "https://picsum.photos/800/300?random=5", rating: 4.3 },
      { id: "6", name: "Product F", price: "₹1299", image: "https://picsum.photos/800/300?random=6", rating: 3.9 },
    ];
    set({ products: mockData });
  },
  setSearchQuery: (text: string) => set({ searchQuery: text }),
  filteredProducts: () => {
    const { products, searchQuery } = get();
    if (!searchQuery.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },
}));
