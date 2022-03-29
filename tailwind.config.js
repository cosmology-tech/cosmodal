module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        modalOverlay: "rgba(23, 15, 52, 0.8)",
      },
      maxWidth: {
        modal: "42rem",
      },
    },
  },
  plugins: [],
}