// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, getReferenceString } from '@medplum/core';
import type { Immunization, Patient } from '@medplum/fhirtypes';
import { StatusBadge, useMedplum } from '@medplum/react';
import { IconMapPin } from '@tabler/icons-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function Vaccines(): JSX.Element {
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const vaccines = medplum.searchResources('Immunization', 'patient=' + getReferenceString(patient)).read();
  const today = new Date().toISOString();
  const activeVaccines = vaccines.filter((v) => v.occurrenceDateTime && v.occurrenceDateTime > today);
  const pastVaccines = vaccines.filter((v) => !v.occurrenceDateTime || v.occurrenceDateTime <= today);

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
        Vaccines
      </h1>
      <InfoSection title="Active upcoming vaccines">
        {activeVaccines.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--fg-muted)' }}>
            <div style={{ fontSize: 14, color: 'var(--fg-secondary)', marginBottom: 4 }}>
              No upcoming vaccines available.
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
              If you think you&apos;re missing upcoming vaccines that should be here, please{' '}
              <a
                href="#"
                style={{ color: 'var(--fg-link)', textDecoration: 'underline', textUnderlineOffset: 2 }}
              >
                contact our medical team
              </a>
              .
            </div>
          </div>
        ) : (
          <VaccineList vaccines={activeVaccines} />
        )}
      </InfoSection>
      {pastVaccines.length > 0 && (
        <InfoSection title="Past vaccines">
          <VaccineList vaccines={pastVaccines} />
        </InfoSection>
      )}
    </div>
  );
}

function VaccineList({ vaccines }: { vaccines: Immunization[] }): JSX.Element {
  return (
    <>
      {vaccines.map((vaccine) => (
        <VaccineRow key={vaccine.id} vaccine={vaccine} />
      ))}
    </>
  );
}

function VaccineRow({ vaccine }: { vaccine: Immunization }): JSX.Element {
  const navigate = useNavigate();
  return (
    <InfoButton onClick={() => navigate(`./${vaccine.id}`)?.catch(console.error)}>
      <div>
        <div style={{ color: 'var(--twilight-700)', fontWeight: 500, marginBottom: 6 }}>
          {vaccine.vaccineCode?.text}
        </div>
        {vaccine.location?.display && (
          <div
            style={{
              color: 'var(--fg-muted)',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <IconMapPin size={14} stroke={1.5} color="currentColor" />
            {vaccine.location.display}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StatusBadge status={vaccine.status} />
        {vaccine.occurrenceDateTime && (
          <div
            style={{
              color: 'var(--fg-muted)',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon d={ICONS.calendar} size={14} style={{ color: 'var(--fg-muted)' }} />
            <time
              dateTime={vaccine.occurrenceDateTime}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
            >
              {formatDate(vaccine.occurrenceDateTime)}
            </time>
          </div>
        )}
      </div>
    </InfoButton>
  );
}
