# 🔢 VisualSorter — Interactive Sorting Algorithm Visualizer

> A sleek, fully client-side sorting algorithm visualizer built with vanilla HTML, CSS & JavaScript. Watch six classic algorithms come to life with real-time bar animations, step-by-step mode, performance benchmarking, and code snippets in four languages.

---

## 🚀 Live Demo

<!-- Replace with your GitHub Pages URL after hosting -->
🔗 **[https://&lt;tamohar20&gt;.github.io/visual-sorter](https://tamohar20.github.io/Visual-Sorter/)**

---

## ✨ Features

- **6 Sorting Algorithms** — Bubble, Selection, Insertion, Merge, Quick, and Counting Sort
- **Real-time Visualization** — Animated bar chart with colour-coded states (Unsorted · Comparing · Swapping · Sorted · Pivot)
- **Step-by-Step Mode** — Advance one frame at a time using the ⏭ Step button or the `→` arrow key
- **Pause / Resume** — Freeze the animation mid-sort and continue anytime (or press `Space`)
- **Speed Control** — Four presets: Slow · Med · Fast · Turbo
- **Custom Array Input** — Enter your own comma-separated values or generate a random array (up to 80 elements)
- **Algorithm Code Viewer** — View the implementation in C, C++, Java, or Python with syntax highlighting
- **Complexity Info Panel** — Best / Average / Worst case and Space complexity for every algorithm
- **Performance Comparison** — One-click benchmark that runs all six algorithms on the current array and renders a comparative bar chart (in ms)
- **Save / Load Array** — Persist up to 5 arrays in `localStorage` and reload them across sessions
- **Sort Log** — Timestamped history of every sort you've run
- **Dark / Light Theme** — Toggle between a dark neon theme and a clean light mode
- **Keyboard Shortcuts** — `Space` to start/pause, `R` to reset, `→` to step

---

## 📂 Project Structure

```
visual-sorter/
├── index.html      # App shell, layout, and all UI markup
├── styles.css      # Full styling — dark/light themes, animations, responsive layout
├── script.js       # All logic — algorithms, animation engine, UI state, benchmarking
└── README.md       # You are here
```

No build tools, no frameworks, no dependencies — just open `index.html` in any modern browser.

---

## 🧠 Algorithms Covered

| Algorithm      | Best Case    | Average Case | Worst Case   | Space   |
|----------------|-------------|--------------|--------------|---------|
| Bubble Sort    | O(n)        | O(n²)        | O(n²)        | O(1)    |
| Selection Sort | O(n²)       | O(n²)        | O(n²)        | O(1)    |
| Insertion Sort | O(n)        | O(n²)        | O(n²)        | O(1)    |
| Merge Sort     | O(n log n)  | O(n log n)   | O(n log n)   | O(n)    |
| Quick Sort     | O(n log n)  | O(n log n)   | O(n²)        | O(log n)|
| Counting Sort  | O(n + k)    | O(n + k)     | O(n + k)     | O(k)    |

---

## ⌨️ Keyboard Shortcuts

| Key           | Action              |
|---------------|---------------------|
| `Space`       | Start / Pause-Resume |
| `R`           | Reset               |
| `→` Arrow     | Step (one frame)    |

---

## 🛠️ Running Locally

No installation required.

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/visual-sorter.git

# 2. Open in browser
cd visual-sorter
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

Or simply drag `index.html` into any browser window.

---

## 🌐 Hosting on GitHub Pages

See the **[Deployment Guide](#-deployment--github-pages)** section below for step-by-step instructions.

---

## 🖼️ Screenshots

> *(Add screenshots of the dark and light modes here after hosting)*

---

## 👨‍💻 Authors

Made with ❤️ by **Swapnil Jaiswal** & **Tamohar Das**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
