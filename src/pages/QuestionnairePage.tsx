// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { showNotification } from '@mantine/notifications';
import { normalizeErrorString } from '@medplum/core';
import type { Questionnaire, QuestionnaireResponse } from '@medplum/fhirtypes';
import { Document, QuestionnaireForm, useMedplum, useResource } from '@medplum/react';
import { IconCircleCheck, IconCircleOff } from '@tabler/icons-react';
import { useCallback } from 'react';
import type { JSX } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loading } from '../components/Loading';

export function QuestionnairePage(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const { questionnaireId } = useParams();

  const questionnaire = useResource<Questionnaire>({ reference: `Questionnaire/${questionnaireId}` });

  const handleOnSubmit = useCallback(
    (response: QuestionnaireResponse) => {
      if (!questionnaire) {
        return;
      }

      medplum
        .createResource(response)
        .then(() => {
          showNotification({
            icon: <IconCircleCheck />,
            title: 'Success',
            message: 'Answers recorded',
          });
          navigate('/health-record/questionnaire-responses/')?.catch(console.error);
          window.scrollTo(0, 0);
        })
        .catch((err) => {
          showNotification({
            color: 'red',
            icon: <IconCircleOff />,
            title: 'Error',
            message: normalizeErrorString(err),
          });
        });
    },
    [medplum, navigate, questionnaire]
  );

  if (!questionnaire) {
    return <Loading />;
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--fg-primary)',
          margin: '0 0 24px',
        }}
      >
        {questionnaire.title || 'Questionnaire'}
      </h1>
      <Document width={800}>
        <QuestionnaireForm questionnaire={questionnaire} onSubmit={handleOnSubmit} />
      </Document>
    </div>
  );
}
