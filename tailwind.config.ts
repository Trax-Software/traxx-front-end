import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                white: '#FEFEFE',
                'gray-light': '#E0E1E0',
                brand: {
                    orange: '#FD8F06',
                    magenta: '#990099',
                },
                background: '#FEFEFE',
            },
            fontFamily: {
                sans: ['var(--font-gotham)', 'system-ui', 'sans-serif'],
                title: ['var(--font-ubuntu)', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(to right, #FD8F06, #990099)',
                'brand-gradient-hover': 'linear-gradient(to right, #e58105, #800080)',
            }
        },
    },
    plugins: [],
}
export default config
