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
    "id": "1",
    "name": "Organic Honeycomb",
    "price": "₹499",
    "image": "https://picsum.photos/800/300?random=1",
    "rating": 4.5,
    "description": "Pure, unfiltered, and raw honeycomb straight from the hive. A delicious and natural source of energy and antioxidants.",
    "reviews": [
      {
        "id": "r1",
        "productId": "1",
        "user": "John",
        "comment": "Excellent quality and quick delivery! Natural sweetness.",
        "rating": 5
      },
      {
        "id": "r2",
        "productId": "1",
        "user": "Maya",
        "comment": "Value for money, good packaging. Very fresh.",
        "rating": 4
      }
    ]
  },
  {
    "id": "2",
    "name": "Natural Lavender Soap Bar",
    "price": "₹699",
    "image": "https://picsum.photos/800/300?random=2",
    "rating": 3.8,
    "description": "Handmade soap enriched with essential lavender oil. Gently cleanses and calms the skin, perfect for a relaxing bath.",
    "reviews": [
      {
        "id": "r3",
        "productId": "2",
        "user": "Alex",
        "comment": "Okay product, could be better. Scent is mild.",
        "rating": 3
      }
    ]
  },
  {
    "id": "3",
    "name": "Organic Almond Milk (1L)",
    "price": "₹799",
    "image": "https://picsum.photos/800/300?random=3",
    "rating": 5,
    "description": "Unsweetened and dairy-free almond milk made from 100% organic almonds. Great for coffee, smoothies, or drinking straight.",
    "reviews": [
      {
        "id": "r4",
        "productId": "3",
        "user": "Tina",
        "comment": "Absolutely loved it! Creamy texture and great taste.",
        "rating": 5
      }
    ]
  },
  {
    "id": "4",
    "name": "Wild Berry Jam (200g)",
    "price": "₹299",
    "image": "https://picsum.photos/800/300?random=4",
    "rating": 4.2,
    "description": "Made with wild-picked, forest berries and natural cane sugar. No artificial preservatives or colors. Taste the wilderness!",
    "reviews": [
      {
        "id": "r5",
        "productId": "4",
        "user": "Rajesh",
        "comment": "Perfect amount of tartness. Great on toast.",
        "rating": 4
      },
      {
        "id": "r6",
        "productId": "4",
        "user": "Simran",
        "comment": "A bit pricey, but the quality is unmatched.",
        "rating": 5
      }
    ]
  },
  {
    "id": "5",
    "name": "Eco-Friendly Jute Bag",
    "price": "₹199",
    "image": "https://picsum.photos/800/300?random=5",
    "rating": 4.7,
    "description": "Durable and reusable shopping bag made from sustainable jute fiber. Help reduce plastic waste with this stylish carryall.",
    "reviews": [
      {
        "id": "r7",
        "productId": "5",
        "user": "Priya",
        "comment": "Sturdy and spacious, great for groceries.",
        "rating": 5
      }
    ]
  },
  {
    "id": "6",
    "name": "Himalayan Pink Salt (1kg)",
    "price": "₹349",
    "image": "https://picsum.photos/800/300?random=6",
    "rating": 4.9,
    "description": "Finely ground pink salt, rich in trace minerals. Adds a subtle, complex flavor to any dish. Naturally sourced from the Himalayas.",
    "reviews": [
      {
        "id": "r8",
        "productId": "6",
        "user": "Vivek",
        "comment": "The best salt I've ever used. Great texture.",
        "rating": 5
      },
      {
        "id": "r9",
        "productId": "6",
        "user": "Deepa",
        "comment": "Worth the price, beautiful color.",
        "rating": 5
      }
    ]
  },
  {
    "id": "7",
    "name": "Organic Turmeric Powder",
    "price": "₹249",
    "image": "https://picsum.photos/800/300?random=7",
    "rating": 4.1,
    "description": "High-curcumin content turmeric, stone-ground for maximum potency. Perfect for cooking and natural health remedies.",
    "reviews": [
      {
        "id": "r10",
        "productId": "7",
        "user": "Karan",
        "comment": "Very potent and pure. Exactly what I was looking for.",
        "rating": 4
      }
    ]
  },
  {
    "id": "8",
    "name": "Natural Bamboo Toothbrush",
    "price": "₹129",
    "image": "https://picsum.photos/800/300?random=8",
    "rating": 4.4,
    "description": "An eco-friendly alternative to plastic. The bamboo handle is biodegradable, and the soft bristles offer effective cleaning.",
    "reviews": [
      {
        "id": "r11",
        "productId": "8",
        "user": "Shreya",
        "comment": "Good grip and gentle on the gums.",
        "rating": 5
      }
    ]
  },
  {
    "id": "9",
    "name": "Organic Green Tea Bags (25)",
    "price": "₹429",
    "image": "https://picsum.photos/800/300?random=9",
    "rating": 4.6,
    "description": "Premium whole-leaf green tea from high-altitude gardens. Provides a smooth, earthy taste and a gentle energy boost.",
    "reviews": [
      {
        "id": "r12",
        "productId": "9",
        "user": "Amit",
        "comment": "Refreshing taste and great aroma.",
        "rating": 5
      },
      {
        "id": "r13",
        "productId": "9",
        "user": "Nisha",
        "comment": "My new favorite daily tea.",
        "rating": 4
      }
    ]
  },
  {
    "id": "10",
    "name": "Vegan Lip Balm (Unscented)",
    "price": "₹189",
    "image": "https://picsum.photos/800/300?random=10",
    "rating": 4.0,
    "description": "100% vegan and petroleum-free. Hydrates dry lips using natural shea butter and plant waxes. Suitable for sensitive skin.",
    "reviews": [
      {
        "id": "r14",
        "productId": "10",
        "user": "Suresh",
        "comment": "Moisturizes well, non-greasy.",
        "rating": 4
      }
    ]
  },
  {
    "id": "11",
    "name": "Heirloom Tomato Seeds",
    "price": "₹99",
    "image": "https://picsum.photos/800/300?random=11",
    "rating": 3.5,
    "description": "Open-pollinated seeds for rare and colorful heirloom tomatoes. Perfect for home gardening and preserving biodiversity.",
    "reviews": [
      {
        "id": "r15",
        "productId": "11",
        "user": "Gita",
        "comment": "Seeds germinated quickly, happy with the purchase.",
        "rating": 4
      }
    ]
  },
  {
    "id": "12",
    "name": "Cold-Pressed Coconut Oil (500ml)",
    "price": "₹599",
    "image": "https://picsum.photos/800/300?random=12",
    "rating": 4.8,
    "description": "Extracted without heat to retain natural nutrients. Ideal for high-heat cooking, skin moisturizing, and hair conditioning.",
    "reviews": [
      {
        "id": "r16",
        "productId": "12",
        "user": "Anjali",
        "comment": "Excellent for cooking and hair.",
        "rating": 5
      }
    ]
  },
  {
    "id": "13",
    "name": "Natural Surface Cleaner (Eucalyptus)",
    "price": "₹399",
    "image": "https://picsum.photos/800/300?random=13",
    "rating": 4.3,
    "description": "Plant-derived formula that cuts through grease and grime. Leaves a fresh eucalyptus scent without toxic fumes or residues.",
    "reviews": [
      {
        "id": "r17",
        "productId": "13",
        "user": "Rahul",
        "comment": "Cleans effectively without harsh chemicals. Smells great.",
        "rating": 4
      }
    ]
  },
  {
    "id": "14",
    "name": "Organic Whole Wheat Flour (1kg)",
    "price": "₹149",
    "image": "https://picsum.photos/800/300?random=14",
    "rating": 4.5,
    "description": "Stone-ground whole wheat atta, rich in fiber and nutrients. Perfect for making soft rotis, bread, and baked goods.",
    "reviews": [
      {
        "id": "r18",
        "productId": "14",
        "user": "Meera",
        "comment": "Made excellent rotis. Highly recommend.",
        "rating": 5
      }
    ]
  },
  {
    "id": "15",
    "name": "Aromatherapy Diffuser Oil (Jasmine)",
    "price": "₹549",
    "image": "https://picsum.photos/800/300?random=15",
    "rating": 4.7,
    "description": "100% pure essential oil for diffusers. The calming jasmine scent helps reduce stress and creates a soothing environment.",
    "reviews": [
      {
        "id": "r19",
        "productId": "15",
        "user": "Zoya",
        "comment": "Subtle and calming fragrance. Love it!",
        "rating": 5
      }
    ]
  }
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
