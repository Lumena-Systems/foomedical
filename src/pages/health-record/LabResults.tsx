// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function LabResults(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const reports = medplum.searchResources('DiagnosticReport', 'subject=' + getReferenceString(patient)).read();

  if (reports.length === 0) {
    return (
      <EmptyState
        icon="clipboard"
        title="No lab results yet"
        body="Results shared by your providers will appear here."
      />
    );
  }

  return (
    <InfoSection>
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
  );
}
