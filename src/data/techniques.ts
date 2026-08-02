import type { Technique } from '../types';

export const TECHNIQUES: Technique[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    tagline: 'Trace the square, steady the mind',
    description:
      'Breathe in four equal parts — in, hold, out, hold — while a dot traces the edges of a square. Used by athletes and pilots to calm nerves fast.',
    family: 'breath',
    cycleMode: 'loop',
    moodTags: ['anxious', 'scattered', 'okay'],
    durations: [60, 180, 300, 600],
    color: '#38bdf8',
    phases: [
      { label: 'Inhale', instruction: 'Breathe in through your nose', durationSec: 4, animation: 'top' },
      { label: 'Hold', instruction: 'Hold gently, shoulders relaxed', durationSec: 4, animation: 'right' },
      { label: 'Exhale', instruction: 'Breathe out slowly through your mouth', durationSec: 4, animation: 'bottom' },
      { label: 'Hold', instruction: 'Rest empty for a moment', durationSec: 4, animation: 'left' },
    ],
  },
  {
    id: 'four-seven-eight',
    name: '4·7·8 Breathing',
    tagline: 'The natural tranquilizer',
    description:
      'Inhale for 4, hold for 7, exhale slowly for 8. The long exhale switches your nervous system into rest mode — great before sleep or when anxiety spikes.',
    family: 'breath',
    cycleMode: 'loop',
    moodTags: ['anxious', 'tired'],
    durations: [60, 180, 300],
    color: '#a78bfa',
    phases: [
      { label: 'Inhale', instruction: 'Breathe in quietly through your nose', durationSec: 4, animation: 'grow' },
      { label: 'Hold', instruction: 'Hold — let the breath settle', durationSec: 7, animation: 'hold' },
      { label: 'Exhale', instruction: 'Whoosh it out slowly through your mouth', durationSec: 8, animation: 'shrink' },
    ],
  },
  {
    id: 'counting-breaths',
    name: 'Counting Breaths',
    tagline: 'One to ten, then begin again',
    description:
      'Count each exhale from one to ten, then start over. Lost count? That is the practice — just smile and return to one. Perfect for busy minds.',
    family: 'breath',
    cycleMode: 'loop',
    moodTags: ['scattered', 'restless', 'okay'],
    durations: [60, 180, 300, 600],
    color: '#34d399',
    phases: [
      { label: 'Inhale', instruction: 'Breathe in, ready to count', durationSec: 4, animation: 'in' },
      { label: 'Exhale', instruction: 'Breathe out and count', durationSec: 6, animation: 'count' },
    ],
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    tagline: 'A slow wave of attention, toes to head',
    description:
      'Move your attention slowly through your body, noticing each region light up. Great for restlessness — it gives a wandering mind a clear path to follow.',
    family: 'body',
    cycleMode: 'fit',
    moodTags: ['restless', 'tired', 'anxious'],
    durations: [180, 300, 600],
    color: '#fb923c',
    phases: [
      { label: 'Feet', instruction: 'Notice your toes and feet — warmth, weight, tingling', durationSec: 1, animation: 'feet' },
      { label: 'Legs', instruction: 'Let attention drift up through calves and thighs', durationSec: 1, animation: 'legs' },
      { label: 'Belly', instruction: 'Feel your belly rise and fall with the breath', durationSec: 1, animation: 'belly' },
      { label: 'Chest', instruction: 'Notice your heartbeat and the breath in your chest', durationSec: 1, animation: 'chest' },
      { label: 'Hands & Arms', instruction: 'Feel your fingers, palms, and arms soften', durationSec: 1, animation: 'arms' },
      { label: 'Shoulders & Neck', instruction: 'Let your shoulders drop away from your ears', durationSec: 1, animation: 'shoulders' },
      { label: 'Face & Head', instruction: 'Soften your jaw, eyes, and forehead', durationSec: 1, animation: 'head' },
      { label: 'Whole Body', instruction: 'Feel your whole body breathing as one', durationSec: 1, animation: 'whole' },
    ],
  },
  {
    id: 'grounding-54321',
    name: '5·4·3·2·1 Grounding',
    tagline: 'Come back to your senses',
    description:
      'Notice 5 things you can see, 4 you can hear, 3 you can feel, 2 you can smell, 1 you can taste. A fast anchor out of spiraling thoughts — eyes open, anywhere.',
    family: 'grounding',
    cycleMode: 'fit',
    moodTags: ['anxious', 'scattered'],
    durations: [60, 180, 300],
    color: '#f472b6',
    unlock: { hint: 'Complete 3 sessions', test: (c) => c.sessionCount >= 3 },
    phases: [
      { label: 'See', instruction: 'Look around — find 5 things you can see', durationSec: 5, animation: 'see' },
      { label: 'Hear', instruction: 'Listen — notice 4 sounds around you', durationSec: 4, animation: 'hear' },
      { label: 'Feel', instruction: 'Sense 3 things touching your body', durationSec: 3, animation: 'feel' },
      { label: 'Smell', instruction: 'Notice 2 scents in the air', durationSec: 2, animation: 'smell' },
      { label: 'Taste', instruction: 'Find 1 taste in your mouth', durationSec: 1, animation: 'taste' },
    ],
  },
  {
    id: 'loving-kindness',
    name: 'Loving-Kindness',
    tagline: 'Warmth that ripples outward',
    description:
      'Silently wish wellbeing — first for yourself, then a loved one, then a stranger, then everyone. Watch the warmth ripple outward as your circle widens.',
    family: 'compassion',
    cycleMode: 'fit',
    moodTags: ['tired', 'okay', 'anxious'],
    durations: [180, 300, 600],
    color: '#fb7185',
    unlock: { hint: 'Reach a 3-day streak', test: (c) => c.longestStreak >= 3 },
    phases: [
      { label: 'Yourself', instruction: 'May I be happy. May I be at ease.', durationSec: 1, animation: 'self' },
      { label: 'A loved one', instruction: 'May you be happy. May you be at ease.', durationSec: 1, animation: 'loved' },
      { label: 'A stranger', instruction: 'May you be happy. May you be at ease.', durationSec: 1, animation: 'stranger' },
      { label: 'Everyone', instruction: 'May all beings everywhere be at ease.', durationSec: 1, animation: 'all' },
    ],
  },
  {
    id: 'candle-gazing',
    name: 'Candle Gazing',
    tagline: 'One flame, one focus',
    description:
      'Rest your eyes softly on a flickering flame. When the mind drifts, the flame is always there to return to. An ancient focus practice (trataka) — no breathing rules at all.',
    family: 'visual',
    cycleMode: 'loop',
    moodTags: ['scattered', 'restless'],
    durations: [60, 180, 300],
    color: '#fbbf24',
    unlock: { hint: 'Meditate 30 lifetime minutes', test: (c) => c.totalMinutes >= 30 },
    phases: [
      { label: 'Gaze', instruction: 'Rest your eyes softly on the flame', durationSec: 20, animation: 'gaze' },
      { label: 'Rest', instruction: 'Blink, close your eyes, see the afterglow', durationSec: 5, animation: 'rest' },
    ],
  },
  {
    id: 'walking',
    name: 'Walking Meditation',
    tagline: 'Meditation for bodies that want to move',
    description:
      'Walk slowly and match your attention to each step — lift, move, place. Perfect when sitting still feels impossible. Do it pacing a room or on any quiet path.',
    family: 'movement',
    cycleMode: 'loop',
    moodTags: ['restless', 'tired'],
    durations: [180, 300, 600],
    color: '#4ade80',
    unlock: { hint: 'Reach a 7-day streak', test: (c) => c.longestStreak >= 7 },
    phases: [
      { label: 'Left step', instruction: 'Lift… move… place. Feel the ground meet your foot', durationSec: 3, animation: 'left' },
      { label: 'Right step', instruction: 'Lift… move… place. Slow is the whole point', durationSec: 3, animation: 'right' },
    ],
  },
];

export function getTechnique(id: string): Technique | undefined {
  return TECHNIQUES.find((t) => t.id === id);
}
