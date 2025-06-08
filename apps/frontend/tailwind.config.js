const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('node:path');

const SharedConfig = require('../shared/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...SharedConfig,
  content: [
    ...SharedConfig.content,
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
