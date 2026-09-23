import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { localCoachLine } from '../../src/lib/rewards';

export default function SosScreen() {
  return (
    <SafeAreaView style={s.root}>
      <Text style={s.title}>SOS — Craving Toolkit 🆘</Text>
      <View style={s.card}>
        <Text style={s.big}>5:00</Text>
        <Text style={s.lbl}>Urge 3-5 min ki hai. Timer + 4-7-8 breathing kar.</Text>
      </View>
      <View style={s.card}>
        <Text style={s.lbl}>{localCoachLine('sos')}</Text>
        <Text style={s.lbl}>1. Paani pi 2. Walk 3. WHY card khol 4. Slip hua to trigger log kar — shame nahi, data.</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0F', padding: 16 },
  title: { color: '#FF5C5C', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  card: { backgroundColor: '#14141C', borderColor: '#33232E', borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 10 },
  big: { color: '#fff', fontSize: 40, fontWeight: '800', textAlign: 'center' },
  lbl: { color: '#C9C9D2', marginTop: 8, lineHeight: 20 },
});
