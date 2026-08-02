import type { ComponentType } from 'react';
import type { EngineState } from '../../hooks/usePhaseEngine';
import BoxBreathingGuide from './BoxBreathingGuide';
import CircleBreathGuide from './CircleBreathGuide';
import CountingGuide from './CountingGuide';
import BodyScanGuide from './BodyScanGuide';

export const GUIDES: Record<string, ComponentType<{ engine: EngineState }>> = {
  'box-breathing': BoxBreathingGuide,
  'four-seven-eight': CircleBreathGuide,
  'counting-breaths': CountingGuide,
  'body-scan': BodyScanGuide,
};
