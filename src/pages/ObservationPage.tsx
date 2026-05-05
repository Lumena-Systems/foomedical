// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Document, ResourceTable, useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useParams } from 'react-router';

export function ObservationPage(): JSX.Element {
  const medplum = useMedplum();
  const { observationId = '' } = useParams();
  const resource = medplum.readResource('Observation', observationId).read();

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--fg-primary)',
          margin: '0 0 24px',
        }}
      >
        Observation
      </h1>
      <Document>
        <ResourceTable value={resource} ignoreMissingValues />
      </Document>
    </div>
  );
}
