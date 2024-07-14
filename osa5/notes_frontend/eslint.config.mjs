import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import babelParser from '@babel/eslint-parser';
import vitestGlobals from 'eslint-plugin-vitest-globals';

export default [
  {
    files: ['**/*.{js}'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...js.configs.recommended.globals,
        ...vitestGlobals.environments.env.globals,
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        fetch: 'readonly'
      },
      ecmaVersion: 'latest',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },
    settings: {
      react: { version: '18.2' },
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",      
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 'off',
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'vitest-globals': vitestGlobals,
    },
  },
  js.configs.recommended,
  {
    ignores: ['node_modules', 'dist', 'vite.config.js', '.eslintrc.js'],
  },
];
