// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { DiagnosticReport } from '@medplum/fhirtypes';
import { DiagnosticReportDisplay, useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useParams } from 'react-router';
import { InfoSection } from '../../components/InfoSection';

export function LabResult(): JSX.Element {
  const medplum = useMedplum();
  const { resultId = '' } = useParams();
  const resource: DiagnosticReport = medplum.readResource('DiagnosticReport', resultId).read();

  return (
    <div style={{ maxWidth: 800 }}>
      <InfoSection>
        <DiagnosticReportDisplay value={resource} />
      </InfoSection>
    </div>
  );
}
