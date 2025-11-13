import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  FlatList,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import { useRouter,useLocalSearchParams } from "expo-router";
import { useProductStore, Review } from "../../store/useProductStore";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/useUserStore";

const ButtonClickAnimation = ({
  pressed,
}: {
  pressed: boolean;
}): StyleProp<ViewStyle> => [
  {
    width: "100%",
    alignItems: "center",
    backgroundColor: pressed ? "#e4b93a" : "#eec33d",
    padding: 8,
    borderRadius: 10,
    marginTop: 20,
    transform: [{ scale: pressed ? 0.99 : 1 }],
  },
];

const LoginButtonClickAnimation = ({
  pressed,
}: {
  pressed: boolean;
}): StyleProp<ViewStyle> => [
  {
    width: "100%",
    alignItems: "center",
    borderColor: pressed ? "#4CAF50" : "#eec33d",
    borderWidth: 2,
    padding: 8,
    borderRadius: 10,
    marginTop: 20,
    transform: [{ scale: pressed ? 0.99 : 1 }],
  },
];

const AnimatedHeart = ({
  isWishlisted,
  onPress,
}: {
  isWishlisted: boolean;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.05, { damping: 8, stiffness: 150 }, () => {
      scale.value = withSpring(1, { damping: 8, stiffness: 150 });
    });
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.animatedHeart}>
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={isWishlisted ? "heart" : "heart-outline"}
          size={32}
          color={isWishlisted ? "red" : "green"}
        />
      </Animated.View>
    </Pressable>
  );
};

export default function ProductPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [index, setIndex] = useState(0);
  const { products, getReviewsByProductId, addReview } = useProductStore();
  const { user, toggleWishlist, addToCart } = useUserStore();
  const flatListRef = useRef<FlatList>(null);
  const product = products.find((p) => p.id === id);
  const isWishlisted = user?.wishlist?.includes(product?.id || "") ?? false;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  const handleAddToCart = async () => {
    if (!product?.id) {
      Alert.alert("Error", "Product not found!");
      return;
    }

    try {
      await addToCart(product.id);
      Alert.alert("Success", "Added to Cart!");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    const res = await getReviewsByProductId(id);
    setReviews(res);
    setLoadingReviews(false);
    if (user) {
      const userHasReviewed = res.some((review) => review.userId === user.id);
      setHasReviewed(userHasReviewed);
    }
  }, [id, getReviewsByProductId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (!product?.images?.length) return;
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % product.images.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 3000);
    return () => clearInterval(timer);
  }, [index, product?.images?.length]);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  const handleSubmitReview = async () => {
    if (!user)
      return Alert.alert("Login required", "You must be logged in to review.");
    if (hasReviewed)
      return Alert.alert(
        "Already reviewed",
        "You have already reviewed this product."
      );
    if (rating === 0)
      return Alert.alert("Rating required", "Please select a rating.");
    if (!comment.trim())
      return Alert.alert("Comment required", "Please write a review.");

    try {
      await addReview(product.id, {
        userId: user.id,
        username: user.username || "Anonymous",
        comment,
        rating,
      });
      setComment("");
      setRating(0);
      Alert.alert("Success", "Review added!");
      await fetchReviews();
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <FlatList
      data={[{ key: "content" }]}
      renderItem={() => (
        <View style={styles.container}>
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={product.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.carouselImage} />
              )}
              keyExtractor={(item, index) => index.toString()}
              onMomentumScrollEnd={(event) => {
                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const currentIndex = Math.round(
                  contentOffsetX / event.nativeEvent.layoutMeasurement.width
                );
                setIndex(currentIndex);
              }}
            />

            <View style={styles.dotsContainer}>
              {product.images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, { opacity: i === index ? 1 : 0.3 }]}
                />
              ))}
            </View>
          </View>

          <View style={styles.titleWishPrice}>
            <View style={styles.namePrice}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.price}>₹{product.price}</Text>
            </View>

            <View style={styles.WishReviewContainer}>
              <View style={styles.starContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={
                      i < Math.round(product.rating ?? 0)
                        ? "star"
                        : "star-outline"
                    }
                    size={14}
                    color="#f5c518"
                    style={styles.star}
                  />
                ))}
                <Text style={styles.rating}>
                  {product.rating ? product.rating.toFixed(1) : "N/A"}
                </Text>
              </View>

              <View>
                <AnimatedHeart
                  isWishlisted={isWishlisted}
                  onPress={() => toggleWishlist(product.id)}
                />
                <Text style={styles.wishlistTxt}>
                  {isWishlisted ? "Wish List" : "Add To Wish List"}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => ButtonClickAnimation({ pressed })}
            onPress={() => router.push(`/orderSummary?from=product-${product.id}`)}
          >
            <Text style={styles.loginBtnText}>Buy</Text>
          </Pressable>

          <Pressable
            onPress={handleAddToCart}
            style={({ pressed }) => LoginButtonClickAnimation({ pressed })}
          >
            <Text style={styles.loginBtnText}>Add to Cart</Text>
          </Pressable>

          <Text style={styles.heading}>Description</Text>
          <Text style={styles.desc}>
            {product.description || "No description available."}
          </Text>

         
          {!hasReviewed && user && (
            <View style={styles.reviewInputBox}>
              <Text style={styles.AddReviewsTxt}>Add Your Review</Text>
              <View style={{ flexDirection: "row", marginVertical: 10 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Pressable key={i} onPress={() => setRating(i)}>
                    <Ionicons
                      name={i <= rating ? "star" : "star-outline"}
                      size={24}
                      color="#f5c518"
                      style={{ marginHorizontal: 3 }}
                    />
                  </Pressable>
                ))}
              </View>
              <TextInput
                placeholder="Write your review..."
                placeholderTextColor="#666"
                style={styles.reviewInput}
                multiline
                value={comment}
                onChangeText={setComment}
              />
              <Pressable
                style={({ pressed }) => ButtonClickAnimation({ pressed })}
                onPress={handleSubmitReview}
              >
                <Text style={styles.loginBtnText}>Submit Review</Text>
              </Pressable>
            </View>
          )}
           <Text style={styles.heading}>Customer Reviews</Text>

          {loadingReviews ? (
            <Text>Loading reviews...</Text>
          ) : reviews.length === 0 ? (
            <Text style={styles.noreviewTxt}>No reviews yet.</Text>
          ) : (
            reviews.map((item) => (
              <View key={item.id} style={styles.reviewCard}>
                <View style={styles.reviewNameContainer}>
                  <Text style={styles.user}>{item.username}</Text>
                  <View style={styles.starContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={
                          i < Math.round(item.rating) ? "star" : "star-outline"
                        }
                        size={14}
                        color="#f5c518"
                        style={styles.userStar}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.comment}>{item.comment}</Text>
              </View>
            ))
          )}
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f8ffe6", padding: 10 },
  namePrice: { width: "70%" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 12 },
  name: { fontSize: 18,  color: "#333" , fontWeight:700},
  rating: { fontSize: 14, color: "#333", marginLeft: 5 },
  wishlistTxt: {
    color: "green",
    textAlign: "center",
    fontWeight:400,
    fontSize: 12,
  },
  price: {
    fontSize: 18,
    color: "green",
    marginTop: 9,
    fontWeight:500,
  },
  heading: {
    fontSize: 20,
    fontWeight:700,
    marginTop: 20,
    marginBottom: 8,
    color: "#333",
  },
  AddReviewsTxt: {
    fontSize: 20,
    fontWeight:700,
    marginTop:8,
    marginBottom: 8,
    color: "#333",
  },
  animatedHeart: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  desc: { fontSize: 14.5, color: "#333",fontWeight:400, },
  reviewCard: {
    backgroundColor: "#e4e3bb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  user: { fontSize: 16, color: "#333",fontWeight:500, },
  comment: {
    marginTop: 4,
    color: "#333",
    fontWeight:400,
    fontSize: 13,
  },
  star: { marginTop: 2.5, marginRight: 2.5 },
  userStar: { marginRight: 2.5 },
  titleWishPrice: { flexDirection: "row" },
  WishReviewContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 3.5,
  },
  reviewNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noreviewTxt: { fontWeight:400, },
  loginBtnText: {
    fontWeight:500,
    fontSize: 16,
    color: "#333",
  },
  starContainer: { flexDirection: "row" },
  carouselContainer: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  carouselImage: {
    width: Dimensions.get("window").width,
    height: 250,
    resizeMode: "stretch",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "green",
    marginHorizontal: 4,
  },
  reviewInputBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e4e3bb",
    borderRadius: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    fontSize: 14,
    fontWeight:400,
    backgroundColor: "#f8ffe6",
    color: "#333",
  },
});