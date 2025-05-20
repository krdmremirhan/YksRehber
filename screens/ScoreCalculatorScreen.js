import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';


const ScoreCalculatorScreen = () => {
  const [scoreResult, setScoreResult] = useState(null);

  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('TYT');
  const [diplomaNote, setDiplomaNote] = useState('');
  const [placedBefore, setPlacedBefore] = useState(false);
  const [showSayisal, setShowSayisal] = useState(false);
  const [showSozel, setShowSozel] = useState(false);
  const [ydtAnswers, setYdtAnswers] = useState({ correct: '', wrong: '' });
  const [selectedLanguage, setSelectedLanguage] = useState('İngilizce');
  const [tytAnswers, setTytAnswers] = useState({
    turkce: { correct: '', wrong: '' },
    sosyal: { correct: '', wrong: '' },
    matematik: { correct: '', wrong: '' },
    fen: { correct: '', wrong: '' },
  });

  const [aytAnswers, setAytAnswers] = useState({
    matematik: { correct: '', wrong: '' },
    fizik: { correct: '', wrong: '' },
    kimya: { correct: '', wrong: '' },
    biyoloji: { correct: '', wrong: '' },
  });

  const [aytSozelAnswers, setAytSozelAnswers] = useState({
    edebiyat: { correct: '', wrong: '' },
    tarih1: { correct: '', wrong: '' },
    cografya1: { correct: '', wrong: '' },
    tarih2: { correct: '', wrong: '' },
    cografya2: { correct: '', wrong: '' },
    felsefe: { correct: '', wrong: '' },
    din: { correct: '', wrong: '' },
  });

  const toNumber = (val) => parseInt(val) || 0;
  const calculateNet = (correct, wrong) => toNumber(correct) - toNumber(wrong) / 4;
  const { themeColor } = useAppContext();
  const styles = useMemo(() => getStyles(themeColor), [themeColor]);
  const calculateTYT = () => {
    const net =
      calculateNet(tytAnswers.turkce.correct, tytAnswers.turkce.wrong) * 1.32 +
      calculateNet(tytAnswers.sosyal.correct, tytAnswers.sosyal.wrong) * 1.36 +
      calculateNet(tytAnswers.matematik.correct, tytAnswers.matematik.wrong) * 1.32 +
      calculateNet(tytAnswers.fen.correct, tytAnswers.fen.wrong) * 1.36;
    return 100 + net;
  };

  const calculateAYT = () => {
    const sayisalNet =
      calculateNet(aytAnswers.matematik.correct, aytAnswers.matematik.wrong) * 3 +
      calculateNet(aytAnswers.fizik.correct, aytAnswers.fizik.wrong) * 2.85 +
      calculateNet(aytAnswers.kimya.correct, aytAnswers.kimya.wrong) * 3.07 +
      calculateNet(aytAnswers.biyoloji.correct, aytAnswers.biyoloji.wrong) * 3.07;

    const sozelNet =
      calculateNet(aytSozelAnswers.edebiyat.correct, aytSozelAnswers.edebiyat.wrong) * 3 +
      calculateNet(aytSozelAnswers.tarih1.correct, aytSozelAnswers.tarih1.wrong) * 2.8 +
      calculateNet(aytSozelAnswers.cografya1.correct, aytSozelAnswers.cografya1.wrong) * 3.33 +
      calculateNet(aytSozelAnswers.tarih2.correct, aytSozelAnswers.tarih2.wrong) * 2.91 +
      calculateNet(aytSozelAnswers.cografya2.correct, aytSozelAnswers.cografya2.wrong) * 3.0 +
      calculateNet(aytSozelAnswers.felsefe.correct, aytSozelAnswers.felsefe.wrong) * 3 +
      calculateNet(aytSozelAnswers.din.correct, aytSozelAnswers.din.wrong) * 3;

    return sayisalNet + sozelNet;
  };

  const calculateScore = () => {
    const obp = toNumber(diplomaNote) * 5;
    const obpContribution = placedBefore ? obp / 2 : obp;

    const ydtNet = Math.max(0, calculateNet(ydtAnswers.correct, ydtAnswers.wrong));
    const ydtScore = ydtNet * 3 + obpContribution;

    const tytScore = calculateTYT() + obpContribution;
    const aytScore = calculateAYT() + obpContribution;

    navigation.navigate("ScoreResult", {
      tyt: tytScore.toFixed(2),
      ayt: aytScore.toFixed(2),
      ydt: ydtScore.toFixed(2),
      diplomaNote: diplomaNote || "0.0",
      obp: obpContribution.toFixed(1),
      placed: placedBefore,
      tytNet: {
        turkce: calculateNet(tytAnswers.turkce.correct, tytAnswers.turkce.wrong).toFixed(2),
        sosyal: calculateNet(tytAnswers.sosyal.correct, tytAnswers.sosyal.wrong).toFixed(2),
        matematik: calculateNet(tytAnswers.matematik.correct, tytAnswers.matematik.wrong).toFixed(2),
        fen: calculateNet(tytAnswers.fen.correct, tytAnswers.fen.wrong).toFixed(2),
        total: (
          calculateNet(tytAnswers.turkce.correct, tytAnswers.turkce.wrong) +
          calculateNet(tytAnswers.sosyal.correct, tytAnswers.sosyal.wrong) +
          calculateNet(tytAnswers.matematik.correct, tytAnswers.matematik.wrong) +
          calculateNet(tytAnswers.fen.correct, tytAnswers.fen.wrong)
        ).toFixed(2),
      },
    });
  };



  const handleChange = (section, type, value, tab, sub = null) => {
    if (tab === 'TYT') {
      setTytAnswers((prev) => ({ ...prev, [section]: { ...prev[section], [type]: value } }));
    } else if (tab === 'AYT') {
      if (sub === 'sozel') {
        setAytSozelAnswers((prev) => ({ ...prev, [section]: { ...prev[section], [type]: value } }));
      } else {
        setAytAnswers((prev) => ({ ...prev, [section]: { ...prev[section], [type]: value } }));
      }
    }
  };

  const renderQuestions = (tabKey, questions, answers, sub = null) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{tabKey === 'TYT' ? '📝 TYT Sınavı' : sub === 'sozel' ? '📗 Sözel Testler' : '📘 Sayısal Testler'}</Text>
      {questions.map(({ key, label, total }) => (
        <View key={key} style={styles.questionRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.subtext}>{total} Soru</Text>
          </View>
          <View style={styles.dualInput}>
            <TextInput
              placeholder="Doğru"
              style={styles.qInput}
              keyboardType="numeric"
              value={answers[key].correct}
              onChangeText={(val) => handleChange(key, 'correct', val, tabKey, sub)}
            />
            <TextInput
              placeholder="Yanlış"
              style={styles.qInput}
              keyboardType="numeric"
              value={answers[key].wrong}
              onChangeText={(val) => handleChange(key, 'wrong', val, tabKey, sub)}
            />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColor + "10" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={themeColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>YKS Puan Hesaplama</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎓 Diploma ve Yerleşme</Text>
          <Text style={styles.label}>Diploma Notu</Text>
          <TextInput
            value={diplomaNote}
            onChangeText={setDiplomaNote}
            placeholder="0-100"
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.switchRow}>
            <Text style={styles.label}>Geçen yıl yerleştim</Text>
            <Switch
              value={placedBefore}
              onValueChange={setPlacedBefore}
              trackColor={{ true: '#fff' }}
            />
          </View>
          <Text style={styles.hint}>OBP: Diploma notu × 5 olarak hesaplanır. Yerleşmişseniz OBP katkısı yarıya düşer.</Text>
        </View>

        <View style={styles.tabRow}>
          {['TYT', 'AYT', 'YDT'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'TYT' &&
          renderQuestions('TYT', [
            { key: 'turkce', label: 'Türkçe', total: 40 },
            { key: 'sosyal', label: 'Sosyal Bilimler', total: 20 },
            { key: 'matematik', label: 'Temel Matematik', total: 40 },
            { key: 'fen', label: 'Fen Bilimleri', total: 20 },
          ], tytAnswers)}

        {activeTab === 'AYT' && (
          <>
            <TouchableOpacity onPress={() => setShowSayisal(!showSayisal)} style={[styles.tabBtn, { alignSelf: 'flex-start', marginBottom: 12 }]}>
              <Text style={{ color: themeColor, fontWeight: 'bold' }}>{showSayisal ? '▼' : '▶'} Sayısal Testler</Text>
            </TouchableOpacity>

            {showSayisal && renderQuestions('AYT', [
              { key: 'matematik', label: 'Matematik', total: 40 },
              { key: 'fizik', label: 'Fizik', total: 14 },
              { key: 'kimya', label: 'Kimya', total: 13 },
              { key: 'biyoloji', label: 'Biyoloji', total: 13 },
            ], aytAnswers)}

            <TouchableOpacity onPress={() => setShowSozel(!showSozel)} style={[styles.tabBtn, { alignSelf: 'flex-start', marginBottom: 12 }]}>
              <Text style={{ color: themeColor, fontWeight: 'bold' }}>{showSozel ? '▼' : '▶'} Sözel Testler</Text>
            </TouchableOpacity>

            {showSozel && renderQuestions('AYT', [
              { key: 'edebiyat', label: 'Edebiyat', total: 24 },
              { key: 'tarih1', label: 'Tarih-1', total: 10 },
              { key: 'cografya1', label: 'Coğrafya-1', total: 6 },
              { key: 'tarih2', label: 'Tarih-2', total: 11 },
              { key: 'cografya2', label: 'Coğrafya-2', total: 11 },
              { key: 'felsefe', label: 'Felsefe', total: 12 },
              { key: 'din', label: 'Din Kültürü', total: 6 },
            ], aytSozelAnswers, 'sozel')}


          </>
        )}
        {activeTab === 'YDT' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌐 Yabancı Dil Testi</Text>

            <Text style={[styles.label, { marginBottom: 8 }]}>Dil Seçimi</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {['İngilizce', 'Almanca', 'Fransızca', 'Rusça', 'Arapça'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => setSelectedLanguage(lang)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    backgroundColor: selectedLanguage === lang ? themeColor : '#e5e7eb',
                  }}
                >
                  <Text style={{ color: selectedLanguage === lang ? '#fff' : '#111', fontWeight: '600' }}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.questionRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{selectedLanguage}</Text>
                <Text style={styles.subtext}>80 Soru</Text>
              </View>
              <View style={styles.dualInput}>
                <TextInput
                  placeholder="Doğru"
                  style={styles.qInput}
                  keyboardType="numeric"
                  value={ydtAnswers.correct}
                  onChangeText={(val) => setYdtAnswers((prev) => ({ ...prev, correct: val }))}
                />
                <TextInput
                  placeholder="Yanlış"
                  style={styles.qInput}
                  keyboardType="numeric"
                  value={ydtAnswers.wrong}
                  onChangeText={(val) => setYdtAnswers((prev) => ({ ...prev, wrong: val }))}
                />
              </View>
            </View>
          </View>
        )}
        <TouchableOpacity style={styles.calcButton} onPress={calculateScore}>
          <Text style={styles.calcText}>➔ Puanları Hesapla</Text>
        </TouchableOpacity>



      </ScrollView>
    </SafeAreaView>
  );
};

function getStyles(themeColor) {
  return StyleSheet.create({
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
    card: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: themeColor,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      color: themeColor,
    },
    label: {
      fontWeight: '500',
      fontSize: 14,
      color: '#1f2937',
    },
    hint: {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 8,
    },
    input: {
      backgroundColor: '#f0fdf4',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 6,
      fontSize: 14,
      borderWidth: 1,
      borderColor: themeColor,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
    },
    questionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    subtext: {
      fontSize: 12,
      color: '#9ca3af',
    },
    dualInput: {
      flexDirection: 'row',
      gap: 8,
    },
    qInput: {
      backgroundColor: '#f9fafb',
      padding: 8,
      borderRadius: 8,
      width: 60,
      textAlign: 'center',
      borderWidth: 1,
      borderColor: '#d1d5db',
    },
    calcButton: {
      backgroundColor: themeColor,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 12,
    },
    calcText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    tabRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 16,
      gap: 8,
    },
    tabBtn: {
      backgroundColor: themeColor + "20",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    activeTab: {
      backgroundColor: themeColor,
    },
    tabText: {
      fontWeight: '600',
      color: themeColor,
    },
    activeTabText: {
      color: '#fff',
    },
    resultCard: {
      backgroundColor: '#f0fdf4',
      borderRadius: 16,
      padding: 16,
      marginTop: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#4ade80',
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#166534',
    },
    resultItem: {
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 4,
      color: '#065f46',
    },
    dismissBtn: {
      marginTop: 10,
      backgroundColor: '#10b981',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },

  });
}


export default ScoreCalculatorScreen;