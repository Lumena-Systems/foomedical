// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatHumanName } from '@medplum/core';
import type { Patient, Practitioner } from '@medplum/fhirtypes';
import { useMedplumProfile } from '@medplum/react';
import type { JSX, ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { Avatar, Icon, LogoMark } from './primitives';
import { ICONS  } from './icons';
import type {IconName} from './icons';

type NavItem = { id: string; label: string; href: string; icon: IconName };

const NAV: readonly NavItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: 'inbox' },
  { id: 'health-record', label: 'Health record', href: '/health-record', icon: 'clipboard' },
  { id: 'care-plan', label: 'Care plan', href: '/care-plan', icon: 'shield' },
  { id: 'messages', label: 'Messages', href: '/Communication', icon: 'doc' },
  { id: 'get-care', label: 'Get care', href: '/get-care', icon: 'calendar' },
  { id: 'account', label: 'Account', href: '/account', icon: 'user' },
];

const ROUTE_TITLES: readonly { match: RegExp; title: string; subtitle?: string }[] = [
  { match: /^\/$/, title: 'Home' },
  { match: /^\/health-record\/lab-results/, title: 'Health record', subtitle: 'Lab results' },
  { match: /^\/health-record\/medications/, title: 'Health record', subtitle: 'Medications' },
  { match: /^\/health-record\/questionnaire-responses/, title: 'Health record', subtitle: 'Questionnaire responses' },
  { match: /^\/health-record\/vaccines/, title: 'Health record', subtitle: 'Vaccines' },
  { match: /^\/health-record\/vitals/, title: 'Health record', subtitle: 'Vitals' },
  { match: /^\/health-record/, title: 'Health record' },
  { match: /^\/care-plan\/action-items/, title: 'Care plan', subtitle: 'Action items' },
  { match: /^\/care-plan/, title: 'Care plan' },
  { match: /^\/Communication/, title: 'Messages' },
  { match: /^\/get-care/, title: 'Get care' },
  { match: /^\/account\/profile/, title: 'Account', subtitle: 'Profile' },
  { match: /^\/account\/provider/, title: 'Account', subtitle: 'Provider' },
  { match: /^\/account\/membership-and-billing/, title: 'Account', subtitle: 'Membership & billing' },
  { match: /^\/account/, title: 'Account' },
  { match: /^\/Questionnaire/, title: 'Questionnaire' },
  { match: /^\/screening-questionnaire/, title: 'Screening questionnaire' },
  { match: /^\/patient-intake-questionnaire/, title: 'Patient intake' },
  { match: /^\/Observation/, title: 'Observation' },
];

function deriveTitle(pathname: string): { title: string; subtitle?: string } {
  for (const entry of ROUTE_TITLES) {
    if (entry.match.test(pathname)) {
      return { title: entry.title, subtitle: entry.subtitle };
    }
  }
  return { title: 'Lumena' };
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === '/') {return pathname === '/';}
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: ReactNode }): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useMedplumProfile() as Patient | Practitioner | undefined;
  const profileName = profile?.name?.[0] ? formatHumanName(profile.name[0]) : 'Account';
  const initials = profile?.name?.[0]
    ? `${profile.name[0].given?.[0]?.[0] ?? ''}${profile.name[0].family?.[0] ?? ''}`.toUpperCase() || 'AC'
    : 'AC';
  const { title, subtitle } = deriveTitle(location.pathname);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'var(--bg-base)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <aside
        style={{
          width: 248,
          borderRight: '1px solid var(--border-quiet)',
          background: 'var(--paper-100)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <NavLink
          to="/"
          style={{
            height: 52,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: '1px solid var(--border-quiet)',
            color: 'var(--ink-900)',
            textDecoration: 'none',
          }}
        >
          <LogoMark size={20} />
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Lumena
          </span>
        </NavLink>
        <div style={{ padding: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              border: '1px solid var(--border-quiet)',
              borderRadius: 4,
              background: 'var(--paper-0)',
              cursor: 'pointer',
              fontSize: 13,
              color: 'var(--fg-muted)',
            }}
          >
            <Icon d={ICONS.search} size={14} />
            <span style={{ flex: 1 }}>Search</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                padding: '1px 6px',
                background: 'var(--paper-200)',
                borderRadius: 3,
              }}
            >
              ⌘K
            </span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((it) => {
            const active = isNavActive(location.pathname, it.href);
            return (
              <NavLink
                key={it.id}
                to={it.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  color: active ? 'var(--ink-900)' : 'var(--fg-secondary)',
                  background: active ? 'var(--paper-0)' : 'transparent',
                  border: active ? '1px solid var(--border-quiet)' : '1px solid transparent',
                  textDecoration: 'none',
                }}
              >
                <Icon d={ICONS[it.icon]} size={16} />
                {it.label}
              </NavLink>
            );
          })}
        </nav>
        <button
          onClick={() => navigate('/account/profile')}
          style={{
            padding: 12,
            borderTop: '1px solid var(--border-quiet)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'transparent',
            border: 0,
            borderRadius: 0,
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <Avatar initials={initials} size={28} tone="ink" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'var(--ink-900)',
              }}
            >
              {profileName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Lumena · Patient</div>
          </div>
          <Icon d={ICONS.settings} size={16} style={{ color: 'var(--fg-muted)' }} />
        </button>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            height: 52,
            borderBottom: '1px solid var(--border-quiet)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'var(--paper-50)',
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--ink-900)',
              }}
            >
              {title}
            </div>
            {subtitle && <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{subtitle}</div>}
          </div>
          <button
            onClick={() => navigate('/signout')}
            style={{
              fontSize: 12,
              color: 'var(--fg-muted)',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              padding: '6px 10px',
            }}
          >
            Sign out
          </button>
        </header>
        <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}
