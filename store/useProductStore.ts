import { create } from "zustand";

type Review = {
  id: string;
  productId: string;
  user: string;
  comment: string;
  rating: number;
};

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  description?: string;
  reviews: Review[];
};

type ProductStore = {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: () => Product[];
  fetchProducts: () => void;
  getReviewsByProductId: (id: string) => Review[];
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  searchQuery: "",

  fetchProducts: () => {
    const mockData: Product[] = [
      {
        id: "1",
        name: "Product A",
        price: "₹499",
        image: "https://picsum.photos/800/300?random=1",
        rating: 4.5,
        reviews: [
          {
            id: "r1",
            productId: "1",
            user: "John",
            comment: "Excellent quality and quick delivery!",
            rating: 5,
          },
          {
            id: "r2",
            productId: "1",
            user: "Maya",
            comment: "Value for money, good packaging.",
            rating: 4,
          },
        ],
      },
      {
        id: "2",
        name: "Product B",
        price: "₹699",
        image: "https://picsum.photos/800/300?random=2",
        rating: 3.8,
        reviews: [
          {
            id: "r3",
            productId: "2",
            user: "Alex",
            comment: "Okay product, could be better.",
            rating: 3,
          },
        ],
      },
      {
        id: "3",
        name: "Product C",
        price: "₹799",
        image: "https://picsum.photos/800/300?random=3",
        rating: 5,
        reviews: [
          {
            id: "r4",
            productId: "3",
            user: "Tina",
            comment: "Absolutely loved it!",
            rating: 5,
          },
        ],
      },
      {
        id: "4",
        name: "Product D",
        price: "₹799",
        image: "https://picsum.photos/800/300?random=4",
        rating: 5,
        reviews: [
          {
            id: "r4",
            productId: "3",
            user: "Tina",
            comment: "Absolutely loved it!",
            rating: 5,
          },
        ],
      },
      {
        id: "5",
        name: "Product C",
        price: "₹799",
        image: "https://picsum.photos/800/300?random=5",
        rating: 5,
        reviews: [
          {
            id: "r4",
            productId: "3",
            user: "Tina",
            comment: "Absolutely loved it!",
            rating: 5,
          },
        ],
      },
      {
        id: "6",
        name: "Product C",
        price: "₹799",
        image: "https://picsum.photos/800/300?random=6",
        rating: 5,
        reviews: [
          {
            id: "r4",
            productId: "3",
            user: "Tina",
            comment: "Absolutely loved it!",
            rating: 5,
          },
        ],
      },
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

  getReviewsByProductId: (id: string) => {
    const { products } = get();
    const product = products.find((p) => p.id === id);
    return product ? product.reviews : [];
  },
}));
