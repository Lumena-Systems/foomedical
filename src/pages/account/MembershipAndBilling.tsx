// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Table } from '@mantine/core';
import { formatCoding, getReferenceString } from '@medplum/core';
import type { Coverage, Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';

function CoverageTable({ coverages }: { coverages: Coverage[] }): JSX.Element {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Payor name</Table.Th>
          <Table.Th>Subscriber ID</Table.Th>
          <Table.Th>Relationship to subscriber</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {coverages.map((c) => (
          <Table.Tr key={c.id}>
            <Table.Td>{c.payor?.[0].display}</Table.Td>
            <Table.Td>{c.subscriberId || '-'}</Table.Td>
            <Table.Td>{formatCoding(c.relationship?.coding?.[0]) || '-'}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

const EMPTY_STATE_STYLE = {
  padding: 20,
  color: 'var(--fg-muted)',
  fontSize: 14,
} as const;

export function MembershipAndBilling(): JSX.Element {
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const coverages = medplum
    .searchResources('Coverage', {
      beneficiary: getReferenceString(patient),
    })
    .read();
  const payments = medplum.searchResources('PaymentNotice').read();

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--fg-primary)',
          margin: '0 0 24px',
        }}
      >
        Membership & billing
      </h1>
      <InfoSection title="Coverage">
        {coverages.length === 0 ? (
          <div style={EMPTY_STATE_STYLE}>No coverage</div>
        ) : (
          <div style={{ padding: '0 4px' }}>
            <CoverageTable coverages={coverages} />
          </div>
        )}
      </InfoSection>
      <InfoSection title="Payments">
        {payments.length === 0 ? (
          <div style={EMPTY_STATE_STYLE}>No payments</div>
        ) : (
          <div>
            {payments.map((p) => (
              <InfoButton key={p.id}>{p.id}</InfoButton>
            ))}
          </div>
        )}
      </InfoSection>
    </div>
  );
}
