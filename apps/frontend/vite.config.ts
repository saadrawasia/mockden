import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
	return {
		root: __dirname,
		cacheDir: '../../node_modules/.vite/apps/frontend',
		server: {
			port: 4200,
			host: 'localhost',
		},
		preview: {
			port: 4300,
			host: 'localhost',
		},
		plugins: [
			tanstackRouter({
				target: 'react',
				autoCodeSplitting: true,
			}),
			react(),
			tailwindcss(),
			tsconfigPaths(),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				'@shared': path.resolve(__dirname, '../shared/src'),
			},
		},
		envDir: path.resolve(__dirname, '../../'),
		// Uncomment this if you are using workers.
		// worker: {
		//  plugins: [ nxViteTsPaths() ],
		// },
		build: {
			outDir: './dist',
			emptyOutDir: true,
			reportCompressedSize: true,
			commonjsOptions: {
				transformMixedEsModules: true,
			},
		},
	};
});
