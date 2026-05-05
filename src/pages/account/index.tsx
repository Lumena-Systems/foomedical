// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Outlet } from 'react-router';
import { SideMenu } from '../../components/SideMenu';

const sideMenu = {
  title: 'Account',
  menu: [
    { name: 'Profile', href: '/account/profile' },
    { name: 'Provider', href: '/account/provider' },
    { name: 'Membership & Billing', href: '/account/membership-and-billing' },
  ],
};

export function AccountPage(): JSX.Element {
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
        <SideMenu {...sideMenu} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Suspense fallback={<div style={{ color: 'var(--fg-muted)', fontSize: 14 }}>Loading…</div>}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
