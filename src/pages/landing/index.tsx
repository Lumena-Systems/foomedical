// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { Footer } from '../../components/Footer';
import { Btn, Eyebrow } from '../../lumena/primitives';
import { Header } from './Header';

const features = [
  {
    eyebrow: 'Care plans',
    title: 'A plan written for one patient.',
    body: 'Your clinician drafts the plan; you can read every line. No black box, no scoring engine deciding for you.',
  },
  {
    eyebrow: 'Pricing',
    title: 'No hidden fees.',
    body: 'A single, published rate per visit. No surprise statements, no balance billing, no negotiation games.',
  },
  {
    eyebrow: 'Messaging',
    title: 'Reach a real person.',
    body: 'Send a message and get a written reply from a clinician on your team — usually the same day, always within 24 hours.',
  },
  {
    eyebrow: 'Standards',
    title: 'Clinically rigorous.',
    body: 'Every protocol is grounded in current evidence and reviewed quarterly. We tell you what we do not yet know.',
  },
];

export function LandingPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--fg-primary)', minHeight: '100vh' }}>
      <Header />
      <main>
        {/* Hero */}
        <section
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '120px 32px 96px',
          }}
        >
          <div style={{ maxWidth: 820 }}>
            <Eyebrow style={{ marginBottom: 32, color: 'var(--fg-muted)' }}>Lumena &middot; Primary care</Eyebrow>
            <h1
              className="lm-display"
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontSize: 'clamp(48px, 8vw, 84px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                margin: 0,
                color: 'var(--fg-primary)',
              }}
            >
              An ordinary <em style={{ fontStyle: 'italic' }}>doctor&rsquo;s office</em>,
              <br />
              run a little more carefully.
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 18,
                lineHeight: 1.55,
                color: 'var(--fg-secondary)',
                marginTop: 32,
                marginBottom: 0,
                maxWidth: 620,
              }}
            >
              This is a sample application built on Medplum &mdash; a working primary-care patient portal you can fork,
              read, and run yourself. No marketing varnish, no pretend testimonials.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
              <Btn variant="primary" size="lg" onClick={() => navigate('/register')?.catch(console.error)}>
                Create an account
              </Btn>
              <Btn variant="secondary" size="lg" onClick={() => navigate('/signin')?.catch(console.error)}>
                Sign in
              </Btn>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '0 32px',
          }}
        >
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid var(--border-quiet)',
              margin: 0,
            }}
          />
        </div>

        {/* What this is */}
        <section
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '96px 32px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 280px) minmax(0, 1fr)',
            gap: 64,
            alignItems: 'start',
          }}
        >
          <Eyebrow>What this is</Eyebrow>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontSize: 'clamp(28px, 4vw, 44px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                margin: 0,
                color: 'var(--fg-primary)',
                maxWidth: 720,
              }}
            >
              A reference implementation for developers building patient-facing care.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 17,
                lineHeight: 1.6,
                color: 'var(--fg-secondary)',
                marginTop: 28,
                marginBottom: 0,
                maxWidth: 640,
              }}
            >
              Lumena is open source. The code, the data shapes, and the integration patterns are all on GitHub. Use
              it to learn how a FHIR-backed portal is wired together, or as a starting point for your own clinic.
            </p>
          </div>
        </section>

        {/* Features grid */}
        <section
          style={{
            background: 'var(--bg-subtle)',
            borderTop: '1px solid var(--border-quiet)',
            borderBottom: '1px solid var(--border-quiet)',
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: '0 auto',
              padding: '96px 32px',
            }}
          >
            <Eyebrow style={{ marginBottom: 48 }}>How it works</Eyebrow>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 1,
                background: 'var(--border-quiet)',
                border: '1px solid var(--border-quiet)',
              }}
            >
              {features.map((f) => (
                <div
                  key={f.title}
                  style={{
                    background: 'var(--bg-card)',
                    padding: '40px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <Eyebrow>{f.eyebrow}</Eyebrow>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 500,
                      fontSize: 22,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.2,
                      margin: '8px 0 0',
                      color: 'var(--fg-primary)',
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: 'var(--fg-secondary)',
                      margin: 0,
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '120px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 28,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(32px, 5vw, 56px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              margin: 0,
              color: 'var(--fg-primary)',
              maxWidth: 720,
            }}
          >
            Ready to look around?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 17,
              lineHeight: 1.6,
              color: 'var(--fg-secondary)',
              margin: 0,
              maxWidth: 560,
            }}
          >
            Create a sample account &mdash; you can clear the data anytime, and nothing here is real medical care.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
            <Btn variant="primary" size="lg" onClick={() => navigate('/register')?.catch(console.error)}>
              Create an account
            </Btn>
            <Btn variant="ghost" size="lg" onClick={() => navigate('/signin')?.catch(console.error)}>
              Sign in
            </Btn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
