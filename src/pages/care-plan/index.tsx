// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Outlet } from 'react-router';
import { Loading } from '../../components/Loading';
import { SideMenu } from '../../components/SideMenu';

const sideMenu = {
  title: 'Care plan',
  menu: [{ name: 'Action items', href: '/care-plan/action-items' }],
};

export function CarePlanPage(): JSX.Element {
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
