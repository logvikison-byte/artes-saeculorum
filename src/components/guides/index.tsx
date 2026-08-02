import type { ComponentType } from 'react';
import type { EngineState } from '../../hooks/usePhaseEngine';
import BoxBreathingGuide from './BoxBreathingGuide';
import CircleBreathGuide from './CircleBreathGuide';
import CountingGuide from './CountingGuide';
import BodyScanGuide from './BodyScanGuide';
import GroundingGuide from './GroundingGuide';
import LovingKindnessGuide from './LovingKindnessGuide';
import CandleGuide from './CandleGuide';
import WalkingGuide from './WalkingGuide';

export const GUIDES: Record<string, ComponentType<{ engine: EngineState }>> = {
  'box-breathing': BoxBreathingGuide,
  'four-seven-eight': CircleBreathGuide,
  'counting-breaths': CountingGuide,
  'body-scan': BodyScanGuide,
  'grounding-54321': GroundingGuide,
  'loving-kindness': LovingKindnessGuide,
  'candle-gazing': CandleGuide,
  'walking': WalkingGuide,
};
