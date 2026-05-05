// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { ErrorBoundary, useMedplum } from '@medplum/react';
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Loading } from './components/Loading';
import { AppShell } from './lumena/AppShell';
import { RegisterPage } from './pages/RegisterPage';
import { Router } from './Router';
import { SignInPage } from './pages/SignInPage';
import { LandingPage } from './pages/landing';

export function App(): JSX.Element | null {
  const medplum = useMedplum();

  if (medplum.isLoading()) {
    return null;
  }

  if (!medplum.getProfile()) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    );
  }

  return (
    <AppShell>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Router />
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
