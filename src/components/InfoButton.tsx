// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { useState   } from 'react';
import type {JSX, ReactNode} from 'react';

export interface InfoButtonProps {
  readonly onClick?: () => void;
  readonly children: ReactNode;
}

// Pressable row inside an InfoSection — Lumena style: clean borders,
// no shadow, hover darkens the row tint instead of adding lift.
export function InfoButton({ onClick, children }: InfoButtonProps): JSX.Element {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        width: '100%',
        textAlign: 'left',
        padding: '14px 20px',
        background: hover ? 'var(--paper-100)' : 'transparent',
        border: 0,
        borderBottom: '1px solid var(--border-quiet)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        color: 'var(--ink-900)',
        transition: 'background 120ms cubic-bezier(0.2,0,0,1)',
      }}
    >
      {children}
    </button>
  );
}
