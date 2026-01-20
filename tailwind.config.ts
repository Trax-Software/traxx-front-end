import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                white: '#FEFEFE',
                'gray-light': '#E0E1E0',
                primary: '#4B2882',
                secondary: '#9C83C4',
                accent: '#FAB900',
                background: '#FEFEFE',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
export default config
