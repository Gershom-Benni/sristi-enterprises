import {Text, Pressable,StyleSheet} from 'react-native'
import { Link, useRouter } from "expo-router";
export default function Home() {
     const router = useRouter();
    return (
        <>
            <Text>Welcome to Homepage</Text>
            <Pressable onPress={() => router.push("/signup")} style={styles.btn}>
                <Text>Signup Page</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/login")} style={styles.btn}>
                <Text>Login Page</Text>
            </Pressable>
        </>
    )
}
const styles = StyleSheet.create({
    btn:{
        width:100,
        height:50,
        backgroundColor:'red',
        marginTop:10,
    }
})