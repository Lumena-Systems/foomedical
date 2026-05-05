// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatHumanName } from '@medplum/core';
import type { Patient, Practitioner } from '@medplum/fhirtypes';
import { useMedplumProfile } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import HealthRecordImage from '../img/homePage/health-record.svg';
import PharmacyImage from '../img/homePage/pharmacy.svg';
import PillImage from '../img/homePage/pill.svg';
import { Btn, Card, Eyebrow, Pill } from '../lumena/primitives';
import classes from './HomePage.module.css';

const carouselItems = [
  {
    eyebrow: 'Screening',
    title: 'Welcome to Foo Medical',
    description:
      'A short intake that helps us understand your needs and tailor care to you.',
    url: '/screening-questionnaire',
    label: 'Start AHC HRSN screening',
  },
  {
    eyebrow: 'Intake',
    title: 'Patient intake questionnaire',
    description:
      'Share your medical history, medications, and contacts so your care team has the full picture.',
    url: '/patient-intake-questionnaire',
    label: 'Start form',
  },
  {
    eyebrow: 'Provider',
    title: 'Select a doctor',
    description:
      'Choose a primary care provider. A consistent relationship leads to better care over time.',
    url: '/account/provider/choose-a-primary-care-povider',
    label: 'Choose a primary care provider',
  },
  {
    eyebrow: 'Account',
    title: 'Emergency contact',
    description:
      'Add someone we can reach out to in case of urgent matters.',
    url: '/account',
    label: 'Add emergency contact',
  },
];

const linkPages = [
  {
    img: HealthRecordImage,
    title: 'Health record',
    description: 'Labs, vitals, vaccines, and prior visits.',
    href: '/health-record',
  },
  {
    img: PillImage,
    title: 'Request prescription renewal',
    description: 'Send a renewal request to your provider.',
    href: '/health-record/medications',
  },
  {
    img: PharmacyImage,
    title: 'Preferred pharmacy',
    description: 'Walgreens D2866 · 1363 Divisadero St',
    href: '#',
  },
];

const recommendations = [
  {
    title: 'Get travel health recommendations',
    description: 'Find out what vaccines and meds you need for your trip.',
  },
  {
    title: 'Get FSA/HSA reimbursement',
    description: 'Request a prescription for over-the-counter items.',
  },
  {
    title: 'Request health record',
    description: 'Get records sent to or from Foo Medical.',
  },
];

const HEADING_DISPLAY = {
  fontFamily: 'var(--font-serif)',
  fontSize: 40,
  fontWeight: 500,
  letterSpacing: '-0.02em',
  color: 'var(--fg-primary)',
  lineHeight: 1.1,
  margin: 0,
} as const;

const SUB_HEAD = {
  fontFamily: 'var(--font-sans)',
  fontSize: 16,
  color: 'var(--fg-secondary)',
  margin: '12px 0 0',
  lineHeight: 1.5,
  maxWidth: 540,
} as const;

const SECTION_TITLE = {
  fontFamily: 'var(--font-sans)',
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: 'var(--fg-primary)',
  margin: '0 0 16px',
} as const;

const CARD_TITLE = {
  fontFamily: 'var(--font-sans)',
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: 'var(--fg-primary)',
  margin: '12px 0 6px',
} as const;

const CARD_DESCRIPTION = {
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  color: 'var(--fg-secondary)',
  lineHeight: 1.5,
  margin: 0,
} as const;

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const profile = useMedplumProfile() as Patient | Practitioner;
  const profileName = profile.name ? formatHumanName(profile.name[0]) : '';
  const firstName = profile.name?.[0]?.given?.[0] ?? profileName;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100%' }}>
      <div className={classes.announcements}>
        <span>
          Announcements go here. <a href="#">Include links if needed.</a>
        </span>
      </div>

      {/* Hero — calm warm-paper greeting, no photo, no gradient */}
      <section
        style={{
          padding: '56px 24px 40px',
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <h1 style={HEADING_DISPLAY}>
          Hi <span style={{ color: 'var(--twilight-600)' }}>{firstName}</span>,<br />
          we are here to help.
        </h1>
        <p style={SUB_HEAD}>Book a visit, message your care team, or pick up a task that needs your attention.</p>
        <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Btn variant="primary" size="lg" onClick={() => navigate('/get-care')?.catch(console.error)}>
            Get care
          </Btn>
          <Btn variant="secondary" size="lg" onClick={() => navigate('/Communication')?.catch(console.error)}>
            Send message
          </Btn>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px', display: 'grid', gap: 40 }}>
        {/* Tasks / get-started carousel — flat cards */}
        <section>
          <h2 style={SECTION_TITLE}>Things to do</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {carouselItems.map((item, index) => (
              <Card key={`task-${index}`}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
                  <Eyebrow>{item.eyebrow}</Eyebrow>
                  <div style={{ flex: 1 }}>
                    <h3 style={CARD_TITLE}>{item.title}</h3>
                    <p style={CARD_DESCRIPTION}>{item.description}</p>
                  </div>
                  <div>
                    <Btn variant="secondary" size="sm" onClick={() => navigate(item.url)?.catch(console.error)}>
                      {item.label}
                    </Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Single feature card */}
        <section>
          <Card padding={24}>
            <Eyebrow>Wellness</Eyebrow>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--fg-primary)',
                margin: '12px 0 8px',
              }}
            >
              Better rest, better health
            </h3>
            <p style={{ ...CARD_DESCRIPTION, fontSize: 14, maxWidth: 640 }}>
              Sleep is foundational. Track patterns, talk through habits with your provider, and invite a friend to join
              you on the path.
            </p>
            <div style={{ marginTop: 16 }}>
              <Btn variant="primary" size="md">
                Invite friends
              </Btn>
            </div>
          </Card>
        </section>

        {/* Now-available banner — replaces image+overlay block */}
        <section>
          <Card padding={24}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
              <div>
                <Pill tone="success">Now available</Pill>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--fg-primary)',
                  margin: 0,
                }}
              >
                Same-day virtual visits
              </h3>
              <p style={{ ...CARD_DESCRIPTION, fontSize: 14 }}>
                Connect with a provider on the same day for non-urgent concerns. Most visits are covered by your plan.
              </p>
              <div>
                <Btn variant="primary" size="md" onClick={() => navigate('/get-care')?.catch(console.error)}>
                  Book a visit
                </Btn>
              </div>
            </div>
          </Card>
        </section>

        {/* Quick links with small icons */}
        <section>
          <h2 style={SECTION_TITLE}>Quick links</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            {linkPages.map((item, index) => (
              <Card key={`link-${index}`} hoverable>
                <button
                  type="button"
                  onClick={() => {
                    if (item.href !== '#') {
                      navigate(item.href)?.catch(console.error);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    width: '100%',
                    background: 'transparent',
                    border: 0,
                    padding: 0,
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'inherit',
                  }}
                >
                  <img
                    src={item.img}
                    alt=""
                    width={48}
                    height={48}
                    style={{ flexShrink: 0, width: 48, height: 48, objectFit: 'contain' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--fg-primary)',
                        letterSpacing: '-0.005em',
                        marginBottom: 2,
                      }}
                    >
                      {item.title}
                    </div>
                    {item.description && (
                      <div
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 12,
                          color: 'var(--fg-muted)',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                  </div>
                </button>
              </Card>
            ))}
          </div>
        </section>

        {/* PCP + recommendations grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          <Card padding={24}>
            <Eyebrow>Care team</Eyebrow>
            <h3 style={CARD_TITLE}>Primary care provider</h3>
            <p style={{ ...CARD_DESCRIPTION, marginBottom: 16 }}>
              Having a consistent, trusted provider can lead to better health.
            </p>
            <Btn variant="primary" size="md" onClick={() => navigate('/account/provider')?.catch(console.error)}>
              Choose provider
            </Btn>
          </Card>
          <Card padding={24}>
            <Eyebrow>Recommended for you</Eyebrow>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recommendations.map((item, index) => (
                <div
                  key={`recommendation-${index}`}
                  style={{
                    paddingBottom: index < recommendations.length - 1 ? 16 : 0,
                    borderBottom:
                      index < recommendations.length - 1 ? '1px solid var(--border-quiet)' : 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--fg-primary)',
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={CARD_DESCRIPTION}>{item.description}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
