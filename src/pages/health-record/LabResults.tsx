// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function LabResults(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const reports = medplum.searchResources('DiagnosticReport', 'subject=' + getReferenceString(patient)).read();

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
        Lab results
      </h1>
      <InfoSection title="Lab results">
        {reports.map((report) => (
          <InfoButton key={report.id} onClick={() => navigate(`./${report.id}`)?.catch(console.error)}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--fg-muted)',
                  marginBottom: 4,
                }}
              >
                {formatDate(report.meta?.lastUpdated as string)}
              </div>
              <div style={{ color: 'var(--fg-primary)', fontWeight: 500 }}>{report.code?.text}</div>
            </div>
            <Icon d={ICONS.chevronRight} size={16} style={{ color: 'var(--fg-muted)' }} />
          </InfoButton>
        ))}
      </InfoSection>
    </div>
  );
}
