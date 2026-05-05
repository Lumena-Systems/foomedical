// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

test('EmptyState renders title and body', () => {
  render(<EmptyState icon="clipboard" title="No lab results yet" body="Results will appear here." />);
  expect(screen.getByText('No lab results yet')).toBeInTheDocument();
  expect(screen.getByText('Results will appear here.')).toBeInTheDocument();
});
