import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
	title: 'Mockden Docs',
	tagline: '',
	favicon: 'img/mockden64.png',

	// Set the production url of your site here
	url: 'https://docs.mockden.com',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'mockden', // Usually your GitHub org/user name.
	projectName: 'mockden', // Usually your repo name.

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			{
				docs: {
					routeBasePath: '/',
					sidebarPath: require.resolve('./sidebars.ts'),
				},
				blog: false,
				pages: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		colorMode: {
			disableSwitch: true, // 👈 disables the toggle in the navbar
			defaultMode: 'light', // (optional) or 'dark'
			respectPrefersColorScheme: false, // (optional) ignore system preference
		},
		navbar: {
			title: 'Mockden',
			logo: {
				alt: 'Mockden Logo',
				src: 'img/mockden64.png',
			},
		},
		footer: {
			style: 'dark',
			copyright: `Copyright © ${new Date().getFullYear()} Mockden, Built with Docusaurus.`,
		},
		prism: {
			theme: prismThemes.github,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
