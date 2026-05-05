// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { MedplumClient } from '@medplum/core';
import { MedplumProvider } from '@medplum/react';
import '@medplum/react/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import './lumena/tokens.css';
import './lumena/mantine-overrides.css';

const medplum = new MedplumClient({
  // To run Lumena locally, you can set the baseURL in this constructor
  // baseUrl: http://localhost:8103
  onUnauthenticated: () => (window.location.href = '/'),
});

// Map Mantine onto Lumena tokens — cream paper background, deep ink text,
// twilight slate-teal as primary, Inter Tight body / Newsreader display.
const theme = createTheme({
  fontFamily: 'var(--font-sans)',
  fontFamilyMonospace: 'var(--font-mono)',
  headings: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
  },
  defaultRadius: 'sm',
  radius: { xs: '2px', sm: '4px', md: '8px', lg: '12px', xl: '16px' },
  white: 'var(--paper-0)',
  black: 'var(--ink-900)',
  primaryColor: 'twilight',
  primaryShade: 6,
  colors: {
    twilight: [
      'oklch(0.970 0.014 215)',
      'oklch(0.940 0.028 215)',
      'oklch(0.890 0.045 215)',
      'oklch(0.820 0.062 215)',
      'oklch(0.700 0.072 215)',
      'oklch(0.560 0.078 215)',
      'oklch(0.460 0.072 215)',
      'oklch(0.360 0.060 215)',
      'oklch(0.260 0.044 215)',
      'oklch(0.180 0.032 215)',
    ],
    paper: [
      'oklch(1     0     0)',
      'oklch(0.992 0.004 85)',
      'oklch(0.982 0.006 85)',
      'oklch(0.970 0.008 85)',
      'oklch(0.952 0.010 85)',
      'oklch(0.920 0.010 85)',
      'oklch(0.860 0.012 85)',
      'oklch(0.740 0.014 85)',
      'oklch(0.560 0.014 250)',
      'oklch(0.420 0.016 250)',
    ],
    ink: [
      'oklch(0.992 0.004 85)',
      'oklch(0.952 0.010 85)',
      'oklch(0.860 0.012 85)',
      'oklch(0.740 0.014 85)',
      'oklch(0.560 0.014 250)',
      'oklch(0.420 0.016 250)',
      'oklch(0.290 0.020 250)',
      'oklch(0.190 0.024 250)',
      'oklch(0.130 0.028 250)',
      'oklch(0.060 0.020 250)',
    ],
  },
  fontSizes: {
    xs: '11px',
    sm: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
  },
  components: {
    Container: { defaultProps: { size: 1200 } },
    Button: { defaultProps: { radius: 'sm' } },
    Paper: { defaultProps: { shadow: undefined, radius: 'sm', withBorder: true } },
    Card: { defaultProps: { shadow: undefined, radius: 'sm', withBorder: true } },
    Modal: { defaultProps: { radius: 'md', centered: true, overlayProps: { backgroundOpacity: 0.45 } } },
    Drawer: { defaultProps: { radius: 'md' } },
    TextInput: { defaultProps: { radius: 'sm' } },
    NativeSelect: { defaultProps: { radius: 'sm' } },
    NumberInput: { defaultProps: { radius: 'sm' } },
    PasswordInput: { defaultProps: { radius: 'sm' } },
    Textarea: { defaultProps: { radius: 'sm' } },
    Select: { defaultProps: { radius: 'sm' } },
    Loader: { defaultProps: { color: 'twilight.5', size: 'sm', type: 'dots' } },
    Badge: { defaultProps: { radius: 'xl', variant: 'light' } },
  },
});

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <MedplumProvider medplum={medplum}>
        <MantineProvider theme={theme}>
          <Notifications />
          <App />
        </MantineProvider>
      </MedplumProvider>
    </BrowserRouter>
  </StrictMode>
);
