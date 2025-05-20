import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { getCategories } from "../utils/categoryStorage";
import { ToastAndroid, Platform } from "react-native";

const renderIcon = (name = "pricetag", color = "#000", size = 20) => {
  switch (name) {
    case "person": return <Ionicons name="person" size={size} color={color} />;
    case "book": return <Ionicons name="book" size={size} color={color} />;
    case "briefcase": return <FontAwesome5 name="briefcase" size={size} color={color} />;
    case "heart": return <Ionicons name="heart" size={size} color={color} />;
    case "cart": return <MaterialIcons name="shopping-cart" size={size} color={color} />;
    case "checkmark": return <Ionicons name="checkmark" size={size} color={color} />;
    default: return <Ionicons name="pricetag" size={size} color={color} />;
  }
};

export default function AddTaskScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Orta");
  const [enableDeadline, setEnableDeadline] = useState(false);
  const [enableReminder, setEnableReminder] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState(route.params?.selectedCategory || "Kişisel");

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const selectedCategory = categories.find(c => c.name === selectedCategoryName);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Uyarı", "Lütfen görev başlığı girin.");
      return;
    }
    try {
          const storedTasks = await AsyncStorage.getItem("tasks"); // ← Bu eklenmeli

      let existing = [];
      try {
        existing = storedTasks ? JSON.parse(storedTasks) : [];
      } catch (e) {
        console.warn("JSON parse hatası:", e);
      }

      const newTask = {
        title,
        description,
        category: selectedCategory?.name || "Genel",
        categoryIconName: selectedCategory?.iconName,
        categoryColor: selectedCategory?.color,
        priority,
        deadline: enableDeadline ? deadline : null,
        reminder: enableReminder ? reminder : null,
        isCompleted: false,
      };
      const updated = [...existing, newTask];
      await AsyncStorage.setItem("tasks", JSON.stringify(updated));
        if (Platform.OS === "android") {
    ToastAndroid.show("Görev başarıyla eklendi", ToastAndroid.SHORT);
  }
      navigation.navigate("TodosScreen", { newTask });
    } catch (err) {
      console.error("Görev kaydedilemedi:", err);
    }
  };

  const getPriorityStyle = (level) => {
    switch (level) {
      case "Yüksek": return { backgroundColor: "#fee2e2", borderColor: "#dc2626" };
      case "Orta": return { backgroundColor: "#fef3c7", borderColor: "#ca8a04" };
      case "Düşük": return { backgroundColor: "#d1fae5", borderColor: "#059669" };
      default: return {};
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Yeni Görev</Text>
      </View>

      <Text style={styles.label}>Görev Başlığı</Text>
      <TextInput style={styles.input} placeholder="Görevin başlığını girin" value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Açıklama</Text>
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Açıklama" multiline value={description} onChangeText={setDescription} />

      <Text style={styles.label}>Kategori</Text>
      <TouchableOpacity onPress={() => setShowCategoryDropdown(!showCategoryDropdown)} style={[styles.dropdownBox, { borderColor: selectedCategory?.color || "#e5e7eb" }]}>
        <View style={[styles.categoryIcon, { backgroundColor: selectedCategory?.color || "#9ca3af" }]}> {renderIcon(selectedCategory?.iconName, "#fff", 16)} </View>
        <Text style={[styles.dropdownText, { color: selectedCategory?.color || "#374151" }]}>{selectedCategory?.name || "Kategori Seç"}</Text>
        <Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={20} color={selectedCategory?.color || "#6b7280"} style={{ marginLeft: "auto" }} />
      </TouchableOpacity>

      {showCategoryDropdown && (
        <View style={styles.dropdownList}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.name} onPress={() => { setSelectedCategoryName(cat.name); setShowCategoryDropdown(false); }} style={styles.dropdownItem}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>{renderIcon(cat.iconName, "#fff", 16)}</View>
              <Text style={{ color: "#1f2937", fontWeight: "500" }}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Öncelik</Text>
      <View style={styles.priorityRow}>
        {["Düşük", "Orta", "Yüksek"].map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPriority(p)}
            style={[
              styles.priority,
              getPriorityStyle(p),
              priority === p ? { borderWidth: 1 } : {},
            ]}
          >
            <Text style={{ color: "#000", fontWeight: "600", textAlign: "center" }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Zaman Bilgileri</Text>

      {/* Deadline */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>📅 Son Tarih</Text>
        <Switch value={enableDeadline} onValueChange={(val) => { setEnableDeadline(val); if (val) setShowDeadlinePicker(true); }} />
      </View>

      {enableDeadline && (
        <TouchableOpacity onPress={() => setShowDeadlinePicker(true)}>
          <Text style={styles.dateValue}>
            {deadline instanceof Date ? deadline.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "Tarih seçilmedi"}
          </Text>
        </TouchableOpacity>
      )}

      {showDeadlinePicker && (
        <DateTimePicker
          value={deadline || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDeadlinePicker(false);
            if (selectedDate) {
              setDeadline(selectedDate);
            }
          }}
        />
      )}

      {/* Reminder */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>🔔 Hatırlatıcı</Text>
        <Switch value={enableReminder} onValueChange={(val) => { setEnableReminder(val); if (val) setShowReminderPicker(true); }} />
      </View>


      {enableReminder && (
        <TouchableOpacity onPress={() => setShowReminderPicker(true)}>
          <Text style={styles.dateValue}>
            {reminder instanceof Date ? `${reminder.toLocaleDateString("tr-TR")} ${reminder.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Saat seçilmedi"}
          </Text>
        </TouchableOpacity>
      )}


      {showReminderPicker && (
        <DateTimePicker
          value={reminder || new Date()}
          mode="datetime"
          display="default"
          onChange={(e, t) => { setShowReminderPicker(false); if (t) setReminder(t); }}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>✓ Görevi Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  cancel: { fontSize: 24, color: "#166534" },
  title: { fontSize: 20, fontWeight: "bold", color: "#166534", marginLeft: 16 },
  label: { marginTop: 10, fontWeight: "600", color: "#166534", marginBottom: 4 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 8 },
  dropdownBox: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, padding: 10, backgroundColor: "#fff", marginBottom: 8 },
  dropdownText: { fontWeight: "600" },
  dropdownList: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  dropdownItem: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  categoryIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 8 },
  priorityRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  priority: { flex: 1, paddingVertical: 10, marginHorizontal: 4, borderRadius: 10 },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 8 },
  toggleLabel: { color: "#166534", fontWeight: "500" },
  dateValue: { color: "#111827", fontWeight: "600", backgroundColor: "#f3f4f6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginTop: 4, alignSelf: "flex-start" },
  saveButton: { marginTop: 20, backgroundColor: "#16a34a", padding: 16, borderRadius: 16, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
});
