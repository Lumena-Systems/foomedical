// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, formatObservationValue, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import type { CSSProperties, JSX } from 'react';

const thStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  background: 'var(--paper-100)',
  borderBottom: '1px solid var(--border-quiet)',
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.10em',
  color: 'var(--fg-muted)',
  lineHeight: 1,
  height: 36,
};

const tdStyle: CSSProperties = {
  padding: '0 16px',
  height: 36,
  borderBottom: '1px solid var(--border-quiet)',
  color: 'var(--fg-primary)',
  fontSize: 14,
  verticalAlign: 'middle',
};

export function Vitals(): JSX.Element {
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const observations = medplum.searchResources('Observation', 'patient=' + getReferenceString(patient)).read();

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--fg-primary)',
          margin: '0 0 16px',
        }}
      >
        Vitals
      </h1>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-quiet)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Measurement</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Your value</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Last updated</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((obs, i) => (
              <tr key={obs.id}>
                <td style={i === observations.length - 1 ? { ...tdStyle, borderBottom: 0 } : tdStyle}>
                  {obs.code?.coding?.[0]?.display}
                </td>
                <td
                  style={{
                    ...tdStyle,
                    borderBottom: i === observations.length - 1 ? 0 : tdStyle.borderBottom,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                  }}
                >
                  {formatObservationValue(obs)}
                </td>
                <td
                  style={{
                    ...tdStyle,
                    borderBottom: i === observations.length - 1 ? 0 : tdStyle.borderBottom,
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: 'var(--fg-muted)',
                  }}
                >
                  {formatDate(obs.meta?.lastUpdated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
