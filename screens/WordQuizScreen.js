// screens/WordQuizScreen.js

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchQuestionsFromAPI } from "../services/questionService";
import { useRoute } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext"; 



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

export default function WordQuizScreen() {
  const route = useRoute();
  const { category } = route.params || {};
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
const { themeColor } = useAppContext(); 
const styles = getStyles(); // Parametre verme

  const getRandomCategory = () => {
    const all = Object.values(rehberKategoriler);
    return all[Math.floor(Math.random() * all.length)];
  };

  useEffect(() => {
    const loadQuestions = async () => {
      setSelectedOption("");
      setFeedback("");

      const categoryKey = selectedCategory === "all"
        ? getRandomCategory()
        : rehberKategoriler[selectedCategory];

      const data = await fetchQuestionsFromAPI(categoryKey);
      if (!data.length) {
        setCurrentQuestion(null);
        setOptions([]);
        return;
      }

      const randomQuestion = data[Math.floor(Math.random() * data.length)];
      setCurrentQuestion(randomQuestion);

      const wrongOptions = data
        .filter(q => q.answer !== randomQuestion.answer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(q => q.answer);

      const allOptions = [...wrongOptions, randomQuestion.answer].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    };

    loadQuestions();
  }, [selectedCategory]);

  const handleOptionPress = (option) => {
    if (selectedOption !== "") return;
    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setScore(prev => prev + 10);
      setFeedback("✅ Doğru!");
    } else {
      setFeedback("❌ Yanlış!");
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="Tüm Kategoriler" value="all" />
        <Picker.Item label="Matematik" value="math" />
        <Picker.Item label="Biyoloji" value="biology" />
        <Picker.Item label="Kimya" value="chemistry" />
        <Picker.Item label="Fizik" value="physics" />
        <Picker.Item label="Türkçe" value="turkish" />
        <Picker.Item label="Tarih" value="history" />
        <Picker.Item label="Edebiyat" value="literature" />
        <Picker.Item label="cografya" value="geography" />
      </Picker>

      <Text style={styles.score}>Skor: {score}</Text>

      {currentQuestion ? (
        <View style={styles.card}>
          <Text style={styles.category}>{currentQuestion.category?.toUpperCase()}</Text>
          <Text style={styles.question}>{currentQuestion.question}</Text>

          {options.map((option, index) => {
            let backgroundColor = "#e0e0e0";
            if (selectedOption) {
              if (option === currentQuestion.answer) {
                backgroundColor = "#a5d6a7";
              } else if (option === selectedOption) {
                backgroundColor = "#ef9a9a";
              }
            }
            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, { backgroundColor }]
                }
                onPress={() => handleOptionPress(option)}
                disabled={selectedOption !== ""}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}

          <Text style={styles.feedback}>{feedback}</Text>
          <Button title="Sonraki Soru" onPress={() => setSelectedCategory(selectedCategory)} />
        </View>
      ) : (
        <Text style={styles.noQuestionText}>Soru bulunamadı.</Text>
      )}
    </View>
  );
}

const getStyles = (themeColor) => StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: themeColor,
    },
    picker: {
      height: 50,
      marginBottom: 16,
    },
    score: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
      color: "#673ab7",
      textAlign: "center",
    },
    card: {
      backgroundColor: "white",
      borderRadius: 8,
      padding: 20,
      marginBottom: 20,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    category: {
      fontSize: 14,
      color: "gray",
      marginBottom: 10,
      textAlign: "center",
    },
    question: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    optionButton: {
      backgroundColor: "#e0e0e0",
      padding: 12,
      borderRadius: 8,
      marginVertical: 6,
    },
    optionText: {
      fontSize: 16,
      textAlign: "center",
    },
    feedback: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
      textAlign: "center",
    },
    noQuestionText: {
      textAlign: "center",
      fontSize: 16,
      color: "gray",
      marginVertical: 20,
    },
  });
