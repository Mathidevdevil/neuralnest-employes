/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'neural-bg': 'var(--color-neural-bg)',
                'neural-card': 'var(--color-neural-card)',
                'neural-accent': 'var(--color-neural-accent)',
                'neural-text': 'var(--color-neural-text)',
                'neural-secondary': 'var(--color-neural-secondary)',
            }
        },
    },
    plugins: [],
}
