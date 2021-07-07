// tailwind.config.js
module.exports = {
  // Keep JIT disabled for now. Enabling it will break the custom font loading.
  // mode: 'jit',
  purge: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ], // tree-shaking unused styles
  darkMode: false, // or 'media' or 'class'
}
