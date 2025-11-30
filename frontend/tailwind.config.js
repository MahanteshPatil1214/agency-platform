/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0B0F19', // Deep dark blue/black
                surface: '#151B2B', // Slightly lighter
                primary: {
                    DEFAULT: '#3B82F6', // Blue
                    hover: '#2563EB',
                },
                secondary: {
                    DEFAULT: '#8B5CF6', // Violet
                    hover: '#7C3AED',
                },
                accent: '#06B6D4', // Cyan
                text: {
                    main: '#F8FAFC', // Slate 50
                    muted: '#94A3B8', // Slate 400
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
