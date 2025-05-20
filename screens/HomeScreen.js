import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountdownCard from "../components/CountdownCard";

function hexToRgba(hex, opacity) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}


function getTodaysQuote() {
  const quotes = [
    "Başarı, hazırlanmış zihinlere gelir.",
    "Azim, başarının anahtarıdır.",
    "Bugün emek ver, yarın hasat et.",
    "Zirveye çıkan yol, sabırdan geçer.",
  ];
  const index = new Date().getDate() % quotes.length;
  return quotes[index];
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const { themeColor } = useAppContext();
  const styles = useMemo(() => getStyles(themeColor), [themeColor]);
  const { categoryStats } = useAppContext();
  const totalSolved = Object.values(categoryStats).reduce((sum, stat) => sum + (stat?.solved || 0), 0);
  const totalScore = totalSolved * 10; // her doğru 10 puansa
  const totalQuestions = Object.values(categoryStats).reduce((sum, stat) => sum + (stat?.total || 0), 0);

  const [tasks, setTasks] = useState([]);
  useFocusEffect(
    useCallback(() => {
      return () => { };
    }, [])
  );
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tasks");
        const parsed = storedTasks ? JSON.parse(storedTasks) : [];
        const activeTasks = parsed.filter((task) => !task.isCompleted);
        setTasks(activeTasks);
      } catch (err) {
        console.error("Görevler yüklenemedi:", err);
      }
    };

    const unsubscribe = navigation.addListener("focus", loadTasks);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.headerRow}>
        <View style={{ width: 28 }} />
        <Text style={styles.title}>YKS Rehber</Text>
        <TouchableOpacity onPress={() => navigation.push("SettingsScreen")}>
          <Icon name="cog-outline" size={28} color={themeColor} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Başarıya giden yolda yanınızdayız</Text>


      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("WordCategoryScreen")}>
        <View style={styles.iconTitleRow}>
          <Icon name="medal" size={20} color={themeColor} style={styles.icon} />
          <Text style={styles.cardTitle}>YKS Kelimelik</Text>
        </View>
        <Text style={styles.cardSubtitle}>YKS konularıyla ilgili kelime bilmeceleri</Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>{totalSolved} Çözülen</Text>
          <Text style={styles.stat}>{totalScore} Puan</Text>
          <Text style={styles.stat}>{totalQuestions} Toplam</Text>
        </View>
      </TouchableOpacity>


      <CountdownCard />
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Todos")}>
        <View style={styles.iconTitleRow}>
          <Icon name="check-decagram" size={20} color={themeColor} style={styles.icon} />
          <Text style={styles.cardTitle}>Yapılacaklar</Text>
        </View>
        <Text style={styles.cardSubtitle}>Görevlerinizi planlayın ve takip edin</Text>

        {tasks.length > 0 ? (
          <>
            {tasks.slice(0, 3).map((task, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <View style={{ width: 10, height: 10, backgroundColor: task.categoryColor, borderRadius: 5, marginRight: 8 }} />
                <Text style={{ fontSize: 13, color: "#1e293b", flex: 1 }} numberOfLines={1}>
                  {task.title}
                </Text>
                {task.deadline && (
                  <Text style={{ fontSize: 12, color: "#ef4444", marginLeft: 6 }}>
                    📅 {new Date(task.deadline).toLocaleDateString("tr-TR")}
                  </Text>
                )}
              </View>
            ))}
          </>
        ) : (
          <Text style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
            Hiç aktif göreviniz yok.
          </Text>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <Text style={{ color: themeColor, fontWeight: "600" }}>Tüm Görevler</Text>
          <View style={{ backgroundColor: themeColor, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 12 }}>{tasks.length}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PomodoroScreen")}>
        <View style={styles.iconTitleRow}>
          <Icon name="clock-outline" size={20} color={themeColor} style={styles.icon} />
          <Text style={styles.cardTitle}>Pomodoro Zamanlayıcı</Text>
        </View>
        <Text style={styles.cardSubtitle}>Odaklanmış çalışma için Pomodoro tekniğini kullanın</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ScoreCalculatorScreen")}>
        <View style={styles.iconTitleRow}>
          <Icon name="function-variant" size={20} color={themeColor} style={styles.icon} />
          <Text style={styles.cardTitle}>YKS Puan Hesaplama</Text>
        </View>
        <Text style={styles.cardSubtitle}>Net sayılarınızı girerek tahmini puanınızı hesaplayın</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function getStyles(themeColor) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: hexToRgba(themeColor, 0.1),
      paddingHorizontal: 16,
      paddingTop: 40,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      color: themeColor,
    },
    subtitle: {
      fontSize: 13,
      textAlign: "center",
      marginTop: 4,
      marginBottom: 20,
      color: themeColor,
    },
    card: {
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    iconTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    icon: {
      marginRight: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#1e1e1e",
    },
    cardSubtitle: {
      fontSize: 13,
      color: "#666",
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    stat: {
      fontSize: 12,
      color: themeColor,
    },
    countdownTitle: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: themeColor,
    },
    countdownSubtitle: {
      textAlign: "center",
      fontSize: 13,
      color: "#666",
      marginBottom: 12,
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 12,
    },
    time: {
      fontSize: 16,
      fontWeight: "bold",
      color: themeColor,
    },
    motivationQuote: {
      textAlign: "center",
      fontStyle: "italic",
      fontSize: 13,
      color: "#8c6239",
      marginTop: 8,
    },
  });
}
