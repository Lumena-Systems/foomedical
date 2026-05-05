// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { JSX } from 'react';
import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Loading } from '../../components/Loading';

export function CarePlanPage(): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: 0 }}>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
