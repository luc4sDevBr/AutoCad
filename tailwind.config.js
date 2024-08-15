/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './popup.html',
    './options.html',
    './background.js',
    './content_script.js',

    ],
    theme: {
      extend: {
        spacing: {
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
          '150':'29rem',
          'px350':'350px'
        }
      },
    },
    plugins: [],
  }