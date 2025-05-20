import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";

export default function ExamDateScreen({ navigation }) {
  const { examDate, setExamDate } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(examDate);

  const handleUpdate = () => {
    setExamDate(selectedDate);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sınav Tarihi</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "calendar"}
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setTimeout(() => setExamDate(selectedDate), 50);
            }
          }}

        />
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Tarihi Güncelle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaffea",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
  },
  closeText: {
    fontSize: 16,
    color: "#1c7c3c",
    fontWeight: "500",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    marginBottom: 24,
  },
  updateButton: {
    backgroundColor: "#1c7c3c",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
