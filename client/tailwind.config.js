export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18212f',
        field: '#f6f8fb',
        brand: '#2563eb',
        mint: '#0f9f7a',
        coral: '#d9564a'
      },
      boxShadow: {
        panel: '0 14px 40px rgba(24, 33, 47, 0.08)'
      }
    }
  },
  plugins: []
};
