import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const availableIcons = [
  "person",
  "briefcase",
  "book",
  "cart",
  "checkmark",
  "heart",
];

const availableColors = [
  "#0d9488", "#be185d", "#15803d", "#ea580c", "#1d4ed8", "#dc2626",
];

export default function AddCategoryScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("person");
  const [selectedColor, setSelectedColor] = useState("#0d9488");

  const saveCategory = async () => {
    if (!name.trim()) {
      Alert.alert("Uyarı", "Lütfen bir kategori adı gir.");
      return;
    }

    try {
      const stored = await AsyncStorage.getItem("categories");
      const existing = stored ? JSON.parse(stored) : [];
      const alreadyExists = existing.some((c) => c.name === name);

      if (alreadyExists) {
        Alert.alert("Hata", "Bu isimde bir kategori zaten var.");
        return;
      }

      const newCategory = {
        name,
        iconName: selectedIcon,
        color: selectedColor,
      };

      const updated = [...existing, newCategory];
      await AsyncStorage.setItem("categories", JSON.stringify(updated));
      navigation.goBack();
    } catch (err) {
      console.error("Kategori eklenemedi:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Yeni Kategori</Text>

      <Text style={styles.label}>Kategori Adı</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Örn: Dersler, Spor..."
      />

      <Text style={styles.label}>İkon Seç</Text>
      <View style={styles.row}>
        {availableIcons.map((icon) => (
          <TouchableOpacity
            key={icon}
            onPress={() => setSelectedIcon(icon)}
            style={[
              styles.iconBox,
              selectedIcon === icon && { borderColor: "#10b981", borderWidth: 2 },
            ]}
          >
            <Ionicons name={icon} size={24} color="#374151" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Renk Seç</Text>
      <View style={styles.row}>
        {availableColors.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => setSelectedColor(color)}
            style={[
              styles.colorBox,
              { backgroundColor: color },
              selectedColor === color && { borderWidth: 2, borderColor: "#000" },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveCategory}>
        <Text style={styles.saveButtonText}>+ Kategori Ekle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f0fdf4", flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", color: "#065f46", marginBottom: 16 },
  label: { fontSize: 16, color: "#065f46", fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderColor: "#d1d5db",
    borderWidth: 1,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
