// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function Medications(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const medications = medplum.searchResources('MedicationRequest', 'patient=' + getReferenceString(patient)).read();

  if (medications.length === 0) {
    return (
      <EmptyState
        icon="doc"
        title="No medications on file"
        body="Active prescriptions and dosing will show up here."
      />
    );
  }

  return (
    <InfoSection>
      {medications.map((med) => (
        <InfoButton key={med.id} onClick={() => navigate(`./${med.id}`)?.catch(console.error)}>
          <div>
            <div style={{ color: 'var(--twilight-700)', fontWeight: 500, marginBottom: 4 }}>
              {med?.medicationCodeableConcept?.text}
            </div>
            <div style={{ color: 'var(--fg-muted)', fontSize: 13 }}>{med.requester?.display}</div>
          </div>
          <Icon d={ICONS.chevronRight} size={16} style={{ color: 'var(--fg-muted)' }} />
        </InfoButton>
      ))}
    </InfoSection>
  );
}
