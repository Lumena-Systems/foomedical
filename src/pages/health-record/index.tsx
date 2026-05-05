// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { CSSProperties, JSX } from 'react';
import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router';
import { Loading } from '../../components/Loading';

const TABS: readonly { label: string; href: string }[] = [
  { label: 'Lab results', href: '/health-record/lab-results' },
  { label: 'Medications', href: '/health-record/medications' },
  { label: 'Questionnaire responses', href: '/health-record/questionnaire-responses' },
  { label: 'Vaccines', href: '/health-record/vaccines' },
  { label: 'Vitals', href: '/health-record/vitals' },
];

const tabRowStyle: CSSProperties = {
  display: 'flex',
  gap: 24,
  borderBottom: '1px solid var(--border-quiet)',
  marginBottom: 24,
};

const tabStyle = (isActive: boolean): CSSProperties => ({
  fontSize: 13,
  fontWeight: isActive ? 500 : 400,
  color: isActive ? 'var(--ink-900)' : 'var(--fg-muted)',
  padding: '12px 0',
  marginBottom: -1,
  borderBottom: isActive ? '2px solid var(--ink-900)' : '2px solid transparent',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});

const HOVER_CSS = `
  .lumena-hr-tab:not(.active):hover { color: var(--fg-secondary); }
`;

export function HealthRecord(): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: 0 }}>
      <style>{HOVER_CSS}</style>
      <nav style={tabRowStyle} aria-label="Health record sections">
        {TABS.map((tab) => (
          <NavLink
            key={tab.href}
            to={tab.href}
            className={({ isActive }) => `lumena-hr-tab${isActive ? ' active' : ''}`}
            style={({ isActive }) => tabStyle(isActive)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
