// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { StatusBadge, useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function ActionItems(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const carePlans = medplum.searchResources('CarePlan', 'subject=' + getReferenceString(patient)).read();

  if (carePlans.length === 0) {
    return (
      <EmptyState
        icon="check"
        title="Nothing on your plan yet"
        body="Your care team hasn't added items. They'll show up here when they do."
      />
    );
  }

  return (
    <InfoSection>
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
  );
}
