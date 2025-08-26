// ESLint v9 flat config
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/frontend/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
    },
    plugins: { react },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
];

