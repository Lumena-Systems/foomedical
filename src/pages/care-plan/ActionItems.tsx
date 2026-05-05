// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { StatusBadge, useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function ActionItems(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const carePlans = medplum.searchResources('CarePlan', 'subject=' + getReferenceString(patient)).read();

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
        Action items
      </h1>
      <InfoSection title="Action items">
        {carePlans.map((resource) => (
          <InfoButton key={resource.id} onClick={() => navigate(`./${resource.id}`)?.catch(console.error)}>
            <div>
              <div style={{ color: 'var(--twilight-700)', fontWeight: 500, marginBottom: 6 }}>{resource.title}</div>
              <div
                style={{
                  color: 'var(--fg-muted)',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <Icon d={ICONS.calendar} size={14} style={{ color: 'var(--fg-muted)' }} />
                <time>{formatDate(resource.period?.start)}</time>
                {resource.period?.end && (
                  <>
                    <span>—</span>
                    <time>{formatDate(resource.period.end)}</time>
                  </>
                )}
              </div>
            </div>
            <StatusBadge status={resource.status as string} />
          </InfoButton>
        ))}
      </InfoSection>
    </div>
  );
}
