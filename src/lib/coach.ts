import { localCoachLine } from './rewards';

export type CoachContext = {
  habitName: string;
  kind: 'build' | 'quit';
  streak: number;
  mood?: number;
  trigger?: string;
  mode: 'savage_caring' | 'gentle' | 'hardcore';
};

// Offline-first: local line instantly, then optionally enhance with Groq/OpenAI-compatible API.
export function buildPrompt(c: CoachContext, situation: 'done' | 'miss' | 'sos' | 'slip'): string {
  const persona =
    c.mode === 'gentle'
      ? 'You are a kind supportive habit coach.'
      : c.mode === 'hardcore'
        ? 'You are a strict drill-sergeant coach. No excuses, short, intense.'
        : 'You are a savage but caring Indian coach. Hinglish allowed. Roast the excuse, love the person. Max 2 lines. End with one concrete 2-min action.';
  return `${persona}\nHabit: ${c.habitName} (${c.kind}), streak ${c.streak}, mood ${c.mood ?? '-'}, trigger ${c.trigger ?? '-'}, situation ${situation}. Reply in Hinglish, max 40 words.`;
}

export async function coachReply(
  ctx: CoachContext,
  situation: 'done' | 'miss' | 'sos' | 'slip',
  groqKey?: string,
): Promise<string> {
  const fallback = localCoachLine(situation);
  if (!groqKey) return fallback;
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: buildPrompt(ctx, situation) }],
        max_tokens: 120,
        temperature: 0.8,
      }),
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    const text: string | undefined = json?.choices?.[0]?.message?.content;
    return text?.trim() || fallback;
  } catch {
    return fallback;
  }
}
