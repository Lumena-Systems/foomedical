// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { Immunization } from '@medplum/fhirtypes';
import { ResourceTable, useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useParams } from 'react-router';
import { InfoSection } from '../../components/InfoSection';

export function Vaccine(): JSX.Element {
  const medplum = useMedplum();
  const { vaccineId = '' } = useParams();
  const vaccine: Immunization = medplum.readResource('Immunization', vaccineId).read();

  return (
    <div style={{ maxWidth: 800 }}>
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
        {vaccine.vaccineCode?.text}
      </h1>
      <InfoSection title="Vaccine">
        <div style={{ padding: '8px 20px' }}>
          <ResourceTable value={vaccine} ignoreMissingValues />
        </div>
      </InfoSection>
    </div>
  );
}
