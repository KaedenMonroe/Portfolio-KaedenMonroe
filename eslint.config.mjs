import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';

export default defineConfig(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'public/**',
      '.agents/**',
      '.claude/**',
      '.netlify/**',
      'Portfolio brainstorm for mechanical engineer/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.strict,
  ...astro.configs.recommended,

  {
    files: ['**/*.{ts,astro}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  prettier
);
