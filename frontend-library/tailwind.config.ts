import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';

export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './.storybook/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                border: 'var(--sp-border-base)',
                input: 'var(--sp-border-base)',
                ring: 'var(--sp-ring-color)',
                primary: {
                    DEFAULT: 'var(--sp-bg-interactive)',
                    foreground: 'var(--sp-text-inverse)',
                },
                secondary: {
                    DEFAULT: 'var(--sp-bg-surface)',
                    foreground: 'var(--sp-text-base)',
                },
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [tailwindAnimate],
} satisfies Config;
