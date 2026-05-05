// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Modal } from '@mantine/core';
import { formatDateTime, formatHumanName, formatTiming } from '@medplum/core';
import type { MedicationRequest } from '@medplum/fhirtypes';
import { ResourceTable, useMedplum } from '@medplum/react';
import { useState } from 'react';
import type { JSX } from 'react';
import { useParams } from 'react-router';
import { InfoSection } from '../../components/InfoSection';
import { Btn } from '../../lumena/primitives';

export function Medication(): JSX.Element {
  const medplum = useMedplum();
  const [modalOpen, setModalOpen] = useState(false);
  const { medicationId = '' } = useParams();
  const med: MedicationRequest = medplum.readResource('MedicationRequest', medicationId).read();

  return (
    <div style={{ maxWidth: 800 }}>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--fg-primary)',
          margin: '0 0 12px',
        }}
      >
        {med.medicationCodeableConcept?.text}
      </h1>
      <p style={{ color: 'var(--fg-secondary)', margin: '0 0 8px', fontSize: 14 }}>
        To refill this medication, please contact your pharmacy.
      </p>
      <p style={{ color: 'var(--fg-secondary)', margin: '0 0 24px', fontSize: 14 }}>
        No more refills available at your pharmacy?{' '}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            background: 'transparent',
            border: 0,
            padding: 0,
            color: 'var(--fg-link)',
            cursor: 'pointer',
            font: 'inherit',
            textDecoration: 'underline',
            textUnderlineOffset: 2,
          }}
        >
          Renew your prescription
        </button>
      </p>
      <InfoSection title="Medication">
        <div style={{ padding: '8px 20px' }}>
          <ResourceTable value={med} ignoreMissingValues />
        </div>
      </InfoSection>
      <RenewalModal prev={med} opened={modalOpen} setOpened={setModalOpen} />
    </div>
  );
}

function RenewalModal({
  prev,
  opened,
  setOpened,
}: {
  readonly prev: MedicationRequest;
  readonly opened: boolean;
  readonly setOpened: (o: boolean) => void;
}): JSX.Element {
  const medplum = useMedplum();
  const patient = medplum.getProfile();
  return (
    <Modal
      size="lg"
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--fg-primary)',
          }}
        >
          Request a renewal
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <KeyValue name="Patient" value={formatHumanName(patient?.name?.[0])} />
        <KeyValue name="Last prescribed" value={formatDateTime(prev.authoredOn)} mono />
        <KeyValue name="Status" value={prev.status} />
        <KeyValue name="Medication" value={prev.medicationCodeableConcept?.text} />
        <KeyValue
          name="Dosage instructions"
          value={prev.dosageInstruction?.[0]?.timing && formatTiming(prev.dosageInstruction[0].timing)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <Btn variant="primary" onClick={() => setOpened(false)}>
            Submit renewal request
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

function KeyValue({
  name,
  value,
  mono = false,
}: {
  name: string;
  value: string | undefined;
  mono?: boolean;
}): JSX.Element {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          color: 'var(--fg-muted)',
          marginBottom: 4,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: 'var(--fg-primary)',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        }}
      >
        {value}
      </div>
    </div>
  );
}
