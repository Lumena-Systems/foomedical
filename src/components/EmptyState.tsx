// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { JSX } from 'react';
import { ICONS } from '../lumena/icons';
import type { IconName } from '../lumena/icons';
import { Icon } from '../lumena/primitives';

interface EmptyStateProps {
  readonly icon: IconName;
  readonly title: string;
  readonly body: string;
}

export function EmptyState({ icon, title, body }: EmptyStateProps): JSX.Element {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-quiet)',
        borderRadius: 8,
        padding: '48px 24px',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: 24,
      }}
    >
      <Icon d={ICONS[icon]} size={32} style={{ color: 'var(--fg-muted)' }} />
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: 'var(--fg-primary)',
          marginTop: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'var(--fg-muted)',
          marginTop: 6,
          maxWidth: 360,
          lineHeight: 1.5,
        }}
      >
        {body}
      </div>
    </div>
  );
}
