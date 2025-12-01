/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#121212', // Deep matte black
                surface: '#1E1E1E', // Dark gray for cards
                surfaceHighlight: '#2A2A2A', // Lighter gray for hover/active
                primary: {
                    DEFAULT: '#D4F933', // Neon Lime (NotebookLM signature)
                    hover: '#B8D92B',
                    glow: 'rgba(212, 249, 51, 0.4)'
                },
                secondary: {
                    DEFAULT: '#4285F4', // Google Blue
                    hover: '#3367D6',
                    glow: 'rgba(66, 133, 244, 0.4)'
                },
                accent: {
                    DEFAULT: '#FF7043', // Warm Orange/Coral for variety
                    glow: 'rgba(255, 112, 67, 0.4)'
                },
                text: {
                    main: '#F1F3F4', // Off-white
                    muted: '#9AA0A6', // Gray text
                    dim: '#5F6368', // Darker gray
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Clean, modern sans
                heading: ['Outfit', 'sans-serif'], // Stylish headings
            },
            boxShadow: {
                'glow-primary': '0 0 20px -5px var(--tw-shadow-color)',
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'glass-sm': '0 2px 10px rgba(0, 0, 0, 0.05)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
