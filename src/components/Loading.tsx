// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { JSX } from 'react';

// Lumena loading: a 2px progress bar at the top of the affected surface.
// Per the design system: "Loading is a thin 2px progress bar at the top of
// the affected surface, never a centered spinner."
export function Loading(): JSX.Element {
  return (
    <div style={{ position: 'relative', width: '100%', height: 2 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--paper-200)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '30%',
            height: '100%',
            background: 'var(--twilight-500)',
            animation: 'lm-progress 1.2s var(--ease-in-out) infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes lm-progress {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(180%); }
          100% { transform: translateX(360%); }
        }
      `}</style>
    </div>
  );
}
