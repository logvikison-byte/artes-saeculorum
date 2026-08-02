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
];

export function getTechnique(id: string): Technique | undefined {
  return TECHNIQUES.find((t) => t.id === id);
}
