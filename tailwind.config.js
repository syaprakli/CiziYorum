/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6C5CE7',
                secondary: '#00CEC9',
                accent: '#FF7675',
                dark: '#2D3436',
                light: '#DFE6E9',
                surface: '#FFFFFF',
            },
            fontFamily: {
                sans: ['"Fredoka"', 'sans-serif'],
                heading: ['"Fredoka"', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                'pop': '0 10px 40px -10px rgba(108, 92, 231, 0.5)',
            }
        },
    },
    plugins: [],
}
