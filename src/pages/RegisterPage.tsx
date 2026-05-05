// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { RegisterForm } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { LogoMark } from '../lumena/primitives';
import { MEDPLUM_GOOGLE_CLIENT_ID, MEDPLUM_PROJECT_ID, MEDPLUM_RECAPTCHA_SITE_KEY } from '../config';

export function RegisterPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        color: 'var(--fg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 24px 96px',
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
          gap: 10,
          color: 'var(--fg-primary)',
          marginBottom: 64,
        }}
        aria-label="Foo Medical home"
      >
        <LogoMark size={28} />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          Foo Medical
        </span>
      </button>

      <div
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <RegisterForm
          type="patient"
          projectId={MEDPLUM_PROJECT_ID}
          googleClientId={MEDPLUM_GOOGLE_CLIENT_ID}
          recaptchaSiteKey={MEDPLUM_RECAPTCHA_SITE_KEY}
          onSuccess={() => navigate('/')?.catch(console.error)}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 32,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 24px',
              color: 'var(--fg-primary)',
              textAlign: 'center',
            }}
          >
            Register with Foo Medical
          </h2>
        </RegisterForm>
      </div>
    </div>
  );
}
