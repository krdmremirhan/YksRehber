import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import "moment/locale/tr";
import { motivationQuotes } from "../utils/motivationQuotes";
import { useMemo } from "react";
moment.locale("tr");

export default function CountdownCard() {
  const { themeColor, examDate } = useAppContext();
  const navigation = useNavigation();
  const [now, setNow] = useState(moment());
  const styles = useMemo(() => getStyles(themeColor), [themeColor]);

  const isPast = moment().isAfter(moment(examDate));

  useEffect(() => {
    const interval = setInterval(() => setNow(moment()), 1000);
    return () => clearInterval(interval);
  }, []);

  const duration = moment.duration(moment(examDate).diff(now));
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  function getTodaysQuote() {
    const today = new Date();
    const uniqueDay = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
    const index = uniqueDay % motivationQuotes.length;
    return motivationQuotes[index];
  }

  return (
    <TouchableOpacity style={styles.card}>
      <Icon name="flower" size={40} color={themeColor} style={{ alignSelf: "center", marginBottom: 8 }} />
      <Text style={styles.countdownTitle}>YKS 2025'e Kalan Zaman</Text>
      <Text style={styles.countdownSubtitle}>{moment(examDate).format("D MMMM YYYY dddd")}</Text>

      {isPast ? (
        <>
          <Text style={styles.pastMessage}>⏰ Sınav tarihi geçti!</Text>
          <Text style={styles.motivationQuote}>"{getTodaysQuote()}"</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => navigation.navigate("SettingsScreen")}
          >
            <Text style={styles.resetButtonText}>🎯 Yeni Hedef Belirle</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{days} Gün</Text>
            <Text style={styles.time}>{hours} Saat</Text>
            <Text style={styles.time}>{minutes} Dak</Text>
            <Text style={styles.time}>{seconds} San</Text>
          </View>
          <Text style={styles.motivationQuote}>"{getTodaysQuote()}"</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function getStyles(themeColor) {
  return StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
      alignItems: "center",
      elevation: 2,
    },
    countdownTitle: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      color: themeColor,
    },
    countdownSubtitle: {
      fontSize: 13,
      color: "#6b7280",
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginVertical: 8,
    },
    time: {
      fontSize: 14,
      fontWeight: "600",
      color: themeColor,
    },
    motivationQuote: {
      fontStyle: "italic",
      fontSize: 15,
      color: "#4b5563",
      marginTop: 8,
      textAlign: "center",
    },
    pastMessage: {
  fontSize: 14,
  color: "#ef4444",
  fontWeight: "600",
  marginVertical: 6,
  textAlign: "center",
},
resetButton: {
  backgroundColor: themeColor,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginTop: 8,
},
resetButtonText: {
  color: "#fff",
  fontWeight: "600",
  textAlign: "center",
},

  });
}
