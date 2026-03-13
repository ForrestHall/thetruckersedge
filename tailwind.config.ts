import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/(frontend)/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: '.frontend-app',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0c2562',
          navyLight: '#153d7a',
          yellow: '#fbbf24',
          yellowDark: '#d4a017',
          gray: '#f4f5f7',
          darkGray: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
