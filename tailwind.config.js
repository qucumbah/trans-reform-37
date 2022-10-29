/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      spacing: {
        "ya": "10px",
        "yabtn": "26px",
      },
      boxShadow: {
        "yandex": "0 1px 2px 1px rgb(0 0 0 / 15%), 0 2px 5px -3px rgb(0 0 0 / 15%)"
      }
    },
  },
  plugins: [],
}
