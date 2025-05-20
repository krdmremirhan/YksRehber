// screens/WordCategoryScreen.js

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FontAwesome5, Entypo, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
const categories = [
  { key: "math", title: "Matematik", subtitle: "Sayısal işlemler", total: 50, solved: 0, bgColor: "#3b82f6", iconName: "function-variant" },
  { key: "biology", title: "Biyoloji", subtitle: "Canlılar", total: 53, solved: 0, bgColor: "#22c55e", iconName: "leaf" },
  { key: "chemistry", title: "Kimya", subtitle: "Tepkimeler", total: 44, solved: 0, bgColor: "#f97316", iconName: "flask" },
  { key: "physics", title: "Fizik", subtitle: "Enerji", total: 52, solved: 0, bgColor: "#ef4444", iconName: "atom-variant" },
  { key: "turkish", title: "Türkçe", subtitle: "Dil bilgisi", total: 60, solved: 0, bgColor: "#8b5cf6", iconName: "menu-book" },
  { key: "history", title: "Tarih", subtitle: "Olaylar", total: 49, solved: 0, bgColor: "#eab308", iconName: "history" },
  { key: "geography", title: "Coğrafya", subtitle: "Harita bilgisi", total: 36, solved: 0, bgColor: "#14b8a6", iconName: "globe" },
  { key: "literature", title: "Edebiyat", subtitle: "Yazarlar", total: 40, solved: 0, bgColor: "#6366f1", iconName: "book-open-page-variant" },
];


const getIconComponent = (iconName) => {
  switch (iconName) {
    case "shuffle":
      return <Entypo name="shuffle" size={24} color="#fff" />;
    case "function-variant":
      return <Text style={{ color: '#fff', fontWeight: 'bold' }}>f(x)</Text>;
    case "leaf":
      return <FontAwesome5 name="leaf" size={20} color="#fff" />;
    case "flask":
      return <MaterialCommunityIcons name="flask" size={22} color="#fff" />;
    case "atom-variant":
      return <MaterialCommunityIcons name="atom-variant" size={22} color="#fff" />;
    case "globe":
      return <Entypo name="globe" size={22} color="#fff" />;
    case "menu-book":
      return <MaterialIcons name="menu-book" size={22} color="#fff" />;
    case "history":
      return <MaterialIcons name="history" size={22} color="#fff" />;
    case "book-open-page-variant":
      return <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#fff" />;
    default:
      return null;
  }
};

export default function WordCategoryScreen() {
  const navigation = useNavigation();
  const { themeColor } = useAppContext();
  const styles = getStyles(themeColor); // 🔥 Burası şart
  const { categoryStats } = useAppContext();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={themeColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>YKS Kelimelik</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.subtitle}>Bir kategori seçin ve soruları çözmeye başlayın</Text>

      {categories.map((cat, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { backgroundColor: cat.bgColor }]}
          onPress={() => navigation.navigate("WordCrushScreen", { category: cat.key })}
        >
          <View style={styles.cardIcon}>
            {getIconComponent(cat.iconName)}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{cat.title}</Text>
            <Text style={styles.cardSubtitle}>{cat.subtitle}</Text>
            <Text style={styles.cardProgress}>
              {(categoryStats[cat.key]?.solved || 0)} / {cat.total} Çözülen
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function getStyles(themeColor) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f4edfc",
      paddingHorizontal: 16,
      paddingTop: 40,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      color: themeColor,
    },

    subtitle: {
      fontSize: 13,
      textAlign: "center",
      marginBottom: 20,
      color: themeColor,
    },
    card: {
      flexDirection: "row",
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      alignItems: "center"
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#00000033",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    cardTitle: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    cardSubtitle: {
      color: "#fef3c7",
      fontSize: 12,
      marginBottom: 4,
    },
    cardProgress: {
      color: "#fff",
      fontSize: 12,
    },
  });
}
