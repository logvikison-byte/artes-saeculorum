import { useEffect, useMemo, useRef, useState } from 'react';
import type { CycleMode, Phase } from '../types';

export interface EngineState {
  elapsedSec: number;
  totalSec: number;
  phase: Phase;
  phaseIndex: number;
  /** 0..1 progress through the current phase. */
  phaseProgress: number;
  /** How many full passes through the phase list have completed. */
  cycleCount: number;
  running: boolean;
  done: boolean;
}

export interface EngineControls {
  toggle: () => void;
  stop: () => void;
}

/**
 * Steps through a technique's phases on a wall-clock timer. In 'loop' mode the
 * phase list repeats until totalSec elapses; in 'fit' mode phase durations are
 * scaled so a single pass fills the session exactly.
 */
export function usePhaseEngine(
  phases: Phase[],
  totalSec: number,
  cycleMode: CycleMode,
  onPhaseChange?: (phase: Phase) => void,
): [EngineState, EngineControls] {
  const effectivePhases = useMemo(() => {
    if (cycleMode === 'loop') return phases;
    const weight = phases.reduce((sum, p) => sum + p.durationSec, 0);
    return phases.map((p) => ({ ...p, durationSec: (p.durationSec / weight) * totalSec }));
  }, [phases, totalSec, cycleMode]);

  const cycleSec = useMemo(
    () => effectivePhases.reduce((sum, p) => sum + p.durationSec, 0),
    [effectivePhases],
  );

  const [elapsedSec, setElapsedSec] = useState(0);
  const [running, setRunning] = useState(true);
  const [stopped, setStopped] = useState(false);
  const lastTickRef = useRef<number | null>(null);
  const lastPhaseKeyRef = useRef<string>('');

  const done = stopped || elapsedSec >= totalSec;

  useEffect(() => {
    if (!running || done) {
      lastTickRef.current = null;
      return;
    }
    const interval = window.setInterval(() => {
      const now = performance.now();
      const last = lastTickRef.current ?? now;
      lastTickRef.current = now;
      setElapsedSec((e) => Math.min(totalSec, e + (now - last) / 1000));
    }, 100);
    return () => window.clearInterval(interval);
  }, [running, done, totalSec]);

  const inCycle = cycleSec > 0 ? elapsedSec % cycleSec : 0;
  const cycleCount = cycleSec > 0 ? Math.floor(elapsedSec / cycleSec) : 0;

  let phaseIndex = 0;
  let phaseStart = 0;
  for (let i = 0; i < effectivePhases.length; i++) {
    const end = phaseStart + effectivePhases[i].durationSec;
    if (inCycle < end || i === effectivePhases.length - 1) {
      phaseIndex = i;
      break;
    }
    phaseStart = end;
  }
  const phase = effectivePhases[phaseIndex];
  const phaseProgress = phase.durationSec > 0
    ? Math.min(1, (inCycle - phaseStart) / phase.durationSec)
    : 1;

  useEffect(() => {
    const key = `${cycleCount}:${phaseIndex}`;
    if (key !== lastPhaseKeyRef.current) {
      lastPhaseKeyRef.current = key;
      if (!done) onPhaseChange?.(phase);
    }
  });

  const state: EngineState = {
    elapsedSec,
    totalSec,
    phase,
    phaseIndex,
    phaseProgress,
    cycleCount,
    running: running && !done,
    done,
  };

  const controls: EngineControls = {
    toggle: () => setRunning((r) => !r),
    stop: () => setStopped(true),
  };

  return [state, controls];
}
