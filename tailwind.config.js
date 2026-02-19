/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        shell: '#354a5f',
        'shell-end': '#4a6a8a',
        primary: '#0854a0',
        'primary-hover': '#0a6ed1',
        accent: '#1a9898',
        success: '#107e3e',
        warning: '#e9730c',
        error: '#bb0000',
        purple: '#7b1fa2',
        bg: '#f5f6f7',
        surface: '#ffffff',
        border: '#d9d9d9',
        'border-light': '#ededed',
        text: '#32363a',
        'text-sec': '#6a6d70',
        'text-muted': '#89919a',
        highlight: '#ebf5ff',
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "'IBM Plex Sans Thai'", '-apple-system', 'sans-serif'],
      },
      fontSize: {
        base: '14px',
        label: '0.76rem',
        table: '0.82rem',
      },
    },
  },
  plugins: [],
};
