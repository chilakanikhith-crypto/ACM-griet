# AlgoVisualizer ⚡ · Interactive Algorithm Simulator

> **ACM GRIET — Round 2 Problem Statement Solution**  
> A high-performance, responsive algorithm visualization platform featuring real-time playback controls, micro-step scrubbing, live data structure inspection (Queue & Stack), dual-mode graph and 2D grid matrix maze exploration, Web Audio sonification, and pseudocode synchronization.

---

## 🎯 Problem Statement Fulfillment

| Required Feature | Implementation Details |
| :--- | :--- |
| **Bubble Sort** | Adjacent element comparison highlights, real-time swaps, sorted right-to-left locking, custom array generator |
| **Merge Sort** | Divide-and-conquer subarray window tracking, midpoint indicator, auxiliary array merge & write animation |
| **Binary Search** | Dynamic `Left (L)`, `MID`, and `Right (R)` pointer badges, eliminated zone dimming/striking, live target matching |
| **BFS (Breadth-First Search)** | **Dual Mode**: Interactive Node Graph with **real-time FIFO Queue animation** + **2D Grid Maze wave expansion** |
| **DFS (Depth-First Search)** | **Dual Mode**: Interactive Node Graph with **real-time LIFO Stack animation** + **2D Grid Maze deep exploration** |
| **Play ▶️ \| Pause ⏸️ \| Reset ↻** | Complete playback suite + Step Backward ⏮️, Step Forward ⏭️, Speed slider (0.25x - 4x), and Timeline Scrubber |

---

## ✨ Key Features & Innovations

1. **Deterministic Step-State Architecture**:
   - Every algorithm executes via a discrete snapshot generator.
   - Allows instant $O(1)$ scrubber jumping, bidirectional stepping (backward/forward), and zero race-condition playback.

2. **Real-Time Data Structure Visualizer**:
   - **For BFS**: Live horizontal **FIFO Queue** container displaying elements enqueued at the rear and dequeued from the front.
   - **For DFS**: Live vertical **LIFO Stack** container displaying elements pushed to top and popped during backtracking.

3. **Dual Exploration Modes for Graph Algorithms**:
   - **Network Graph Mode**: Interactive SVG graph with Tree, Cyclic Network, and DAG Web topologies. Users can select any starting node.
   - **2D Grid Maze Mode**: Interactive grid where users can click & drag to draw obstacles, generate random mazes, and watch BFS find the shortest path vs DFS explore deep corridors.

4. **Web Audio API Sonification**:
   - Harmonic audio feedback: comparisons, swaps, node visits, and success states emit pitch-shifted synthesizer tones.
   - Easily toggled with the sound button in the navbar.

5. **Code Walkthrough & Pseudocode Sync**:
   - Line-by-line syntax-highlighted code matching the currently active step.
   - Plain English explanation box describing the exact reason for the current step.

6. **Theoretical Analytics & Telemetry**:
   - Time Complexity (Best, Average, Worst) and Space Complexity cards.
   - Live telemetry: comparisons counter, swaps / writes, nodes visited, active queue/stack depth, and progress gauge.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism UI
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Web Audio API (native hardware synthesizer)
- **Effects**: Canvas Confetti

---

## 🚀 Getting Started

### 1. Installation

Ensure Node.js is installed, then run:

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build

```bash
npm run build
```

---

## 🎮 How to Use

1. **Select an Algorithm** from the top bar: *Bubble Sort*, *Merge Sort*, *Binary Search*, *BFS*, or *DFS*.
2. Press **Play ▶️** to start execution, or **Step Forward ⏭️** to walk through one line of code at a time.
3. Adjust the **Speed slider** to speed up or slow down execution.
4. Drag the **Timeline scrubber** to jump to any point in the algorithm's lifecycle.
5. In **Sorting / Search**, try generating custom arrays or preset arrangements (Reversed, Duplicates, Nearly Sorted).
6. In **BFS / DFS**, switch between **Interactive Graph** and **2D Grid Maze** to explore level-order vs depth-first pathfinding.
