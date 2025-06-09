import antfu from '@antfu/eslint-config';

export default antfu(
  {
    type: 'app',
    typescript: true,
    formatters: true,
    react: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: 'single',
    },
    ignores: ['**/migrations/*'],
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
      '**/*.json',
      '**/*.mjs',
    ],
    rules: {
      'ts/no-redeclare': 'off',
      'ts/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
      'antfu/no-top-level-await': ['off'],
      'node/prefer-global/process': ['off'],
      'perfectionist/sort-imports': [
        'error',
        {
          tsconfigRootDir: '.',
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          case: 'camelCase',
          ignore: ['README.md'],
        },
      ],
      '@stylistic/jsx-self-closing-comp': 'error',
    },
  },
);
