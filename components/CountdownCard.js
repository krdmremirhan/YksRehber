import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import "moment/locale/tr";
import { motivationQuotes } from "../utils/motivationQuotes";

moment.locale("tr");

export default function CountdownCard() {
  const { themeColor, examDate } = useAppContext();
  const navigation = useNavigation();
  const [now, setNow] = useState(moment());
  const styles = useMemo(() => getStyles(themeColor), [themeColor]);

  useEffect(() => {
    const interval = setInterval(() => setNow(moment()), 1000);
    return () => clearInterval(interval);
  }, []);

  const duration = moment.duration(moment(examDate).diff(now));
  const isPast = duration.asSeconds() < 0;

  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  const getTodaysQuote = () => {
    const today = new Date();
    const uniqueDay = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
    const index = uniqueDay % motivationQuotes.length;
    return motivationQuotes[index];
  };

  return (
    <TouchableOpacity style={styles.card}>
      <Icon name="flower" size={40} color={themeColor} style={{ marginBottom: 8 }} />
      <Text style={styles.countdownTitle}>YKS 2025' e Kalan Zaman</Text>
      <Text style={styles.countdownSubtitle}>{moment(examDate).format("D MMMM YYYY dddd")}</Text>

      {isPast ? (
        <>
          <Text style={styles.pastMessage}>⏰ Sınav tarihi geçti!</Text>
        </>
      ) : (
        <>
          <View style={styles.timeRow}>
            <View style={styles.timeCol}>
              <Text style={styles.timeNumber}>{days}</Text>
              <Text style={styles.timeLabel}>Gün</Text>
            </View>
            <View style={styles.timeCol}>
              <Text style={styles.timeNumber}>{hours}</Text>
              <Text style={styles.timeLabel}>Saat</Text>
            </View>
            <View style={styles.timeCol}>
              <Text style={styles.timeNumber}>{minutes}</Text>
              <Text style={styles.timeLabel}>Dak</Text>
            </View>
            <View style={styles.timeCol}>
              <Text style={styles.timeNumber}>{seconds}</Text>
              <Text style={styles.timeLabel}>San</Text>
            </View>
          </View>
        </>
      )}
<View style={styles.dividerWithIcon}>
  <Icon name="message-processing-outline" size={16} color="#9ca3af" />
  <View style={styles.flexLine} />
</View>
<Text style={styles.motivationQuote}>“{getTodaysQuote()}”</Text>

    </TouchableOpacity>
  );
}

function getStyles(themeColor) {
  return StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 20,
      marginVertical: 8,
      alignItems: "center",
      elevation: 2,
    },
    countdownTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: themeColor,
      textAlign: "center",
    },
    countdownSubtitle: {
      fontSize: 14,
      color: "#6b7280",
      marginBottom: 12,
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 16,
    },
    timeCol: {
      alignItems: "center",
      flex: 1,
    },
    timeNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: themeColor,
    },
    timeLabel: {
      fontSize: 12,
      color: "#6b7280",
    },
    motivationQuote: {
      fontSize: 13,
      fontStyle: "italic",
      color: "#6b7280",
      marginTop: 12,
      textAlign: "center",
    },
   dividerWithIcon: {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  marginTop: 16,
  marginBottom: 8,
  paddingHorizontal: 4,
  gap: 6,
},
flexLine: {
  flex: 1,
  height: 1,
  backgroundColor: "#e5e7eb",
},


    pastMessage: {
      color: "#ef4444",
      fontSize: 14,
      fontWeight: "bold",
      marginTop: 12,
    },
  });
}
