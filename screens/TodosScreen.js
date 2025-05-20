import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Platform } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import uuid from 'react-native-uuid';

const getDefaultCategories = () => ([
  { id: uuid.v4(), name: "Kişisel", iconName: "person", color: "#0d9488" },
  { id: uuid.v4(), name: "İş", iconName: "briefcase", color: "#be185d" },
  { id: uuid.v4(), name: "Okul", iconName: "book", color: "#571580" },
  { id: uuid.v4(), name: "Alışveriş", iconName: "cart", color: "#ea580c" },
]);


function hexToRgba(hex, opacity = 1) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}


const getPriorityStyle = (level) => {
  switch (level) {
    case "Yüksek": return { backgroundColor: "#fee2e2", borderColor: "#dc2626" };
    case "Orta": return { backgroundColor: "#fef3c7", borderColor: "#ca8a04" };
    case "Düşük": return { backgroundColor: "#d1fae5", borderColor: "#059669" };
    default: return {};
  }
};

const renderIcon = (name, color = "#fff", size = 18) => (
  <Ionicons name={name || "pricetag"} size={size} color={color} />
);

export default function TodosScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { themeColor } = useAppContext();
  const styles = useMemo(() => getStyles(themeColor), [themeColor]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState("active");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewFilter, setViewFilter] = useState("Tümü");
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const initAndLoadCategories = async () => {
    try {
      const stored = await AsyncStorage.getItem("categories");
      const parsed = stored ? JSON.parse(stored) : [];

      if (!stored || parsed.length === 0) {
        const defaults = getDefaultCategories();
        await AsyncStorage.setItem("categories", JSON.stringify(defaults));
        setCategories(defaults);
      } else {
        setCategories(parsed);
      }
    } catch (error) {
      console.error("Kategori yükleme hatası:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];

      const safeTasks = parsedTasks.map((task) => {
        if (!task.id) {
          return { ...task, id: uuid.v4(), };
        }
        return task;
      });


      setTasks(safeTasks);

    } catch (error) {
      console.error("Görev yükleme hatası:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const updated = tasks.filter((task) => task.id !== taskId);
    await AsyncStorage.setItem("tasks", JSON.stringify(updated));
    setTasks(updated);
  };

  useFocusEffect(
    useCallback(() => {
      initAndLoadCategories();
      loadTasks();
    },)
  );

  const toggleTaskCompletion = async (taskId) => {
    const updated = tasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    await AsyncStorage.setItem("tasks", JSON.stringify(updated));
    setTasks(updated);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchCategory =
      selectedCategory === "Tümü" ||
      (task.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim());

    const matchCompletion =
      viewFilter === "Tümü"
        ? true
        : viewFilter === "Aktif"
          ? !task.isCompleted
          : task.isCompleted;

    const matchSearch =
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase());

    return matchCategory && matchCompletion && matchSearch;
  });


  const allCategories = [
    { name: "Tümü", iconName: "grid", color: "#7c3aed" },
    ...categories,
  ];


  const renderTaskCard = (task) => (
    <View key={task.id.toString()} style={styles.taskCard}>
      <TouchableOpacity
        onPress={() => toggleTaskCompletion(task.id)}
        style={[
          styles.circle,
          task.isCompleted && { backgroundColor: "#7c3aed", borderColor: "#7c3aed" },
        ]}
      >
        {task.isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.taskTitle,
            task.isCompleted && { textDecorationLine: "line-through", color: "#9ca3af" },
          ]}
        >
          {task.title}
        </Text>
        <Text style={[styles.taskDescription, task.isCompleted && { color: "#9ca3af" }]}>
          {task.description}
        </Text>

        <View style={{ flexDirection: "row", marginTop: 4, alignItems: "center" }}>
          <View
            style={{
              marginRight: 8,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 8,
              ...getPriorityStyle(task.priority),
            }}
          >
            <Text style={{ fontSize: 12 }}>{task.priority}</Text>
          </View>
          {task.deadline && (
            <Text style={{ fontSize: 12, color: "#6b7280" }}>
              📅 {new Date(task.deadline).toLocaleDateString("tr-TR")}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteTask(task.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash" size={18} color="#f87171" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={24} color={themeColor} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Yapılacaklar</Text>
        <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)}>
          <Ionicons name="search" size={22} color={themeColor} />
        </TouchableOpacity>

      </View>

      {/* Kategoriler */}
      <View style={styles.categoryTopRow}>
        <Text style={styles.label}>Kategoriler</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CategoryManagementScreen")}>
          <Text style={styles.manageButton}>⚙️ Yönet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        style={{ maxHeight: 75 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 4,
        }}
      >

        {allCategories.map((cat) => (
          <TouchableOpacity
            key={cat.name}
            style={[styles.categoryButton, selectedCategory === cat.name && { borderColor: cat.color }, { marginRight: 12 }]}
            onPress={() => setSelectedCategory(cat.name)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
              {renderIcon(cat.iconName)}
            </View>
            <Text style={[styles.categoryText, selectedCategory === cat.name && { color: cat.color }]}>
              {cat.name === "Tümü" ? "Tüm" : cat.name}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.categoryButton, { borderColor: "#d1fae5", marginRight: 0 }]}
          onPress={() => navigation.navigate("AddCategoryScreen")}
        >
          <View style={[styles.categoryIcon, { backgroundColor: "#d1fae5" }]}>
            <Ionicons name="add" size={20} color="#047857" />
          </View>
          <Text style={[styles.categoryText, { color: "#047857" }]}>Yeni Ekle</Text>
        </TouchableOpacity>

      </ScrollView>
      {isSearchVisible && (
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>

          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Görevlerde ara..."
            style={{
              flex: 1,
              fontSize: 16, // ekstra: daha okunaklı
            }}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />

          <View style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => setFilterMenuVisible(!filterMenuVisible)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: "#e0e7ff",
                borderRadius: 16,
              }}
            >
              <Ionicons name="eye" size={16} color="#3b82f6" style={{ marginRight: 6 }} />
              <Text style={{ color: "#3b82f6" }}>{viewFilter}</Text>
            </TouchableOpacity>

            {filterMenuVisible && (
              <View
                style={{
                  position: "absolute",
                  top: 42,
                  right: 0,
                  backgroundColor: "#fff",
                  padding: 6,
                  borderRadius: 10,
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  zIndex: 10,
                }}
              >
                {["Tümü", "Aktif", "biten"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setViewFilter(option);
                      setFilterMenuVisible(false);
                    }}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                    }}
                  >
                    <Text style={{ color: viewFilter === option ? "#3b82f6" : "#374151" }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      )}



      <View style={styles.categoryHeaderRow}>
        <Text style={styles.categoryTitle}>{selectedCategory}</Text>
        <TouchableOpacity
          style={styles.miniAddButton}
          onPress={() => navigation.navigate("AddTask", { selectedCategory })}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.miniAddButtonText}>Yeni Görev</Text>
        </TouchableOpacity>

      </View>


      {/* Sekmeler */}
      <View style={styles.toggleTabs}>
        <TouchableOpacity
          onPress={() => setViewMode("active")}
          style={[styles.toggleTab, viewMode === "active" && styles.activeTab]}
        >
          <Text style={[styles.toggleText, viewMode === "active" && styles.activeText]}>Aktif</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode("completed")}
          style={[styles.toggleTab, viewMode === "completed" && styles.activeTab]}
        >
          <Text style={[styles.toggleText, viewMode === "completed" && styles.activeText]}>Tamamlanan</Text>
        </TouchableOpacity>
      </View>

      {/* Görev Listesi */}
      <ScrollView style={styles.taskScrollView}>
        {filteredTasks.length === 0 ? (
          <Text style={styles.noTaskText}>Bu kategori ve duruma ait görev bulunamadı.</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {viewMode === "active" ? "Aktif Görevler" : "Tamamlanan Görevler"}
            </Text>
            {filteredTasks.map(renderTaskCard)}
          </>
        )}

      </ScrollView>

      {/* Ekle Butonu */}

    </View>
  );
}


function getStyles(themeColor) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Platform.OS === "ios" ? 12 : 8,
      paddingTop: 14,
      paddingHorizontal: 12,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom:5,
      marginTop:11,
    },
    pageTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: themeColor,
    },
    categoryTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 2,
       marginBottom:5,

    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: themeColor
    },
    categoryHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    deleteButton: {
      marginLeft: 8,
      padding: 6,
    },
    deleteButton: {
      position: "absolute",
      top: 8,
      right: 8,
      padding: 4,
    },

    categoryTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: themeColor,
    },

    miniAddButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColor,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
    },

    miniAddButtonText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "500",
      marginLeft: 4,
    },

    manageButton: {
      fontSize: 14,
      color: themeColor,
    },
    categoryRow: {
      alignItems: "center",
      paddingVertical: 0,
      paddingLeft: 4,
      paddingRight: 4,
      marginBottom: 6,
      marginTop: 4,
    },
    categoryButton: {
      alignItems: "center",
      borderWidth: 1,
      borderColor: "transparent",
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      minWidth: 60,
    },
    categoryIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 2,
    },
    categoryText: {
      fontSize: 12,
      color: "#6b7280",
    },
    toggleTabs: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 4, // 👈 Evet sadece buraya ver
      marginBottom: 2,
    },

    toggleTab: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      marginHorizontal: 6,
      borderRadius: 16,
      backgroundColor: "#e5e7eb",
    },
    toggleText: {
      fontWeight: "600",
      color: "#374151",
    },
    activeTab: {
      backgroundColor: themeColor
    },
    activeText: {
      color: "#fff",
    },
    taskScrollView: {
      flex: 1,
      marginTop: 0,
      marginBottom: 6,
    },
    taskCard: {
      backgroundColor: "#fff",
      padding: 12,
      marginBottom: 6,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    circle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#ccc",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1f2937",
    },
    taskDescription: {
      fontSize: 13,
      color: "#6b7280",
    },

    noTaskText: {
      textAlign: "center",
      color: "#6b7280",
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: themeColor,
    },
  });
}