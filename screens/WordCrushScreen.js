import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchQuestionsFromAPI } from "../services/questionService";
import { useAppContext } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';



const { width } = Dimensions.get("window");

export default function WordCrushScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params || {};
  const { themeColor } = useAppContext();
const { categoryStats, setCategoryStats } = useAppContext();

  const [activeBoxIndex, setActiveBoxIndex] = useState(null);
  const [revealedPositions, setRevealedPositions] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const styles = getStyles(themeColor);
  const inputRef = useRef();

  const rehberKategoriler = {
    math: "matematik",
    biology: "biyoloji",
    chemistry: "kimya",
    physics: "fizik",
    turkish: "turkce",
    history: "tarih",
    literature: "edebiyat",
    geography: "cografya",
  };

  useEffect(() => {
    (async () => {
      await loadNewQuestion();
    })();
  }, []);


  useEffect(() => {
    if (activeBoxIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeBoxIndex]);

  const loadNewQuestion = async () => {
    const apiCategory = rehberKategoriler[category] || category;
    const data = await fetchQuestionsFromAPI(apiCategory);
    if (!data.length) return;

    const random = data[Math.floor(Math.random() * data.length)];
    setQuestionData(random);
    const shuffled = random.answer.split("").sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setSelectedIndices([]);
    setFeedback("");
    setRevealedPositions([]);
  };

  const handleLetterPress = (index) => {
    if (selectedIndices.includes(index)) return;

    if (activeBoxIndex !== null) {
      const newSelected = [...selectedIndices];
      newSelected[activeBoxIndex] = index;
      setSelectedIndices(newSelected);
      setActiveBoxIndex(null);
    } else {
      const nextEmpty = questionData.answer.split("").findIndex((_, idx) => selectedIndices[idx] === undefined);
      if (nextEmpty !== -1) {
        const newSelected = [...selectedIndices];
        newSelected[nextEmpty] = index;
        setSelectedIndices(newSelected);
      }
    }
  };

  const handleDeleteLetter = () => {
    const newSelected = [...selectedIndices];

    if (activeBoxIndex !== null && newSelected[activeBoxIndex] !== undefined) {
      newSelected[activeBoxIndex] = undefined;
      setSelectedIndices(newSelected);
      return;
    }

    for (let i = newSelected.length - 1; i >= 0; i--) {
      if (newSelected[i] !== undefined) {
        newSelected[i] = undefined;
        break;
      }
    }
    setSelectedIndices(newSelected);
  };



  const showHint = () => {
    if (!questionData) return;
    const answer = questionData.answer.split("");
    const newPositions = [];
    while (newPositions.length < 2) {
      const idx = Math.floor(Math.random() * answer.length);
      if (!revealedPositions.includes(idx)) {
        newPositions.push(idx);
      }
    }
    setRevealedPositions([...revealedPositions, ...newPositions]);
  };

const handleSubmit = async () => {
  const userAnswer = selectedIndices.map((i) => shuffledLetters[i]).join("");

if (userAnswer.toLowerCase() === questionData.answer.toLowerCase()) {
    setFeedback("✅ Doğru!");
    setScore((prev) => prev + 10);

    const updatedStats = {
      ...categoryStats,
      [category]: {
        ...categoryStats[category],
        solved: (categoryStats[category]?.solved || 0) + 1,
      },
    };

    // 🔁 1. önce AsyncStorage'a yaz
    try {
      await AsyncStorage.setItem("categoryStats", JSON.stringify(updatedStats));
    } catch (err) {
      console.error("Kategori verisi kaydedilemedi", err);
    }

    // ✅ 2. sonra state'e yaz
    setCategoryStats(updatedStats);

    setTimeout(() => {
      loadNewQuestion();
    }, 1500);
  }
};




  const answerBoxSize = useMemo(() => {
    if (!questionData?.answer) return 44;
    const length = questionData.answer.length;
    if (length <= 5) return 48;
    if (length <= 7) return 44;
    if (length <= 9) return 40;
    return 36;
  }, [questionData?.answer]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColor + "10" }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={themeColor} />
        </TouchableOpacity>
        <Text style={[styles.categoryText, { color: themeColor }]}>{questionData?.category}</Text>
        <Text style={[styles.score, { color: themeColor }]}>{score} Puan</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{questionData?.clue}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: themeColor }]} onPress={loadNewQuestion}>
          <Text style={styles.optionText}>🔄 Soru Değiştir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: "#fbbf24" }]} onPress={showHint}>
          <Text style={styles.optionText}>🧠 İpucu</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        ref={inputRef}
        style={{ height: 0, width: 0, opacity: 0 }}
        autoFocus={false}
        onChangeText={(text) => {
          if (!text || text.length === 0) return;
          if (activeBoxIndex === null) return;

          const letter = text[0].toUpperCase();
          const newSelected = [...selectedIndices];
          const availableIndices = shuffledLetters
            .map((l, idx) => ({ l, idx }))
            .filter(({ l, idx }) => !newSelected.includes(idx) && l.toUpperCase() === letter);

          if (availableIndices.length > 0) {
            newSelected[activeBoxIndex] = availableIndices[0].idx;
            setSelectedIndices(newSelected);
          }



          setActiveBoxIndex(null);
        }}
      />



      <View style={styles.answerRow}>
        <View style={styles.answerContainer}>
          {questionData?.answer.split("").map((answerLetter, i) => {
            let letter = "";
            const selectedIndex = selectedIndices[i];
            if (selectedIndex !== undefined) {
              letter = shuffledLetters[selectedIndex];
            } else if (revealedPositions.includes(i)) {
              letter = answerLetter;
            }

            return (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveBoxIndex(i)}
                style={[
                  styles.answerBox,
                  {
                    backgroundColor: revealedPositions.includes(i)
                      ? "#fde68a"
                      : activeBoxIndex === i
                        ? "#282829"
                        : "#d1d5db", // gri ton
                  },
                ]}
              >
                <Text style={styles.answerLetter}>{letter}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </View>
      <View style={styles.answerInfoRow}>
        <View style={styles.wordInfo}>
          <Text style={styles.warningText}>❌ {questionData?.answer.length} harfli kelime</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedIndices.filter((v) => v !== undefined).length === questionData?.answer.length
              ? {}
              : styles.submitDisabled,
          ]}
          onPress={handleSubmit}
          disabled={selectedIndices.filter((v) => v !== undefined).length !== questionData?.answer.length}
        >
          <Text style={styles.submitText}>TAHMİN ET</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.keyboard}>
        {shuffledLetters.map((letter, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.key, selectedIndices.includes(i) && styles.keyDisabled]}
            onPress={() => handleLetterPress(i)}
            disabled={selectedIndices.includes(i)}
          >
            <Text style={styles.keyText}>{letter}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.key, { backgroundColor: "#ef4444" }]}
          onPress={handleDeleteLetter}
        >
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>

      {feedback !== "" && <Text style={styles.feedback}>{feedback}</Text>}
    </ScrollView>
  );
}

function getStyles(themeColor) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      paddingHorizontal: 16,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    backButton: {
      fontSize: 16,
      fontWeight: "bold",
    },
    categoryText: {
      fontSize: 18,
      fontWeight: "600",
    },
    score: {
      fontSize: 14,
    },
    questionBox: {
      backgroundColor: "white",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    questionText: {
      fontSize: 16,
      textAlign: "center",
      color: "#1e293b",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    optionButton: {
      flex: 0.48,
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    optionText: {
      color: "white",
      fontWeight: "bold",
    },
    answerContainer: {
      flexDirection: "row",
      flexWrap: "wrap",           // ✅ alt satıra geçmeyi sağlar
      justifyContent: "center",   // veya 'flex-start'
      alignItems: "center",
      margin: 3,                     // boşluk (yeni React Native sürümünde varsa)
      marginBottom: 16,
      paddingHorizontal: 8,
    },

    answerBox: {
      width: 30,
      height: 30,
      margin: 4, // kutular arası boşluk
      backgroundColor: "#d1d5db", // gri ton
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
    },

    answerLetter: {
      fontSize: 18,
      fontWeight: "bold",
    },
    answerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },


    warningRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginLeft: 8,
      marginBottom: 16,
    },
    warningText: {
      color: "#dc2626", // kırmızımsı
      fontSize: 14,
      marginRight: 8,

    },

    submitButton: {
      backgroundColor: "#334155",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      marginLeft: 8,
    },

    submitText: {
      color: "white",
      fontWeight: "bold",
    },
    keyboard: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 10,
      marginBottom: 24,
    },
    key: {
      width: 34,
      height: 34,
      backgroundColor: "#3b82f6",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      margin: 1,
    },
    keyDisabled: {
      backgroundColor: "#94a3b8",
    },
    keyText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    feedback: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1e293b",
      textAlign: "center",
    },
    answerInfoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 8,
      marginBottom: 12,
    },

    wordInfo: {
      flexDirection: "row",
      alignItems: "center",
    },

    submitButton: {
      backgroundColor: "#334155",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
    },

    submitDisabled: {
      backgroundColor: "#cbd5e1", // gri pasif
    },

    submitText: {
      color: "white",
      fontWeight: "bold",
    },

  });
}