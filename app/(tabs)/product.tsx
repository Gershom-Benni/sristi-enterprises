// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   Pressable,
//   StyleProp,
//   ViewStyle,
//   FlatList,
// } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { useProductStore } from "../../store/useProductStore";
// import {
//   Poppins_400Regular,
//   Poppins_500Medium,
//   Poppins_700Bold,
//   useFonts,
// } from "@expo-google-fonts/poppins";
// import { Ionicons } from "@expo/vector-icons";
// const ButtonClickAnimation = ({
//   pressed,
// }: {
//   pressed: boolean;
// }): StyleProp<ViewStyle> => [
//   {
//     width: "100%",
//     alignItems: "center",
//     backgroundColor: pressed ? "#e4b93a" : "#eec33d",
//     padding: 8,
//     borderRadius: 10,
//     marginTop: 20,
//     transform: [{ scale: pressed ? 0.99 : 1 }],
//   },
// ];

// const LoginButtonClickAnimation = ({
//   pressed,
// }: {
//   pressed: boolean;
// }): StyleProp<ViewStyle> => [
//   {
//     width: "100%",
//     alignItems: "center",
//     borderColor: pressed ? "#4CAF50" : "#eec33d",
//     borderWidth: 2,
//     padding: 8,
//     borderRadius: 10,
//     marginTop: 20,
//     transform: [{ scale: pressed ? 0.99 : 1 }],
//   },
// ];

// export default function ProductPage() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   useFonts({
//     Poppins_400Regular,
//     Poppins_500Medium,
//     Poppins_700Bold,
//   });

//   const { products, getReviewsByProductId } = useProductStore();
//   const product = products.find((p) => p.id === id);
//   if (!product) {
//     return (
//       <View style={styles.center}>
//         <Text>Product not found.</Text>
//       </View>
//     );
//   }

//   const reviews = getReviewsByProductId(id!);

//   const data = [{ key: "content" }];

//   return (
//     <FlatList
//       data={data}
//       renderItem={() => (
//         <View style={styles.container}>
//           <Image source={{ uri: product.images }} style={styles.image} />
//           <View style={styles.titleWishPrice}>
//             <View style={styles.namePrice}>
//             <Text style={styles.name}>{product.name}</Text>
//             <Text style={styles.price}>{product.price}</Text>
//           </View>

//           <View style={styles.WishReviewContainer}>
            
//             <View style={styles.starContainer}>
//               {[...Array(5)].map((_, i) => (
//                 <Ionicons
//                 style={styles.star}
//                   key={i}
//                   name={
//                     i < Math.round(product.rating) ? "star" : "star-outline"
//                   }
//                   size={14}
//                   color="#f5c518"
//                 />
                
//               ))}
//               <Text style={styles.rating}>{product.rating}</Text>
//             </View>
//            <View>
//              <Ionicons
//             name={"heart-outline"}
//             style={styles.addwishListIcon}
//             size={35}
//             color={
//               "green"
//             }
//           />
//           <Text style={styles.wishlistTxt}>Wish List</Text>
//            </View>
//           </View>
//           </View>


//           <Pressable style={({ pressed }) => ButtonClickAnimation({ pressed })}>
//             <Text style={styles.loginBtnText}>Buy</Text>
//           </Pressable>
//           <Pressable
//             style={({ pressed }) => LoginButtonClickAnimation({ pressed })}
//           >
//             <Text style={styles.loginBtnText}>Add to Cart</Text>
//           </Pressable>

//           <Text style={styles.heading}>Description</Text>
//           <Text style={styles.desc}>
//             {product.description || "No description available."}
//           </Text>

//           <Text style={styles.heading}>Customer Reviews</Text>

//           {reviews.length === 0 ? (
//             <Text style={styles.noreviewTxt}>No reviews yet.</Text>
//           ) : (
//             reviews.map((item) => (
//               <View key={item.id} style={styles.reviewCard}>
//                 <View style={styles.reviewNameContainer}>
//                   <Text style={styles.user}>{item.user}</Text>
//                   <View style={styles.starContainer}>
//                     {[...Array(5)].map((_, i) => (
//                       <Ionicons
//                       style={styles.userStar}
//                         key={i}
//                         name={
//                           i < Math.round(item.rating) ? "star" : "star-outline"
//                         }
//                         size={14}
//                         color="#f5c518"
//                       />
//                     ))}
//                   </View>
//                 </View>
//                 <Text style={styles.comment}>{item.comment}</Text>
//               </View>
//             ))
//           )}
//         </View>
//       )}
//       showsVerticalScrollIndicator={false}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: { backgroundColor: "#f8ffe6", padding: 10 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 12 },
//   name: { fontSize: 18, fontFamily: "Poppins_700Bold", color: "#333" },
//   rating: { fontSize: 14, color: "#333",marginLeft:5},
//   addwishListIcon:{
//     marginLeft:'auto',
//     marginRight:'auto',
//   },
//   wishlistTxt:{
//     color:"green",
//     textAlign:'center',
//     fontFamily: "Poppins_400Regular",
//     fontSize:12
//   },
//   price: {
//     fontSize: 18,
//     color: "green",
//     marginTop: 6,
//     fontFamily: "Poppins_500Medium",
//   },
//   heading: {
//     fontSize: 20,
//     fontFamily: "Poppins_700Bold",
//     marginTop: 20,
//     marginBottom: 8,
//     color: "#333",
//   },
//   desc: { fontSize: 13, color: "#333", fontFamily: "Poppins_400Regular" },
//   reviewCard: {
//     backgroundColor: "#e4e3bb",
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   user: { fontSize: 16, color: "#333", fontFamily: "Poppins_500Medium" },
//   comment: {
//     marginTop: 4,
//     color: "#333",
//     fontFamily: "Poppins_400Regular",
//     fontSize: 13,
//   },
//   star: { marginTop:2.5, marginRight:2.5},
//   userStar:{marginRight:2.5},
//   titleReviewContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   WishReviewContainer:{
//     flexDirection: "column",
//     justifyContent: "space-between",
//     width:'auto',
//     marginTop:3.5
//   },
//   reviewNameContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   namePrice:{
//     width:'70%'
//   },
//   titleWishPrice:{
//     display:'flex',
//     flexDirection:'row'
//   },
//   noreviewTxt: { fontFamily: "Poppins_400Regular" },
//   loginBtnText: {
//     fontFamily: "Poppins_500Medium",
//     fontSize: 16,
//     color: "#333",
//   },
//   starContainer: {
//     display: "flex",
//     flexDirection: "row",
//   },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useProductStore, Review } from "../../store/useProductStore";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";

const ButtonClickAnimation = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
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

const LoginButtonClickAnimation = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
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

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const { products, getReviewsByProductId } = useProductStore();
  const product = products.find((p) => p.id === id);

  useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      const res = await getReviewsByProductId(id);
      setReviews(res);
      setLoadingReviews(false);
    };
    fetchReviews();
  }, [id]);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  const data = [{ key: "content" }];

  return (
    <FlatList
      data={data}
      renderItem={() => (
        <View style={styles.container}>
          <Image source={{ uri: product.images[0] }} style={styles.image} />
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
                    name={i < Math.round(product.rating ?? 0) ? "star" : "star-outline"}
                    size={14}
                    color="#f5c518"
                    style={styles.star}
                  />
                ))}
                <Text style={styles.rating}>{product.rating ?? "N/A"}</Text>
              </View>

              <View>
                <Ionicons name={"heart-outline"} style={styles.addwishListIcon} size={35} color={"green"} />
                <Text style={styles.wishlistTxt}>Wish List</Text>
              </View>
            </View>
          </View>

          <Pressable style={({ pressed }) => ButtonClickAnimation({ pressed })}>
            <Text style={styles.loginBtnText}>Buy</Text>
          </Pressable>
          <Pressable style={({ pressed }) => LoginButtonClickAnimation({ pressed })}>
            <Text style={styles.loginBtnText}>Add to Cart</Text>
          </Pressable>

          <Text style={styles.heading}>Description</Text>
          <Text style={styles.desc}>{product.description || "No description available."}</Text>

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
                        name={i < Math.round(item.rating) ? "star" : "star-outline"}
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
  namePrice:{
    width:'70%'
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 12 },
  name: { fontSize: 18, fontFamily: "Poppins_700Bold", color: "#333" },
  rating: { fontSize: 14, color: "#333", marginLeft: 5 },
  addwishListIcon: { marginLeft: "auto", marginRight: "auto" },
  wishlistTxt: { color: "green", textAlign: "center", fontFamily: "Poppins_400Regular", fontSize: 12 },
  price: { fontSize: 18, color: "green", marginTop: 6, fontFamily: "Poppins_500Medium" },
  heading: { fontSize: 20, fontFamily: "Poppins_700Bold", marginTop: 20, marginBottom: 8, color: "#333" },
  desc: { fontSize: 13, color: "#333", fontFamily: "Poppins_400Regular" },
  reviewCard: { backgroundColor: "#e4e3bb", padding: 10, borderRadius: 8, marginBottom: 8 },
  user: { fontSize: 16, color: "#333", fontFamily: "Poppins_500Medium" },
  comment: { marginTop: 4, color: "#333", fontFamily: "Poppins_400Regular", fontSize: 13 },
  star: { marginTop: 2.5, marginRight: 2.5 },
  userStar: { marginRight: 2.5 },
  titleWishPrice: { flexDirection: "row" },
  WishReviewContainer: { flexDirection: "column", justifyContent: "space-between", marginTop: 3.5 },
  reviewNameContainer: { flexDirection: "row", justifyContent: "space-between" },
  noreviewTxt: { fontFamily: "Poppins_400Regular" },
  loginBtnText: { fontFamily: "Poppins_500Medium", fontSize: 16, color: "#333" },
  starContainer: { flexDirection: "row" },
});
