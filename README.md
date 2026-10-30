# Color Flipper 🎨

An interactive and modern **Color Flipper** web application built with vanilla **HTML5**, **CSS3**, and **JavaScript**. No external frameworks or dependencies.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## ✨ Features

- **Initial Start Screen**: Clean entry card with title, description, and a `▶ Start` button.
- **Random Color Generator**: Generates a random 6-digit `#RRGGBB` hex color and applies it to the background with smooth CSS transitions (`0.5s ease`).
- **Interactive Color Picker**: Live `<input type="color">` allowing custom shade selection that syncs immediately with the background.
- **Dynamic Text Contrast**: Automatically calculates perceived brightness (YIQ luminance formula) to switch text color between dark and light, ensuring high contrast and legibility at all times.
- **One-Click Clipboard Copy**: Copies the active HEX code to your clipboard with a 2-second debounced notification toast.
- **Reset Button**: Restores the default light theme (`#F4F6FB`).
- **Fully Responsive**: Designed with mobile-first CSS, flexing perfectly from 320px mobile screens up to 4K monitors.
- **Accessible (a11y)**: Semantic HTML5, ARIA labels, focus-visible states, and polite live regions.

---

## 📂 Project Structure

```text
color-flipper/
├── index.html       # Semantic HTML5 markup
├── style.css        # CSS variables, responsive styling, and animations
├── script.js        # Vanilla JavaScript logic
└── README.md        # Project documentation
```

---

## 🚀 How to Run Locally

### Option 1: Open Directly in Browser
Double-click `index.html` or open it with any web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Run with Python Local Server
```bash
python -m http.server 8000
```
Then visit [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🛠️ Built With

- **HTML5**: Semantic tags (`<main>`, `<header>`, `<section>`, `<button>`)
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, Glassmorphism
- **JavaScript (ES6+)**: Event listeners, Clipboard API, DOM manipulation, Hex math

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
