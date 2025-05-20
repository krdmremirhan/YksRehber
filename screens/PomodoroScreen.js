// screens/PomodoroScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useAppContext } from "../context/AppContext";
import { useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";


const { width } = Dimensions.get("window");

const MODES = {
  pomodoro: { label: "Pomodoro", time: 25 * 60 },
  short: { label: "Kısa Mola", time: 5 * 60 },
  long: { label: "Uzun Mola", time: 15 * 60 },
};

export default function PomodoroScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODES[mode].time);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setTimeLeft(MODES[mode].time);
    setIsRunning(false);
  }, [mode]);


  useEffect(() => {
    const loadTodayCount = async () => {
      const todayKey = moment().format("YYYY-MM-DD");
      const savedData = await AsyncStorage.getItem("pomodoroCounts");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed[todayKey]) {
          setCompletedCount(parsed[todayKey]);
        }
      }
    };
    loadTodayCount();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsRunning(false);

            if (mode === "pomodoro") {
              const todayKey = moment().format("YYYY-MM-DD");

              setCompletedCount((prev) => {
                const newCount = Math.min(prev + 1, 4);

                AsyncStorage.getItem("pomodoroCounts").then((data) => {
                  const parsed = data ? JSON.parse(data) : {};
                  parsed[todayKey] = newCount;
                  AsyncStorage.setItem("pomodoroCounts", JSON.stringify(parsed));
                });

                return newCount;
              });

              Alert.alert("Süre Doldu", "🎉 Pomodoro tamamlandı! Uzun molaya geçebilirsin.");
            }
            else if (mode === "short") {
              Alert.alert("Kısa Mola Bitti", "Yeni bir pomodoro başlatmak ister misin?");
            } else if (mode === "long") {
              Alert.alert("Uzun Mola Bitti", "Çalışmaya hazır mısın?");
            }
          }
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);


  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  const { themeColor } = useAppContext();
  const styles = useMemo(() => getStyles(themeColor), [themeColor]);

  const progress = (timeLeft / MODES[mode].time) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={themeColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pomodoro</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.modeContainer}>
        {Object.keys(MODES).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setMode(key)}
            style={[styles.modeButton, mode === key && styles.activeModeButton]}
          >
            <Text style={[styles.modeText, mode === key && styles.activeModeText]}>
              {MODES[key].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.circleWrapper}>
        <Svg width={250} height={250}>
          <Circle
            cx="125"
            cy="125"
            r="100"
            strokeWidth="15"
            stroke="#e5e7eb"       // dış çember rengi (açık gri)
            fill="none"            // siyahlığı engeller
          />
          <Circle
            cx="125"
            cy="125"
            r="100"
            strokeWidth="15"
            stroke={themeColor}    // tema rengine göre ilerleme çemberi
            fill="none"            // mutlaka olmalı!
            strokeDasharray="628"
            strokeDashoffset={628 - (628 * progress) / 100}
            strokeLinecap="round"
            rotation="-90"
            origin="125,125"
          />
        </Svg>

        <View style={styles.timeTextContainer}>
          <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.labelText}>{MODES[mode].label}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setTimeLeft(MODES[mode].time)}>
          <Ionicons name="refresh" size={32} color={themeColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsRunning((prev) => !prev)}>
          <View style={styles.playButton}>
            <Ionicons
              name={isRunning ? "pause" : "play"}
              size={32}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.completionWrapper}>
        <View style={styles.completionRow}>
          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.completionBar,
                {
                  backgroundColor: index < completedCount ? themeColor : "#e0e0e0",
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.completedText}>Tamamlanan: {completedCount}</Text>
      </View>


    </View>


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
    modeContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 20,
    },
    modeButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: "#e8dff1",
    },
    activeModeButton: {
      backgroundColor: themeColor,
    },
    modeText: {
      fontWeight: "bold",
      color: themeColor,
    },
    activeModeText: {
      color: "#fff",
    },
    circleWrapper: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 30,
    },
    timeTextContainer: {
      position: "absolute",
      alignItems: "center",
    },
    timeText: {
      fontSize: 40,
      fontWeight: "bold",
      color: themeColor,
    },
    labelText: {
      fontSize: 18,
      color: themeColor,
      marginTop: 4,
    },
    controls: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 40,
      marginBottom: 30,
    },
    playButton: {
      backgroundColor: themeColor,
      padding: 16,
      borderRadius: 50,
    },
    completionWrapper: {
      alignItems: "center",
      marginBottom: 40,
    },

    completionRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
    },

    completionBar: {
      width: 30,
      height: 4,
      borderRadius: 2,
      backgroundColor: "#e0e0e0",
    },

    completedText: {
      marginTop: 10,
      fontSize: 14,
      fontWeight: "500",
      color: themeColor,
    },


  });
}
