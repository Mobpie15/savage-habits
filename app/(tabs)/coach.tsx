import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { coachReply } from '../../src/lib/coach';
import { F, T } from '../../src/components/theme';

export default function CoachScreen() {
  const [key, setKey] = useState('');
  const [line, setLine] = useState('Bolo, aaj ka scene kya hai? Done kiya ya bahaana ready hai?');
  const [busy, setBusy] = useState(false);

  const ask = async (situation: 'done' | 'miss' | 'sos' | 'slip') => {
    setBusy(true);
    const r = await coachReply({ habitName: 'Smoking ZERO', kind: 'quit', streak: 3, mode: 'savage_caring' }, situation, key || undefined);
    setLine(r);
    setBusy(false);
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.head}>
        <MaterialCommunityIcons name="robot" size={26} color={T.accent} />
        <Text style={s.title}>Savage Coach</Text>
      </View>
      <View style={s.bubble}><Text style={s.bubbleText}>{busy ? 'Soch raha hun...' : line}</Text></View>
      <View style={s.row}>
        <Pressable style={s.btn} onPress={() => ask('done')}><Text style={s.btnT}>Done</Text></Pressable>
        <Pressable style={s.btn} onPress={() => ask('miss')}><Text style={s.btnT}>Miss</Text></Pressable>
        <Pressable style={s.btn} onPress={() => ask('sos')}><Text style={s.btnT}>Craving</Text></Pressable>
      </View>
      <TextInput value={key} onChangeText={setKey} placeholder="Groq API key (optional)" placeholderTextColor={T.faint} style={s.input} secureTextEntry />
      <Text style={s.hint}>Key nahi hai? Offline savage dialogues chalenge. Key daloge to Llama-3.1 smart roast + care milega.</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg, padding: 16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  title: { color: T.text, fontSize: 22, fontFamily: F.extra },
  bubble: { backgroundColor: T.card, borderColor: T.accent, borderWidth: 1, borderRadius: 16, padding: 16, minHeight: 100 },
  bubbleText: { color: T.text, fontSize: 16, lineHeight: 22, fontFamily: F.medium },
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { flex: 1, backgroundColor: T.card2, padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  btnT: { color: T.text, fontFamily: F.bold },
  input: { backgroundColor: T.card, color: T.text, borderRadius: 12, padding: 12, marginTop: 14, borderWidth: 1, borderColor: T.border, fontFamily: F.medium },
  hint: { color: T.faint, marginTop: 10, lineHeight: 20, fontFamily: F.medium },
});
