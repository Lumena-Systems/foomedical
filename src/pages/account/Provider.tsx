// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { Patient } from '@medplum/fhirtypes';
import { ResourceAvatar, ResourceName, useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { InfoSection } from '../../components/InfoSection';
import { Btn } from '../../lumena/primitives';

const HEADING_STYLE = {
  fontFamily: 'var(--font-sans)',
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: 'var(--fg-primary)',
  margin: '0 0 20px',
} as const;

export function Provider(): JSX.Element {
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;

  if (patient.generalPractitioner && patient.generalPractitioner.length > 0) {
    return (
      <div>
        <h1 style={HEADING_STYLE}>My provider</h1>
        <InfoSection title="My primary care provider">
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <ResourceAvatar size={120} radius={60} value={patient.generalPractitioner[0]} />
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--fg-primary)',
                  margin: 0,
                }}
              >
                <ResourceName value={patient.generalPractitioner[0]} />
              </h2>
              <Btn variant="primary" size="lg">
                Choose a primary care provider
              </Btn>
            </div>
          </div>
        </InfoSection>
      </div>
    );
  }

  return (
    <div>
      <h1 style={HEADING_STYLE}>Choose a provider</h1>
      <InfoSection title="My primary care provider">
        <div style={{ padding: 20, color: 'var(--fg-muted)', fontSize: 14 }}>TODO</div>
      </InfoSection>
    </div>
  );
}
