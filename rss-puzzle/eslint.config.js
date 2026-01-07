import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  eslintPluginUnicorn.configs.recommended,

  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // 🔴 Mandatory
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off', //* switched off for now
      '@typescript-eslint/no-unsafe-call': 'off', //* switched off for now

      // 🟡 Good practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-magic-numbers': ['error', { 'ignore': [0, 1, 2, -1] }],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'max-lines-per-function': ['off', { max: 40, skipBlankLines: true }], //* switched off for now
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      }],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',

      'import-x/order': ['error', {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': 'error',
      'import-x/no-anonymous-default-export': 'error',
      'import-x/prefer-default-export': 'off',
      'import-x/no-default-export': 'error',

      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: {
            args: false,
            err: false,
            index: false,
            temp: false,
            params: false,
            props: false,
            ref: false,
            res: false,
          },
        },
      ],
      'unicorn/no-null': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-top-level-await': 'error',

      // 🎨 Styles
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'curly': ['error', 'all'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      // 'array-bracket-spacing': ['error', 'always'],
      'arrow-parens': ['error', 'always'],
      'max-len': ['warn', { code: 100, ignoreComments: true }],

      // 🔧 Switched off
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/filename-case': 'off',
      '@typescript-eslint/no-misused-promises': 'off', //* switched off for now
      '@typescript-eslint/restrict-template-expressions': 'off', //* switched off for now
      // '@typescript-eslint/no-inferrable-types': 'error',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.d.ts',
      'eslint.config.js'
    ],
  },
]);
