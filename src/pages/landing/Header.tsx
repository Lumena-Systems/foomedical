// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { CSSProperties, JSX } from 'react';
import { useNavigate } from 'react-router';
import { Btn, LogoMark } from '../../lumena/primitives';

const navLinkStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--fg-secondary)',
  textDecoration: 'none',
  letterSpacing: '-0.005em',
  padding: '6px 4px',
  transition: 'color 120ms cubic-bezier(0.2,0,0,1)',
};

function BrandLockup(): JSX.Element {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--fg-primary)' }}>
      <LogoMark size={24} />
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        Lumena
      </span>
    </span>
  );
}

export function Header(): JSX.Element {
  const navigate = useNavigate();
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-quiet)',
      }}
    >
      <div
        style={{
          height: 64,
          maxWidth: 1120,
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/')?.catch(console.error)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          aria-label="Lumena home"
        >
          <BrandLockup />
        </button>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} aria-label="Primary">
          <a
            href="https://github.com/Lumena-Systems/foomedical"
            target="_blank"
            rel="noreferrer"
            style={navLinkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-secondary)')}
          >
            Source
          </a>
          <a
            href="https://www.medplum.com/docs"
            target="_blank"
            rel="noreferrer"
            style={navLinkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-secondary)')}
          >
            Docs
          </a>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="secondary" size="sm" onClick={() => navigate('/signin')?.catch(console.error)}>
              Log in
            </Btn>
            <Btn variant="primary" size="sm" onClick={() => navigate('/register')?.catch(console.error)}>
              Sign up
            </Btn>
          </div>
        </nav>
      </div>
    </header>
  );
}
