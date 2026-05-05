// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { formatDate } from '@medplum/core';
import type { QuestionnaireResponseItem, QuestionnaireResponseItemAnswer } from '@medplum/fhirtypes';
import { CodeableConceptDisplay, QuantityDisplay, RangeDisplay, useMedplum } from '@medplum/react';
import type { JSX } from 'react';
import { useParams } from 'react-router';

export function Response(): JSX.Element {
  const medplum = useMedplum();
  const { responseId } = useParams();
  const questionnaireResponse = medplum.searchOne('QuestionnaireResponse', `_id=${responseId}`).read();

  const items = questionnaireResponse?.item || [];

  return (
    <div style={{ maxWidth: 800 }}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-quiet)',
          borderRadius: 8,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {items.map((item) => (
          <ItemDisplay key={item.id} item={item} depth={0} />
        ))}
      </div>
    </div>
  );
}

interface ItemDisplayProps {
  item: QuestionnaireResponseItem;
  depth: number;
}

const HEADING_FONT_SIZES = [16, 14, 13];

function ItemDisplay({ item, depth }: ItemDisplayProps): JSX.Element {
  const { text: title, answer, item: nestedAnswers } = item;
  const headingFontSize = HEADING_FONT_SIZES[Math.min(depth, HEADING_FONT_SIZES.length - 1)];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: headingFontSize,
          fontWeight: 600,
          color: 'var(--fg-primary)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} key={item.linkId}>
        {answer && answer.length > 0 ? (
          <AnswerDisplay key={answer[0].id} answer={answer[0]} />
        ) : (
          nestedAnswers?.map((nestedAnswer) => (
            <ItemDisplay key={nestedAnswer.id} item={nestedAnswer} depth={depth + 1} />
          ))
        )}
      </div>
    </div>
  );
}

interface AnswerDisplayProps {
  answer: QuestionnaireResponseItemAnswer;
}

function AnswerDisplay({ answer }: AnswerDisplayProps): JSX.Element {
  if (!answer) {
    throw new Error('No answer');
  }
  const [[key, value]] = Object.entries(answer);
  const valueStyle = { color: 'var(--fg-secondary)', fontSize: 14, margin: 0 };

  switch (key) {
    case 'valueInteger':
      return (
        <p style={{ ...valueStyle, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </p>
      );
    case 'valueQuantity':
      return (
        <span style={{ ...valueStyle, fontFamily: 'var(--font-mono)' }}>
          <QuantityDisplay value={value} />
        </span>
      );
    case 'valueString':
      return <p style={valueStyle}>{value}</p>;
    case 'valueCoding':
      return (
        <span style={valueStyle}>
          <CodeableConceptDisplay value={{ coding: [value] }} />
        </span>
      );
    case 'valueRange':
      return (
        <span style={{ ...valueStyle, fontFamily: 'var(--font-mono)' }}>
          <RangeDisplay value={value} />
        </span>
      );
    case 'valueDateTime':
      return <p style={{ ...valueStyle, fontFamily: 'var(--font-mono)' }}>{formatDate(value)}</p>;
    case 'valueBoolean':
      return <p style={valueStyle}>{value ? 'True' : 'False'}</p>;
    default:
      return <p style={valueStyle}>{value.toString()}</p>;
  }
}
