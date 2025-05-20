import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#f63b76");
  const [examDate, setExamDate] = useState(new Date("2025-06-15T10:00:00"));

  const [categoryStats, setCategoryStats] = useState({
    math: { solved: 0, total: 50 },
    biology: { solved: 0, total: 53 },
    chemistry: { solved: 0, total: 44 },
    physics: { solved: 0, total: 52 },
    turkish: { solved: 0, total: 60 },
    history: { solved: 0, total: 49 },
    geography: { solved: 0, total: 36 },
    literature: { solved: 0, total: 40 },
  });

  const [dataLoaded, setDataLoaded] = useState(false); // 🔐 AsyncStorage tam yüklendi mi?

  // ⏬ Verileri geri yükle
  useEffect(() => {
    const loadStoredValues = async () => {
      try {
        const storedColor = await AsyncStorage.getItem("themeColor");
        const storedDate = await AsyncStorage.getItem("examDate");
        const storedStats = await AsyncStorage.getItem("categoryStats");

        if (storedColor) setThemeColor(storedColor);
        if (storedDate) setExamDate(new Date(storedDate));
        if (storedStats) setCategoryStats(JSON.parse(storedStats));
      } catch (err) {
        console.error("AsyncStorage load hatası:", err);
      } finally {
        setDataLoaded(true);
      }
    };
    loadStoredValues();
  }, []);

  // ⏫ Değişiklikleri kaydet (yalnızca veri yüklendiyse)
  useEffect(() => {
    if (!dataLoaded) return;

    const saveValues = async () => {
      try {
        await AsyncStorage.setItem("themeColor", themeColor);
        await AsyncStorage.setItem("examDate", examDate.toISOString());
        await AsyncStorage.setItem("categoryStats", JSON.stringify(categoryStats));
      } catch (err) {
        console.error("AsyncStorage save hatası:", err);
      }
    };

    saveValues();
  }, [themeColor, examDate, categoryStats, dataLoaded]);

  return (
    <AppContext.Provider
      value={{
        themeColor,
        setThemeColor,
        examDate,
        setExamDate,
        categoryStats,
        setCategoryStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
