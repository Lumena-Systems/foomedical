// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from 'eslint/config';
import { medplumEslintConfig } from '@medplum/eslint-config';

export default defineConfig([
  { ignores: ['dist', 'node_modules', 'coverage', 'eslint.config.js'] },
  ...medplumEslintConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // tsc is the source of truth for TS path resolution; eslint-plugin-import
      // here only has the node resolver, which can't follow .tsx without a
      // TypeScript resolver. Disable to avoid false positives — broken imports
      // would already fail `tsc --noEmit`.
      'import/no-unresolved': 'off',
    },
  },
]);
