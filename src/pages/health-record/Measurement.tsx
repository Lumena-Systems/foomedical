// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Modal, NumberInput } from '@mantine/core';
import { createReference, formatDate, formatDateTime, formatObservationValue, getReferenceString } from '@medplum/core';
import type { Observation, ObservationComponent, Patient } from '@medplum/fhirtypes';
import { Form, useMedplum } from '@medplum/react';
import type { ChartData, ChartDataset } from 'chart.js';
import { useMemo, useState } from 'react';
import type { CSSProperties, JSX } from 'react';
import { useParams } from 'react-router';
import { LineChart } from '../../components/LineChart';
import { ICONS } from '../../lumena/icons';
import { Btn, Icon } from '../../lumena/primitives';
import { measurementsMeta } from './Measurement.data';

const thStyle: CSSProperties = {
  background: 'var(--paper-100)',
  borderBottom: '1px solid var(--border-quiet)',
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.10em',
  color: 'var(--fg-muted)',
  lineHeight: 1,
  height: 36,
};

const tdStyle: CSSProperties = {
  padding: '0 16px',
  height: 36,
  borderBottom: '1px solid var(--border-quiet)',
  color: 'var(--fg-primary)',
  fontSize: 14,
  verticalAlign: 'middle',
};

export function Measurement(): JSX.Element | null {
  const { measurementId } = useParams();
  const { code, title, description, chartDatasets } = measurementsMeta[measurementId as string];
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const [modalOpen, setModalOpen] = useState(false);

  const observations = medplum
    .searchResources('Observation', `code=${code}&patient=${getReferenceString(patient)}`)
    .read();

  const chartData = useMemo<ChartData<'line', number[]> | undefined>(() => {
    if (!observations) {
      return undefined;
    }
    const labels: string[] = [];
    const datasets: ChartDataset<'line', number[]>[] = chartDatasets.map((item) => ({ ...item, data: [] }));
    for (const obs of observations) {
      labels.push(formatDate(obs.effectiveDateTime));
      if (chartDatasets.length === 1) {
        datasets[0].data.push(obs.valueQuantity?.value as number);
      } else {
        for (let i = 0; i < chartDatasets.length; i++) {
          datasets[i].data.push((obs.component as ObservationComponent[])[i].valueQuantity?.value as number);
        }
      }
    }
    return { labels, datasets };
  }, [chartDatasets, observations]);

  function addObservation(formData: Record<string, string>): void {
    const obs: Observation = {
      resourceType: 'Observation',
      status: 'preliminary',
      subject: createReference(patient),
      effectiveDateTime: new Date().toISOString(),
      code: {
        coding: [
          {
            code,
            display: title,
            system: 'http://loinc.org',
          },
        ],
        text: title,
      },
    };

    if (chartDatasets.length === 1) {
      obs.valueQuantity = {
        value: Number.parseFloat(formData[chartDatasets[0].label]),
        system: 'http://unitsofmeasure.org',
        unit: chartDatasets[0].unit,
        code: chartDatasets[0].unit,
      };
    } else {
      obs.component = chartDatasets.map((item) => ({
        code: {
          coding: [
            {
              code: '8462-4',
              display: 'Diastolic Blood Pressure',
              system: 'http://loinc.org',
            },
          ],
          text: item.label,
        },
        valueQuantity: {
          value: Number.parseFloat(formData[item.label]),
          system: 'http://unitsofmeasure.org',
          unit: item.unit,
          code: item.unit,
        },
      }));
    }

    medplum
      .createResource(obs)
      .then(() => setModalOpen(false))
      .catch(console.error);
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          gap: 16,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--fg-primary)',
            margin: 0,
          }}
        >
          {title}
        </h1>
        <Btn variant="primary" icon="plus" onClick={() => setModalOpen(true)}>
          Add measurement
        </Btn>
      </div>
      {chartData && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-quiet)',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <LineChart chartData={chartData} />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '12px 16px',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-quiet)',
          borderRadius: 8,
          marginBottom: 24,
          alignItems: 'flex-start',
        }}
      >
        <Icon
          d={ICONS.alert}
          size={16}
          style={{ color: 'var(--fg-muted)', flexShrink: 0, marginTop: 2 }}
        />
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
            What is this measurement
          </div>
          <div style={{ fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{description}</div>
        </div>
      </div>
      {observations?.length && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-quiet)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Your value</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((obs, i) => {
                const last = i === observations.length - 1;
                return (
                  <tr key={obs.id}>
                    <td
                      style={{
                        ...tdStyle,
                        borderBottom: last ? 0 : tdStyle.borderBottom,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        color: 'var(--fg-muted)',
                      }}
                    >
                      {formatDateTime(obs.effectiveDateTime)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        borderBottom: last ? 0 : tdStyle.borderBottom,
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                      }}
                    >
                      {formatObservationValue(obs)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        size="lg"
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--fg-primary)',
            }}
          >
            {title}
          </span>
        }
      >
        <Form onSubmit={addObservation}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'nowrap' }}>
              {chartDatasets.map((component) => (
                <div key={component.label} style={{ flex: 1 }}>
                  <NumberInput label={component.label} name={component.label} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Btn variant="primary" type="submit">
                Add
              </Btn>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
