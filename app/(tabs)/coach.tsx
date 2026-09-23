import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { coachReply } from '../../src/lib/coach';

export default function CoachScreen() {
  const [key, setKey] = useState('');
  const [line, setLine] = useState('Bol, aaj kya scene hai? Done kiya ya bahaana ready hai? 😏');
  const [busy, setBusy] = useState(false);

  const ask = async (situation: 'done' | 'miss' | 'sos' | 'slip') => {
    setBusy(true);
    const r = await coachReply({ habitName: 'Smoking ZERO', kind: 'quit', streak: 3, mode: 'savage_caring' }, situation, key || undefined);
    setLine(r);
    setBusy(false);
  };

  return (
    <SafeAreaView style={s.root}>
      <Text style={s.title}>Savage Coach 🤖🔥</Text>
      <View style={s.bubble}><Text style={s.bubbleText}>{busy ? 'Soch raha hu...' : line}</Text></View>
      <View style={s.row}>
        <Pressable style={s.btn} onPress={() => ask('done')}><Text style={s.btnT}>Done ✅</Text></Pressable>
        <Pressable style={s.btn} onPress={() => ask('miss')}><Text style={s.btnT}>Miss 😅</Text></Pressable>
        <Pressable style={s.btn} onPress={() => ask('sos')}><Text style={s.btnT}>Craving 🆘</Text></Pressable>
      </View>
      <TextInput value={key} onChangeText={setKey} placeholder="Groq API key (optional)" placeholderTextColor="#555" style={s.input} secureTextEntry />
      <Text style={s.hint}>Key nahi hai? Offline savage dialogues chalenge. Key dalega to Llama-3.1 smart roast + care milega.</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0F', padding: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  bubble: { backgroundColor: '#14141C', borderColor: '#FFB020', borderWidth: 1, borderRadius: 16, padding: 16, minHeight: 100 },
  bubbleText: { color: '#fff', fontSize: 16, lineHeight: 22 },
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { flex: 1, backgroundColor: '#1A1A22', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#23232E' },
  btnT: { color: '#fff', fontWeight: '700' },
  input: { backgroundColor: '#101016', color: '#fff', borderRadius: 12, padding: 12, marginTop: 14, borderWidth: 1, borderColor: '#23232E' },
  hint: { color: '#55555F', marginTop: 10, lineHeight: 20 },
});
