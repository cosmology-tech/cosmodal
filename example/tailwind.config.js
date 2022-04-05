module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "rgb(25, 27, 31)",
        modalOverlay: "rgba(0, 0, 0, 0.2)",
      },
      width: {
        modal: "calc(100% - 40px)",
      },
      maxWidth: {
        "base-modal": "30.625rem",
        "wc-modal": "24rem",
      },
    },
  },
  plugins: [],
};
