// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDateTime, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum, useMedplumProfile } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function Responses(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const profile = useMedplumProfile() as Patient;
  const responses = medplum
    .searchResources('QuestionnaireResponse', `source=${getReferenceString(profile)}&_sort=-authored`)
    .read();

  if (responses.length === 0) {
    return (
      <EmptyState
        icon="doc"
        title="No responses yet"
        body="Forms you've completed will be saved here."
      />
    );
  }

  return (
    <InfoSection>
      {responses.map((resp) => (
        <InfoButton key={resp.id} onClick={() => navigate(`./${resp.id}`)?.catch(console.error)}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--fg-primary)',
              fontWeight: 500,
            }}
          >
            {formatDateTime(resp.authored)}
          </div>
          <Icon d={ICONS.chevronRight} size={16} style={{ color: 'var(--fg-muted)' }} />
        </InfoButton>
      ))}
    </InfoSection>
  );
}
