import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CategoryManagementScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});

  useEffect(() => {
    loadCategories();
    loadTaskCounts();
  }, []);

  const loadCategories = async () => {
    const stored = await AsyncStorage.getItem("categories");
    if (stored) {
      setCategories(JSON.parse(stored));
    }
  };

  const loadTaskCounts = async () => {
    const stored = await AsyncStorage.getItem("tasks");
    const tasks = stored ? JSON.parse(stored) : [];
    const counts = {};
    tasks.forEach((task) => {
      counts[task.category] = (counts[task.category] || 0) + 1;
    });
    setTaskCounts(counts);
  };

  const deleteCategory = async (name) => {
    const updated = categories.filter((cat) => cat.name !== name);
    await AsyncStorage.setItem("categories", JSON.stringify(updated));
    setCategories(updated);
  };

  const handleDelete = (name) => {
    Alert.alert("Kategori Sil", `"${name}" kategorisini silmek istiyor musun?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: () => deleteCategory(name),
      },
    ]);
  };

  const renderIcon = (icon, color = "#000", size = 20) => (
    <Ionicons name={icon || "pricetag"} size={size} color={color} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Kapat</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Kategoriler</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddCategoryScreen")}>
          <Ionicons name="add" size={24} color="#059669" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.leftSide}>
              <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                {renderIcon(item.iconName, "#fff")}
              </View>
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <Text style={styles.count}>{taskCounts[item.name] || 0} görev</Text>
            <TouchableOpacity onPress={() => handleDelete(item.name)}>
              <Ionicons name="trash" size={22} color="#dc2626" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Hiç kategori eklenmedi.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cancel: { fontSize: 16, color: "#065f46" },
  title: { fontSize: 20, fontWeight: "bold", color: "#065f46" },
  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSide: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "600", color: "#111827" },
  count: { fontSize: 13, color: "#6b7280" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#9ca3af" },
});
