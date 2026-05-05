// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { CSSProperties, JSX } from 'react';
import { Eyebrow, LogoMark } from '../lumena/primitives';

const linkStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: 'var(--fg-secondary)',
  textDecoration: 'none',
  letterSpacing: '-0.005em',
  lineHeight: 1.6,
  transition: 'color 120ms cubic-bezier(0.2,0,0,1)',
};

type FooterLink = { label: string; href: string };

const columns: { eyebrow: string; links: FooterLink[] }[] = [
  {
    eyebrow: 'Get started',
    links: [
      { label: 'Tutorial', href: 'https://www.medplum.com/docs/tutorials/api-basics/create-fhir-data' },
      { label: 'Documentation', href: 'https://www.medplum.com/docs' },
    ],
  },
  {
    eyebrow: 'Project',
    links: [
      { label: 'Open source', href: 'https://github.com/medplum/foomedical' },
      { label: 'More tutorials', href: 'https://www.medplum.com/docs/tutorials' },
    ],
  },
  {
    eyebrow: 'Built on',
    links: [
      { label: 'Medplum', href: 'https://www.medplum.com' },
      { label: 'FHIR', href: 'https://www.hl7.org/fhir/' },
    ],
  },
  {
    eyebrow: 'Notice',
    links: [{ label: 'This is sample software, not a clinic.', href: 'https://github.com/medplum/foomedical' }],
  },
];

export function Footer(): JSX.Element {
  return (
    <footer
      style={{
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border-quiet)',
        color: 'var(--fg-primary)',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '64px 32px 40px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
          gap: 64,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--fg-primary)' }}>
            <LogoMark size={22} />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              Foo Medical
            </span>
          </span>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              margin: 0,
              maxWidth: 280,
            }}
          >
            A sample patient portal built on Medplum. Open source. Not a real medical practice.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 32,
          }}
        >
          {columns.map((col) => (
            <div key={col.eyebrow} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Eyebrow>{col.eyebrow}</Eyebrow>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={linkStyle}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg-link-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-secondary)')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-quiet)' }}>
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '20px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              color: 'var(--fg-muted)',
            }}
          >
            &copy; {new Date().getFullYear()} Foo Medical, Inc. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--fg-muted)',
              letterSpacing: '0.02em',
            }}
          >
            v sample
          </span>
        </div>
      </div>
    </footer>
  );
}
