import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment/min/moment-with-locales";
import AsyncStorage from '@react-native-async-storage/async-storage';

moment.locale("tr");

const themeOptions = [
  { name: "Mavi", value: "#3b82f6" },
  { name: "Yeşil", value: "#7bef9a" },
  { name: "Turuncu", value: "#f97316" },
  { name: "Pembe", value: "#db2777" },
  { name: "Mor", value: "#8b5cf6" },
]; 

export default function SettingsScreen() {
 const handleResetStats = () => {
  Alert.alert(
    "Emin misin?",
    "Tüm çözülen sorular sıfırlanacak. Bu işlem geri alınamaz.",
    [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Evet, Sıfırla",
        style: "destructive",
        onPress: async () => {
          const initialStats = {
            math: { solved: 0, total: 50 },
            biology: { solved: 0, total: 53 },
            chemistry: { solved: 0, total: 44 },
            physics: { solved: 0, total: 52 },
            turkish: { solved: 0, total: 60 },
            history: { solved: 0, total: 49 },
            geography: { solved: 0, total: 36 },
            literature: { solved: 0, total: 40 },
          };

          setCategoryStats(initialStats);
          await AsyncStorage.setItem("categoryStats", JSON.stringify(initialStats));

          Alert.alert("Başarılı", "Tüm sorular sıfırlandı.");
        },
      },
    ]
  );
};

  const { themeColor, setThemeColor, examDate, setExamDate, setCategoryStats } = useAppContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const styles = useMemo(() => getStyles(themeColor), [themeColor]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: themeColor + "10" },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={themeColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎨 Tema Seçimi</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={themeOptions}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.themeOption}
            onPress={() => setThemeColor(item.value)}
          >
            <View style={[styles.circle, { backgroundColor: item.value }]} />
            <Text style={styles.themeText}>{item.name}</Text>
            {themeColor === item.value && (
              <Ionicons name="checkmark" size={20} color={item.value} />
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.value}
        scrollEnabled={false}
      />

      <TouchableOpacity
        style={styles.dateCard}
        onPress={() => {
          if (Platform.OS === "android") {
            setShowDatePicker(true);
          } else {
            navigation.navigate("ExamDateScreen");
          }
        }}
      >
        <Ionicons name="calendar" size={20} color="#444" style={{ marginRight: 10 }} />
        <Text style={styles.dateText}>Sınav Tarihini Güncelle</Text>
        <Text style={styles.dateRight}>{moment(examDate).format("DD MMM YYYY")}</Text>
      </TouchableOpacity>



      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={examDate}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setExamDate(selectedDate);
            }
          }}
        />
      )}
      <TouchableOpacity style={styles.resetCard} onPress={handleResetStats}>
        <Ionicons name="trash-outline" size={20} color="#ef4444" style={{ marginRight: 10 }} />
        <Text style={styles.resetText}>Soruları Sıfırla</Text>

      </TouchableOpacity>


    </ScrollView>
  );
}

function getStyles(themeColor) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 60, // alt boşluk bırak
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
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 10,
      backgroundColor: "#fff",
      marginVertical: 6,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      elevation: 2,
    },

    circle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      marginRight: 12,
    },

    themeText: {
      flex: 1,
      fontSize: 15,
      color: "#222",
    },

    examContainer: {
      marginTop: 32,
    },

    dateCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 16,
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },

    dateText: {
      flex: 1,
      fontSize: 16,
      color: "#111",
      fontWeight: "500",
    },

    dateRight: {
      fontSize: 14,
      color: "#666",
      fontWeight: "400",
      marginLeft: 8,
    },
    resetCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 16,
      justifyContent: "flex-start",
      marginTop: 16,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },

    resetText: {
      fontSize: 16,
      color: "#ef4444",
      fontWeight: "500",
    },

  });
}