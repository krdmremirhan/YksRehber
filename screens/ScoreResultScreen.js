import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ScoreResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    tyt,
    ayt,
    ydt,
    diplomaNote,
    obp,
    placed,
    tytNet,
  } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#3b82f6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Puan Bilgileri</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.title}>✅ Puan Bilgileri</Text>
        <Text style={styles.description}>
          Girmiş olduğun bilgilere göre tahmini YKS puanların aşağıda listelenmiştir. Bu sonuçlar tahminidir. Kat sayı değerleri bir önceki seneye göre elde edilmiş olup gerçek sınavdaki değerler farklı olması durumunda sonuç değişebilir.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📄 Diploma Bilgileri</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Diploma Notu</Text>
          <Text style={styles.value}>{diplomaNote}/100</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>OBP</Text>
          <Text style={styles.value}>{obp}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Yerleşme Durumu</Text>
          <Text style={[styles.value, { color: placed ? 'red' : 'green' }]}> 
            {placed ? 'Yerleşti' : 'Yerleşmedi'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Net Sayıları</Text>
        <Text style={styles.rowText}>TYT Türkçe: {tytNet.turkce}/40</Text>
        <Text style={styles.rowText}>Sosyal Bilimler: {tytNet.sosyal}/20</Text>
        <Text style={styles.rowText}>Temel Matematik: {tytNet.matematik}/40</Text>
        <Text style={styles.rowText}>Fen Bilimleri: {tytNet.fen}/20</Text>
        <Text style={[styles.rowText, { fontWeight: 'bold' }]}>Toplam Net: {tytNet.total}/120</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Yerleştirme Puanları</Text>
        <Text style={styles.rowText}>TYT Puanı: {tyt}</Text>
        <Text style={styles.rowText}>Sayısal (SAY): {ayt}</Text>
        <Text style={styles.rowText}>Sözel (SÖZ): {ayt}</Text>
        <Text style={styles.rowText}>Eşit Ağırlık (EA): {ayt}</Text>
        <Text style={styles.rowText}>Dil (DİL): {ydt}</Text>
        <Text style={styles.note}>
          Not: TYT puanı sadece ham puandan oluşur, diğer puanlara OBP katkısı eklenmiştir.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeBtn}
      >
        <Text style={{ fontWeight: '600', color: '#3b82f6' }}>Kapat</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f9ff',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2563eb',
  },
  description: {
    fontSize: 13,
    color: '#334155',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 8,
    color: '#1e40af',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#111827',
  },
  label: {
    fontSize: 14,
    color: '#475569',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  note: {
    marginTop: 10,
    fontSize: 12,
    color: '#64748b',
  },
  closeBtn: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
});

export default ScoreResultScreen;
