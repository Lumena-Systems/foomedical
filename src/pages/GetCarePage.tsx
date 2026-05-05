// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { Appointment, Bundle, HealthcareService, Patient, Reference, Slot } from '@medplum/fhirtypes';
import { createReference, getExtensionValue, isDefined, normalizeErrorString } from '@medplum/core';
import { Document, Scheduler, useMedplum } from '@medplum/react';
import type { SlotSearchFunction } from '@medplum/react';
import { useSearchOne } from '@medplum/react-hooks';
import { useState } from 'react';
import type { JSX, ReactNode } from 'react';
import { Loading } from '../components/Loading';

const SERVICE_TYPE_REFERENCE_URI = 'https://medplum.com/fhir/service-type-reference';

function PageShell({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div style={{ padding: 24, maxWidth: 880, margin: '0 auto' }}>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--fg-primary)',
          margin: '0 0 8px',
        }}
      >
        Get care
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 15,
          color: 'var(--fg-secondary)',
          margin: '0 0 24px',
          lineHeight: 1.5,
        }}
      >
        Choose a time that works for you and we will take it from there.
      </p>
      {children}
    </div>
  );
}

function Notice({ tone, title, children }: { tone: 'danger' | 'success'; title: string; children?: ReactNode }): JSX.Element {
  const palette =
    tone === 'danger'
      ? { bg: 'var(--danger-bg)', fg: 'var(--danger)', border: 'var(--danger)' }
      : { bg: 'var(--success-bg)', fg: 'var(--success)', border: 'var(--success)' };
  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 8,
        padding: '14px 16px',
        color: palette.fg,
        fontSize: 14,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: children ? 4 : 0 }}>{title}</div>
      {children && <div style={{ color: 'var(--fg-primary)', fontSize: 14 }}>{children}</div>}
    </div>
  );
}

export function GetCare(): JSX.Element {
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const [schedule, loading] = useSearchOne('Schedule');

  const healthcareServiceRef = schedule?.serviceType
    ?.map(
      (concept) => getExtensionValue(concept, SERVICE_TYPE_REFERENCE_URI) as Reference<HealthcareService> | undefined
    )
    .find(isDefined);

  const fetchSlots: SlotSearchFunction = async (period) => {
    if (!schedule || !healthcareServiceRef?.reference) {
      return [];
    }

    // $find op requires `start` and `end` times are defined
    if (!period.start || !period.end) {
      return [];
    }

    const params = new URLSearchParams({
      start: period.start,
      end: period.end,
      'service-type-reference': healthcareServiceRef.reference,
    });
    const findUrl = medplum.fhirUrl('Schedule', schedule.id, '$find');
    const bundle = await medplum.get<Bundle<Slot>>(`${findUrl}?${params}`);
    return bundle.entry?.map((entry) => entry.resource).filter(isDefined) ?? [];
  };

  const [bookSuccess, setBookSuccess] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState<unknown>();

  const bookSlot = async (slot: Slot): Promise<void> => {
    setBookLoading(true);
    await medplum
      .post<Bundle<Appointment | Slot>>(medplum.fhirUrl('Appointment', '$book'), {
        resourceType: 'Parameters',
        parameter: [
          { name: 'slot', resource: slot },
          { name: 'patient-reference', valueReference: createReference(patient) },
        ],
      })
      .then(
        () => setBookSuccess(true),
        (err) => setBookError(err)
      )
      .finally(() => setBookLoading(false));
  };

  if (loading) {
    return (
      <PageShell>
        <Loading />
      </PageShell>
    );
  }

  if (!schedule) {
    return (
      <PageShell>
        <Notice tone="danger" title="Schedule unavailable">
          Loading the schedule failed.
        </Notice>
      </PageShell>
    );
  }

  if (!healthcareServiceRef) {
    return (
      <PageShell>
        <Notice tone="danger" title="Schedule unavailable">
          No appointment type is configured for this schedule.
        </Notice>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Document width={800}>
        <Scheduler schedule={schedule} fetchSlots={fetchSlots} onSelectSlot={bookSlot}>
          {bookLoading && <Loading />}
          {!!bookError && (
            <Notice tone="danger" title="Booking failed">
              {normalizeErrorString(bookError)}
            </Notice>
          )}
          {bookSuccess && (
            <Notice tone="success" title="You are all set">
              Your appointment has been created.
            </Notice>
          )}
        </Scheduler>
      </Document>
    </PageShell>
  );
}
