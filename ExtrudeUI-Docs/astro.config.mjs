// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [starlight({
        title: 'ExtrudeUI Docs',
        social: {
            github: 'https://github.com/Oia20/ExtrudeUI',
        },
        sidebar: [
            {
                label: 'Introduction',
                link: '/',
            },
            {
                label: 'Installation/Getting Started',
				link: '/installation',
            },
            {
                label: 'Components',
                autogenerate: { directory: 'components' },
            },
        ],
        customCss: [
            './src/styles/custom.css',
        ],
    }), react()],
});