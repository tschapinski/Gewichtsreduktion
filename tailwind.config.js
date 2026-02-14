/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'vansol-dark': '#242323',
                'vansol-green': '#787d78',
                'vansol-beige': '#e6ddd3',
                'vansol-lightblue': '#ecedfb',
                'vansol-white': '#ffffff',
                'vansol-grey': '#e3e3e3',
                'vansol-text': '#333333',
                'success': '#10B981',
                'error': '#EF4444'
            },
            fontFamily: {
                'sans': ['DM Sans', 'sans-serif'],
                'serif': ['Playfair Display', 'serif'],
                'display': ['Nicky Laatz Very Vogue Display', 'serif'],
                'text': ['Nicky Laatz Very Vogue Text', 'serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0,0,0,0.05)',
                'glow': '0 0 15px rgba(120, 125, 120, 0.3)'
            }
        },
    },
    plugins: [],
}
