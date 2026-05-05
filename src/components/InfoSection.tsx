// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { JSX, ReactNode } from 'react';
import { Eyebrow, Icon } from '../lumena/primitives';
import { ICONS } from '../lumena/icons';

interface InfoSectionProps {
  readonly title?: string | JSX.Element;
  readonly children: ReactNode;
  readonly onButtonClick?: (id: string) => void;
  readonly resourceType?: string;
  readonly id?: string;
}

export function InfoSection({ title, children, onButtonClick, id = '' }: InfoSectionProps): JSX.Element {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-quiet)',
        borderRadius: 8,
        marginBottom: 24,
        width: '100%',
      }}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-quiet)',
          }}
        >
          {typeof title === 'string' ? <Eyebrow>{title}</Eyebrow> : title}
          {onButtonClick && (
            <button
              onClick={() => onButtonClick(id)}
              aria-label="Close"
              style={{
                width: 24,
                height: 24,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-muted)',
                background: 'transparent',
                border: 0,
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              <Icon d={ICONS.plus} size={14} style={{ transform: 'rotate(45deg)' }} />
            </button>
          )}
        </div>
      )}
      <div style={{ padding: '4px 0' }}>{children}</div>
    </div>
  );
}
