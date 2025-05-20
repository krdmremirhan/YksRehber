import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { fetchTasks } from "../data/tasks"; // Görevleri getir
import { fetchCategories } from "../data/categories"; // Kategorileri getir

export default function TodosScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Kişisel");

  useEffect(() => {
    fetchTasks().then(setTasks);
    fetchCategories().then(setCategories);
  }, []);

  const filteredTasks = tasks.filter(
    (task) => task.category === selectedCategory
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        item === selectedCategory && styles.categorySelected,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskRow}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={[styles.priority, styles[item.priority.toLowerCase()]]}>
          {item.priority}
        </Text>
      </View>
      <Text style={styles.taskDesc}>{item.description}</Text>
      {item.deadline ? (
        <View style={styles.dateRow}>
          <Ionicons name="calendar" size={16} color="#e11d48" />
          <Text style={styles.deadlineText}>{item.deadline}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{selectedCategory}</Text>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={renderCategory}
        contentContainerStyle={styles.categoryList}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTask}
        contentContainerStyle={styles.taskList}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddTask")}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.buttonText}>Yeni Görev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.manageButton]}
          onPress={() => navigation.navigate("ManageCategories")}
        >
          <Ionicons name="settings-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Yönet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#ffe4e6" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 8, color: "#e11d48" },
  categoryList: { marginBottom: 16 },
  categoryButton: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  categorySelected: {
    backgroundColor: "#06b6d4",
  },
  categoryText: {
    fontSize: 14,
    color: "#0f172a",
  },
  taskList: { gap: 12 },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  taskTitle: { fontSize: 16, fontWeight: "bold" },
  taskDesc: { color: "#4b5563", marginBottom: 8 },
  priority: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
    color: "#fff",
  },
  düşük: { backgroundColor: "#3b82f6" },
  orta: { backgroundColor: "#f59e0b" },
  yüksek: { backgroundColor: "#ef4444" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  deadlineText: { color: "#e11d48", fontSize: 13 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    marginRight: 8,
  },
  manageButton: {
    backgroundColor: "#6366f1",
    marginRight: 0,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
});
