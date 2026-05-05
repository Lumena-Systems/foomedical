// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Outlet } from 'react-router';
import { Loading } from '../../components/Loading';
import { SideMenu } from '../../components/SideMenu';
import { measurementsMeta } from './Measurement.data';

const sideMenu = {
  title: 'Health record',
  menu: [
    { name: 'Lab results', href: '/health-record/lab-results' },
    { name: 'Medications', href: '/health-record/medications' },
    { name: 'Questionnaire responses', href: '/health-record/questionnaire-responses' },
    { name: 'Vaccines', href: '/health-record/vaccines' },
    {
      name: 'Vitals',
      href: '/health-record/vitals',
      subMenu: Object.values(measurementsMeta).map(({ title, id }) => ({
        name: title,
        href: `/health-record/vitals/${id}`,
      })),
    },
  ],
};

export function HealthRecord(): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        maxWidth: 1200,
        margin: '0 auto',
        padding: 24,
        alignItems: 'flex-start',
      }}
    >
      <SideMenu {...sideMenu} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
