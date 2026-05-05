// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDateTime, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum, useMedplumProfile } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
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
        Questionnaire responses
      </h1>
      <InfoSection title="Questionnaire responses">
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
    </div>
  );
}
