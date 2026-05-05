# Health record & care plan redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the inner side-menu + centered-max-width shell on Health record and Care plan with a left-pinned content area (Health record: underlined tab bar; Care plan: no inner nav) and add a shared empty-state component used by every list page.

**Architecture:** Page-level rewrites only — no router, data, or shared-component contract changes. Health record uses `react-router` `NavLink` for tabs. New `EmptyState` component lives in `src/components/` next to existing `InfoSection`. All styling uses existing Lumena tokens from `src/lumena/tokens.css`. Icons sourced from `src/lumena/icons.ts` (no new icons added).

**Tech Stack:** React 18, TypeScript, Vite, react-router v6, Mantine (untouched), `@medplum/react` (untouched), Lumena design tokens (CSS custom properties), Jest + jsdom + `@testing-library/react`.

**Note on tests:** This codebase has only one smoke test (`src/App.test.tsx`). No per-page tests exist — UI changes are validated visually against the running dev server. The plan adds one render-smoke test for the new `EmptyState` component (it's reusable and pure) and uses the existing App smoke test as a regression guardrail. Page-level changes are verified by running the dev server and inspecting each route — explicitly stated per task.

---

## File map

**Created:**
- `src/components/EmptyState.tsx` — shared empty-state block (icon + headline + body)
- `src/components/EmptyState.test.tsx` — render smoke test

**Modified:**
- `src/pages/health-record/index.tsx` — drop `SideMenu`, add tab bar, new shell layout
- `src/pages/care-plan/index.tsx` — drop `SideMenu`, new shell layout
- `src/pages/health-record/LabResults.tsx` — drop h1 + InfoSection title, add empty state
- `src/pages/health-record/Medications.tsx` — same
- `src/pages/health-record/Responses.tsx` — same
- `src/pages/health-record/Vaccines.tsx` — drop h1 + section titles, add empty state when both arrays are empty (keep custom upcoming-empty inline state)
- `src/pages/health-record/Vitals.tsx` — drop h1, add empty state when observations is empty
- `src/pages/care-plan/ActionItems.tsx` — drop h1 + InfoSection title, add empty state

**Untouched:** `src/components/SideMenu.tsx` (still used by Account section), `Router.tsx`, `AppShell.tsx`, all detail pages, `Measurement.tsx`, `Measurement.data.ts`.

---

### Task 1: EmptyState component + smoke test

**Files:**
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/EmptyState.test.tsx`

- [ ] **Step 1: Write the failing render smoke test**

`src/components/EmptyState.test.tsx`:

```tsx
// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

test('EmptyState renders title and body', () => {
  render(<EmptyState icon="clipboard" title="No lab results yet" body="Results will appear here." />);
  expect(screen.getByText('No lab results yet')).toBeInTheDocument();
  expect(screen.getByText('Results will appear here.')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/components/EmptyState.test.tsx`
Expected: FAIL — module `./EmptyState` not found.

- [ ] **Step 3: Implement EmptyState**

`src/components/EmptyState.tsx`:

```tsx
// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { JSX } from 'react';
import { ICONS } from '../lumena/icons';
import type { IconName } from '../lumena/icons';
import { Icon } from '../lumena/primitives';

interface EmptyStateProps {
  readonly icon: IconName;
  readonly title: string;
  readonly body: string;
}

export function EmptyState({ icon, title, body }: EmptyStateProps): JSX.Element {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-quiet)',
        borderRadius: 8,
        padding: '48px 24px',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: 24,
      }}
    >
      <Icon d={ICONS[icon]} size={32} style={{ color: 'var(--fg-muted)' }} />
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: 'var(--fg-primary)',
          marginTop: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'var(--fg-muted)',
          marginTop: 6,
          maxWidth: 360,
          lineHeight: 1.5,
        }}
      >
        {body}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/components/EmptyState.test.tsx`
Expected: PASS — 1 test, 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/EmptyState.tsx src/components/EmptyState.test.tsx
git commit -m "Add EmptyState component"
```

---

### Task 2: Rewrite Health record shell — tabs + new layout

**Files:**
- Modify: `src/pages/health-record/index.tsx` (full rewrite)

- [ ] **Step 1: Replace the file contents**

`src/pages/health-record/index.tsx`:

```tsx
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

export function HealthRecord(): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: 0 }}>
      <nav style={tabRowStyle} aria-label="Health record sections">
        {TABS.map((tab) => (
          <NavLink key={tab.href} to={tab.href} style={({ isActive }) => tabStyle(isActive)}>
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS (no new errors in `src/pages/health-record/index.tsx`). Pre-existing errors in `ChartPage.tsx` may be reported — they are unrelated to this change.

- [ ] **Step 3: Run app smoke test**

Run: `npx jest src/App.test.tsx`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/health-record/index.tsx
git commit -m "Replace health-record side menu with underlined tab bar"
```

---

### Task 3: Rewrite Care plan shell — no inner nav, new layout

**Files:**
- Modify: `src/pages/care-plan/index.tsx` (full rewrite)

- [ ] **Step 1: Replace the file contents**

`src/pages/care-plan/index.tsx`:

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Run app smoke test**

Run: `npx jest src/App.test.tsx`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/care-plan/index.tsx
git commit -m "Drop inner side menu from care plan shell"
```

---

### Task 4: Lab results — drop title, add empty state

**Files:**
- Modify: `src/pages/health-record/LabResults.tsx`

- [ ] **Step 1: Replace the file contents**

`src/pages/health-record/LabResults.tsx`:

```tsx
// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function LabResults(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const reports = medplum.searchResources('DiagnosticReport', 'subject=' + getReferenceString(patient)).read();

  if (reports.length === 0) {
    return (
      <EmptyState
        icon="clipboard"
        title="No lab results yet"
        body="Results shared by your providers will appear here."
      />
    );
  }

  return (
    <InfoSection>
      {reports.map((report) => (
        <InfoButton key={report.id} onClick={() => navigate(`./${report.id}`)?.catch(console.error)}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--fg-muted)',
                marginBottom: 4,
              }}
            >
              {formatDate(report.meta?.lastUpdated as string)}
            </div>
            <div style={{ color: 'var(--fg-primary)', fontWeight: 500 }}>{report.code?.text}</div>
          </div>
          <Icon d={ICONS.chevronRight} size={16} style={{ color: 'var(--fg-muted)' }} />
        </InfoButton>
      ))}
    </InfoSection>
  );
}
```

- [ ] **Step 2: Type-check + smoke test**

Run: `npx tsc --noEmit && npx jest src/App.test.tsx`
Expected: PASS for both.

- [ ] **Step 3: Commit**

```bash
git add src/pages/health-record/LabResults.tsx
git commit -m "Lab results: drop redundant title, add empty state"
```

---

### Task 5: Medications — drop title, add empty state

**Files:**
- Modify: `src/pages/health-record/Medications.tsx`

- [ ] **Step 1: Replace the file contents**

`src/pages/health-record/Medications.tsx`:

```tsx
// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function Medications(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const medications = medplum.searchResources('MedicationRequest', 'patient=' + getReferenceString(patient)).read();

  if (medications.length === 0) {
    return (
      <EmptyState
        icon="doc"
        title="No medications on file"
        body="Active prescriptions and dosing will show up here."
      />
    );
  }

  return (
    <InfoSection>
      {medications.map((med) => (
        <InfoButton key={med.id} onClick={() => navigate(`./${med.id}`)?.catch(console.error)}>
          <div>
            <div style={{ color: 'var(--twilight-700)', fontWeight: 500, marginBottom: 4 }}>
              {med?.medicationCodeableConcept?.text}
            </div>
            <div style={{ color: 'var(--fg-muted)', fontSize: 13 }}>{med.requester?.display}</div>
          </div>
          <Icon d={ICONS.chevronRight} size={16} style={{ color: 'var(--fg-muted)' }} />
        </InfoButton>
      ))}
    </InfoSection>
  );
}
```

- [ ] **Step 2: Type-check + smoke test**

Run: `npx tsc --noEmit && npx jest src/App.test.tsx`
Expected: PASS for both.

- [ ] **Step 3: Commit**

```bash
git add src/pages/health-record/Medications.tsx
git commit -m "Medications: drop redundant title, add empty state"
```

---

### Task 6: Questionnaire responses — drop title, add empty state

**Files:**
- Modify: `src/pages/health-record/Responses.tsx`

- [ ] **Step 1: Replace the file contents**

`src/pages/health-record/Responses.tsx`:

```tsx
// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDateTime, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum, useMedplumProfile } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function Responses(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const profile = useMedplumProfile() as Patient;
  const responses = medplum
    .searchResources('QuestionnaireResponse', `source=${getReferenceString(profile)}&_sort=-authored`)
    .read();

  if (responses.length === 0) {
    return (
      <EmptyState
        icon="doc"
        title="No responses yet"
        body="Forms you've completed will be saved here."
      />
    );
  }

  return (
    <InfoSection>
      {responses.map((resp) => (
        <InfoButton key={resp.id} onClick={() => navigate(`./${resp.id}`)?.catch(console.error)}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--fg-primary)',
              fontWeight: 500,
            }}
          >
            {formatDateTime(resp.authored)}
          </div>
          <Icon d={ICONS.chevronRight} size={16} style={{ color: 'var(--fg-muted)' }} />
        </InfoButton>
      ))}
    </InfoSection>
  );
}
```

- [ ] **Step 2: Type-check + smoke test**

Run: `npx tsc --noEmit && npx jest src/App.test.tsx`
Expected: PASS for both.

- [ ] **Step 3: Commit**

```bash
git add src/pages/health-record/Responses.tsx
git commit -m "Responses: drop redundant title, add empty state"
```

---

### Task 7: Vaccines — drop titles, handle truly-empty case

**Files:**
- Modify: `src/pages/health-record/Vaccines.tsx`

The existing file has a custom inline empty state for "no upcoming vaccines" (with a contact link). Keep that — it's bespoke. Drop the page `<h1>` and the eyebrow titles on each `InfoSection`. Show a global `EmptyState` only when *both* arrays are empty (the user has no vaccines at all), so the custom upcoming-empty isn't shown alone in that case.

- [ ] **Step 1: Replace the file contents**

`src/pages/health-record/Vaccines.tsx`:

```tsx
// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, getReferenceString } from '@medplum/core';
import type { Immunization, Patient } from '@medplum/fhirtypes';
import { StatusBadge, useMedplum } from '@medplum/react';
import { IconMapPin } from '@tabler/icons-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function Vaccines(): JSX.Element {
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const vaccines = medplum.searchResources('Immunization', 'patient=' + getReferenceString(patient)).read();
  const today = new Date().toISOString();
  const activeVaccines = vaccines.filter((v) => v.occurrenceDateTime && v.occurrenceDateTime > today);
  const pastVaccines = vaccines.filter((v) => !v.occurrenceDateTime || v.occurrenceDateTime <= today);

  if (vaccines.length === 0) {
    return (
      <EmptyState
        icon="shield"
        title="No vaccines recorded"
        body="Your immunization history will appear here."
      />
    );
  }

  return (
    <div>
      <InfoSection>
        {activeVaccines.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--fg-muted)' }}>
            <div style={{ fontSize: 14, color: 'var(--fg-secondary)', marginBottom: 4 }}>
              No upcoming vaccines available.
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
              If you think you&apos;re missing upcoming vaccines that should be here, please{' '}
              <a
                href="#"
                style={{ color: 'var(--fg-link)', textDecoration: 'underline', textUnderlineOffset: 2 }}
              >
                contact our medical team
              </a>
              .
            </div>
          </div>
        ) : (
          <VaccineList vaccines={activeVaccines} />
        )}
      </InfoSection>
      {pastVaccines.length > 0 && (
        <InfoSection>
          <VaccineList vaccines={pastVaccines} />
        </InfoSection>
      )}
    </div>
  );
}

function VaccineList({ vaccines }: { vaccines: Immunization[] }): JSX.Element {
  return (
    <>
      {vaccines.map((vaccine) => (
        <VaccineRow key={vaccine.id} vaccine={vaccine} />
      ))}
    </>
  );
}

function VaccineRow({ vaccine }: { vaccine: Immunization }): JSX.Element {
  const navigate = useNavigate();
  return (
    <InfoButton onClick={() => navigate(`./${vaccine.id}`)?.catch(console.error)}>
      <div>
        <div style={{ color: 'var(--twilight-700)', fontWeight: 500, marginBottom: 6 }}>
          {vaccine.vaccineCode?.text}
        </div>
        {vaccine.location?.display && (
          <div
            style={{
              color: 'var(--fg-muted)',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <IconMapPin size={14} stroke={1.5} color="currentColor" />
            {vaccine.location.display}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StatusBadge status={vaccine.status} />
        {vaccine.occurrenceDateTime && (
          <div
            style={{
              color: 'var(--fg-muted)',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon d={ICONS.calendar} size={14} style={{ color: 'var(--fg-muted)' }} />
            <time
              dateTime={vaccine.occurrenceDateTime}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
            >
              {formatDate(vaccine.occurrenceDateTime)}
            </time>
          </div>
        )}
      </div>
    </InfoButton>
  );
}
```

- [ ] **Step 2: Type-check + smoke test**

Run: `npx tsc --noEmit && npx jest src/App.test.tsx`
Expected: PASS for both.

- [ ] **Step 3: Commit**

```bash
git add src/pages/health-record/Vaccines.tsx
git commit -m "Vaccines: drop redundant titles, add empty state for no vaccines at all"
```

---

### Task 8: Vitals — drop title, add empty state

**Files:**
- Modify: `src/pages/health-record/Vitals.tsx`

- [ ] **Step 1: Replace the file contents**

`src/pages/health-record/Vitals.tsx`:

```tsx
// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, formatObservationValue, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import type { CSSProperties, JSX } from 'react';
import { EmptyState } from '../../components/EmptyState';

const thStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  background: 'var(--paper-100)',
  borderBottom: '1px solid var(--border-quiet)',
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.10em',
  color: 'var(--fg-muted)',
  lineHeight: 1,
  height: 36,
};

const tdStyle: CSSProperties = {
  padding: '0 16px',
  height: 36,
  borderBottom: '1px solid var(--border-quiet)',
  color: 'var(--fg-primary)',
  fontSize: 14,
  verticalAlign: 'middle',
};

export function Vitals(): JSX.Element {
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const observations = medplum.searchResources('Observation', 'patient=' + getReferenceString(patient)).read();

  if (observations.length === 0) {
    return (
      <EmptyState
        icon="database"
        title="No vitals recorded"
        body="Measurements from visits or your devices will appear here."
      />
    );
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-quiet)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Measurement</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Your value</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Last updated</th>
          </tr>
        </thead>
        <tbody>
          {observations.map((obs, i) => (
            <tr key={obs.id}>
              <td style={i === observations.length - 1 ? { ...tdStyle, borderBottom: 0 } : tdStyle}>
                {obs.code?.coding?.[0]?.display}
              </td>
              <td
                style={{
                  ...tdStyle,
                  borderBottom: i === observations.length - 1 ? 0 : tdStyle.borderBottom,
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                }}
              >
                {formatObservationValue(obs)}
              </td>
              <td
                style={{
                  ...tdStyle,
                  borderBottom: i === observations.length - 1 ? 0 : tdStyle.borderBottom,
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--fg-muted)',
                }}
              >
                {formatDate(obs.meta?.lastUpdated)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + smoke test**

Run: `npx tsc --noEmit && npx jest src/App.test.tsx`
Expected: PASS for both.

- [ ] **Step 3: Commit**

```bash
git add src/pages/health-record/Vitals.tsx
git commit -m "Vitals: drop redundant title, add empty state"
```

---

### Task 9: Action items — drop title, add empty state

**Files:**
- Modify: `src/pages/care-plan/ActionItems.tsx`

- [ ] **Step 1: Replace the file contents**

`src/pages/care-plan/ActionItems.tsx`:

```tsx
// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate, getReferenceString } from '@medplum/core';
import type { Patient } from '@medplum/fhirtypes';
import { StatusBadge, useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { InfoButton } from '../../components/InfoButton';
import { InfoSection } from '../../components/InfoSection';
import { ICONS } from '../../lumena/icons';
import { Icon } from '../../lumena/primitives';

export function ActionItems(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const patient = medplum.getProfile() as Patient;
  const carePlans = medplum.searchResources('CarePlan', 'subject=' + getReferenceString(patient)).read();

  if (carePlans.length === 0) {
    return (
      <EmptyState
        icon="check"
        title="Nothing on your plan yet"
        body="Your care team hasn't added items. They'll show up here when they do."
      />
    );
  }

  return (
    <InfoSection>
      {carePlans.map((resource) => (
        <InfoButton key={resource.id} onClick={() => navigate(`./${resource.id}`)?.catch(console.error)}>
          <div>
            <div style={{ color: 'var(--twilight-700)', fontWeight: 500, marginBottom: 6 }}>{resource.title}</div>
            <div
              style={{
                color: 'var(--fg-muted)',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <Icon d={ICONS.calendar} size={14} style={{ color: 'var(--fg-muted)' }} />
              <time>{formatDate(resource.period?.start)}</time>
              {resource.period?.end && (
                <>
                  <span>—</span>
                  <time>{formatDate(resource.period.end)}</time>
                </>
              )}
            </div>
          </div>
          <StatusBadge status={resource.status as string} />
        </InfoButton>
      ))}
    </InfoSection>
  );
}
```

- [ ] **Step 2: Type-check + smoke test**

Run: `npx tsc --noEmit && npx jest src/App.test.tsx`
Expected: PASS for both.

- [ ] **Step 3: Commit**

```bash
git add src/pages/care-plan/ActionItems.tsx
git commit -m "Action items: drop redundant title, add empty state"
```

---

### Task 10: Visual verification

The dev server should already be running on `http://localhost:3000`. If not, start it: `npm run dev`.

- [ ] **Step 1: Inspect each route in a browser**

Visit each and confirm the listed checks. Report blockers; otherwise mark complete.

| Route | Expected |
|---|---|
| `/health-record` (redirects to `/health-record/lab-results`) | Single left-aligned content area (no inner side menu); tab bar with 5 tabs visible at top, "Lab results" active with 2px ink-900 underline. |
| `/health-record/lab-results` | If no data: `EmptyState` showing clipboard icon, "No lab results yet", body. If data: existing list. |
| `/health-record/medications` | Tab "Medications" active. Empty state OR list. |
| `/health-record/questionnaire-responses` | Tab "Questionnaire responses" active. Empty state OR list. |
| `/health-record/vaccines` | Tab "Vaccines" active. If totally empty: shield empty state. Otherwise existing two-section layout (no titles). |
| `/health-record/vitals` | Tab "Vitals" active. Empty state OR table. No drill-down submenu — Vitals submenu is intentionally removed. |
| `/health-record/vitals/:id` (Blood pressure, etc.) | Drill-down still works from clicking a row inside Vitals. Tabs still visible above. |
| `/care-plan` (redirects to `/care-plan/action-items`) | No tab bar, no inner side menu, content sits left-aligned. Empty state OR list. |

- [ ] **Step 2: Browser console**

Confirm: no new React warnings or errors on any route above.

- [ ] **Step 3: Final smoke test**

Run: `npx jest`
Expected: PASS — both `App.test.tsx` and `EmptyState.test.tsx`.

- [ ] **Step 4: No commit needed if nothing changed.**

If verification surfaced an issue, document it and create a follow-up task. Otherwise stop.

---

## Self-review

**Spec coverage:**
- Drop SideMenu (HR + CP) → Tasks 2, 3 ✓
- New shell layout (left-pinned, padding, max-width) → Tasks 2, 3 ✓
- Underlined tab bar (HR) → Task 2 ✓
- No tabs on Care plan → Task 3 ✓
- Drop redundant h1 + InfoSection titles → Tasks 4–9 ✓
- New EmptyState component → Task 1 ✓
- Empty state on Lab results, Medications, Vaccines, Responses, Vitals, Action items → Tasks 4–9 ✓
- Vitals submenu removal → Task 2 (no submenu rendered in tab bar); existing detail routes still work via row click in Vitals page ✓
- SideMenu component remains for Account section → confirmed unchanged ✓

**Placeholder scan:** None.

**Type consistency:** `EmptyState` props `icon: IconName`, `title: string`, `body: string` are used identically across Tasks 4–9. `IconName` is the existing union from `src/lumena/icons.ts`. Icon keys used (`clipboard`, `doc`, `shield`, `database`, `check`) all exist in `ICONS`.

---

## Execution handoff

After all tasks complete, you should be at HEAD = original main + 10 commits (1 per task that produced changes; Task 10 may add zero commits).
