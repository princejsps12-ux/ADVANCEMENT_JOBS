/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px'
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(15, 23, 42, 0.08), 0 8px 32px -8px rgba(15, 23, 42, 0.06)',
        card: '0 1px 3px rgba(15, 23, 42, 0.04), 0 8px 40px -12px rgba(15, 23, 42, 0.1)'
      },
      backgroundImage: {
        mesh:
          'radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.1) 0px, transparent 45%), radial-gradient(at 100% 100%, rgba(148, 163, 184, 0.12) 0px, transparent 50%), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
      }
    }
  },
  plugins: []
};

