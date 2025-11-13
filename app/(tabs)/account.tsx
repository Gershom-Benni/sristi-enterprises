import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import { useRouter } from "expo-router";
export default function Account() {
  const { user, updateContactInfo, updateUserName, signOutUser, loadUserDoc } = useUserStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      setName(user.username || "");
      setPhone(user.phoneNumber || "");
      setAddress(user.address || "");
      setIsSaved(true);
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() && !phone.trim() && !address.trim()) {
      Alert.alert("Empty Fields", "Please fill at least one field before saving.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (phone.trim() && !phoneRegex.test(phone.trim())) {
      Alert.alert("Invalid Phone", "Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      await updateUserName(name.trim());
      await updateContactInfo(address.trim(), phone.trim());
      await loadUserDoc(user!.id);
      setIsEditing(false);
      setIsSaved(true);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      console.log("Error updating profile:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.replace('/(auth)/login')
      Alert.alert("Signed Out", "You have been signed out successfully.");

    } catch (err) {
      console.log("Error signing out:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
        {isSaved && (
          <TouchableOpacity style={styles.headerEdit} onPress={() => setIsEditing(true)}>
            <Ionicons name="create-outline" size={18} color="#1a1a1a" />
            <Text style={styles.headerEditText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              placeholder="John Doe"
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={name}
              onChangeText={setName}
              editable={isEditing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              placeholder="+91 98765 43210"
              style={[styles.input, !isEditing && styles.disabledInput]}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={isEditing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              placeholder="Street, City, State, PIN"
              style={[styles.textarea, !isEditing && styles.disabledInput]}
              multiline
              value={address}
              onChangeText={setAddress}
              editable={isEditing}
            />
          </View>

          {isEditing ? (
            <View style={styles.actions}>
              <Pressable style={styles.primaryButton} onPress={handleSave}>
                <Text style={styles.primaryText}>Save</Text>
              </Pressable>

              <Pressable style={styles.ghostButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.ghostText}>Cancel</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>

        {isSaved && (
          <View style={styles.savedNote}>
            <Ionicons name="checkmark-done-circle-outline" size={16} color="#155724" />
            <Text style={styles.savedText}>Profile saved</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.select({ ios: 50, android: StatusBar.currentHeight || 24 }),
    backgroundColor: "#f8ffe6ff",
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  headerEdit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e4e3bbf5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  headerEditText: { marginLeft: 6, fontWeight: "600" },
  main: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: "#e4e3bbf5",
    borderRadius: 14,
    padding: 18,
  },
  field: { marginBottom: 12 },
  label: { fontSize: 14, color: "#6b6f76", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#f8ffe6ff",
    borderWidth: 1,
    borderColor: "#e7e9ee",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
  textarea: {
    backgroundColor: "#f8ffe6ff",
    borderWidth: 1,
    borderColor: "#e7e9ee",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 88,
  },
  disabledInput: { backgroundColor: "#f8ffe6ff", color: "#787f87" },
  actions: { marginTop: 12, flexDirection: "row", gap: 10 },
  primaryButton: {
    backgroundColor: "#ffb100",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
  },
  primaryText: { fontWeight: "700", color: "#111" },
  ghostButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6e9ef",
  },
  ghostText: { fontWeight: "700", color: "#444" },
  signOutButton: {
    marginTop: 16,
    backgroundColor: "#ff4d4d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 6,
  },
  savedNote: {
    marginTop: 14,
    backgroundColor: "#dff5e0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  savedText: { color: "#155724", fontWeight: "600" },
});
