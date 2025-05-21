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
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import uuid from 'react-native-uuid';
import { Dimensions } from "react-native";

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
  const { width, height } = Dimensions.get("window");

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
    let parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];

    // Yalnızca id'si olmayanlara uuid ata
    parsedTasks = parsedTasks.map((task) => {
      if (!task.id) {
        task.id = uuid.v4();
      }
      if (typeof task.isCompleted !== 'boolean') {
        task.isCompleted = false;
      }
      return task;
    });

    // Güncellenen veriyi kaydet (bir kerelik temizlik için)
    await AsyncStorage.setItem("tasks", JSON.stringify(parsedTasks));
    setTasks(parsedTasks);
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

    const toggledTask = updated.find((t) => t.id === taskId);

   

  };



  const filteredTasks = tasks.filter((task) => {
    const matchCategory =
      selectedCategory === "Tümü" ||
      (task.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim());

    const matchCompletion =
      viewMode === "active"
        ? !task.isCompleted
        : viewMode === "completed"
          ? task.isCompleted
          : true;

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
      <View style={{ marginRight: 10 }}>
  <TouchableOpacity
    onPress={() => {
      console.log("Tıklandı:", task.title); // Test için
      toggleTaskCompletion(task.id);
    }}
    activeOpacity={0.7}
    style={[
      {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: task.isCompleted ? "#7c3aed" : "#d1d5db",
        backgroundColor: task.isCompleted ? "#7c3aed" : "transparent",
        justifyContent: "center",
        alignItems: "center",
      },
    ]}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    {task.isCompleted && <Ionicons name="checkmark" size={14} color="#fff" />}
  </TouchableOpacity>
</View>


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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 24 }}>
          <Ionicons name="chevron-back" size={24} color={themeColor} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Yapılacaklar</Text>

        <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)} style={{ width: 24, alignItems: 'flex-end' }}>
          <Ionicons name="search" size={22} color={themeColor} />
        </TouchableOpacity>
      </View>


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
<Text>
  {renderIcon("pricetag-outline")}
</Text>
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingVertical: 6,
            paddingHorizontal: 4,
            backgroundColor: "#f3f4f6",
            borderRadius: 12,
            marginVertical: 8,
          }}
        >
          <Ionicons name="search" size={20} color="#6b7280" style={{ marginLeft: 4 }} />

          <TextInput
            placeholder="Görevlerde ara..."
            style={{
              flex: 1,
              fontSize: 15,
              paddingVertical: 4,
              paddingHorizontal: 6,
              color: "#111827",
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
              <Text style={{ color: "#3b82f6", fontSize: 13 }}>{viewFilter}</Text>
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
                {["Tümü", "Aktif", "Tamamlanan"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setViewFilter(option);
                      setFilterMenuVisible(false);

                      // Seçilen filtreye göre viewMode'u ayarla
                      if (option === "Tümü") {
                        setViewMode("all");
                      } else if (option === "Aktif") {
                        setViewMode("active");
                      } else if (option === "Tamamlanan") {
                        setViewMode("completed");
                      }
                    }}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: viewFilter === option ? "#3b82f6" : "#374151",
                        fontSize: 13,
                      }}
                    >
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

    </SafeAreaView>

  );
}


function getStyles(themeColor) {
  const { width } = Dimensions.get("window");

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f9fafb",
      paddingHorizontal: width * 0.04,
      paddingTop: 0,
    },

    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 0,
      marginBottom: 16,
      paddingHorizontal: 4,
    },


    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
      color: themeColor,
    },


    pageTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: themeColor,
    },
    categoryTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 6,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: themeColor,
    },
    categoryHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 10,
      paddingHorizontal: 4,
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
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
    },
    miniAddButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "500",
      marginLeft: 6,
    },
    manageButton: {
      fontSize: 14,
      color: themeColor,
    },
    categoryButton: {
      alignItems: "center",
      borderWidth: 1,
      borderColor: "transparent",
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      minWidth: width * 0.18,
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
      marginVertical: 6,
    },
    toggleTab: {
      paddingVertical: 8,
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
      backgroundColor: themeColor,
    },
    activeText: {
      color: "#fff",
    },
    taskScrollView: {
      flex: 1,
      marginBottom: 6,
    },
    taskCard: {
      backgroundColor: "#fff",
      padding: 12,
      marginBottom: 10,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
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
    deleteButton: {
      position: "absolute",
      top: 8,
      right: 8,
      padding: 4,
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
      paddingHorizontal: 4,
    },
  });
}