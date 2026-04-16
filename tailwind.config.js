/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 莫兰迪主色调
        primary: '#A9B8A8',
        secondary: '#AAB6C5',
        accent: '#C7A49A',
        // 背景层级
        background: '#F6F1EA',
        surface: '#FBF8F4',
        'surface-2': '#F1ECE4',
        // 文字层级
        text: '#3E3A37',
        'text-muted': '#7C736C',
        'text-weak': '#A59B92',
        divider: '#E8E1D8',
        // 状态色（低饱和）
        success: '#9FB3A8',
        warning: '#D8B58A',
        danger: '#C98F86',
      },
      borderRadius: {
        'sm': '12px',
        DEFAULT: '16px',
        'lg': '20px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 20px rgba(62, 58, 55, 0.06)',
        card: '0 2px 12px rgba(62, 58, 55, 0.04)',
      },
    },
  },
  plugins: [],
}
