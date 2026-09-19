# 🧠 AlgoViz — Data Structures & Algorithms Interactive Visualizer

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg?logo=javascript&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

An interactive, educational web application designed to help students, developers, and computer science enthusiasts master fundamental **Data Structures** and **Classic Algorithms** through step-by-step animations, real-time array manipulation, and time/space complexity benchmarks.

---

## 📌 Features & Visualizers

AlgoViz provides 12 distinct interactive sandbox environments, categorized into three computer science domains:

### 🧱 1. Abstract Data Structures
- **Stack:** LIFO (Last-In, First-Out) operations (`push`, `pop`, `peek`) with visual element stacking and stack overflow/underflow boundary protection.
- **Queue:** FIFO (First-In, First-Out) operations (`enqueue`, `dequeue`, `front`) demonstrating sequential queue progression.
- **Singly Linked List:** Node insertion at head/tail/index, pointer traversal, node deletion, and visual arrow link updates.
- **Binary Search Tree (BST):** Key insertion, animated node comparison ($< \text{left}, > \text{right}$), level order balancing, and in-order/pre-order traversals.
- **AVL Tree:** Self-balancing binary search tree demonstrating automatic rotations (LL, RR, LR, RL) upon balance factor violation ($|BF| > 1$).

### 🔄 2. Sorting Algorithms
Each sorting sandbox provides step-by-step comparison animations, pivot/cursor indicators, and element swap effects:
- **Bubble Sort:** Neighboring comparison swaps with early-exit flag optimization.
- **Insertion Sort:** Shifting elements to maintain a sorted sub-array.
- **Selection Sort:** Minimum element identification and sequential index swapping.
- **Merge Sort:** Recursive divide-and-conquer splitting and merging visualization.
- **Quick Sort:** Pivot element selection, dual-pointer partitioning, and recursive subarrays.

### 🔍 3. Searching Algorithms
- **Linear Search:** Sequential element scanning from index 0 to $N-1$ over unsorted collections.
- **Binary Search:** High/Low/Mid pointer calculation on sorted arrays with $O(\log N)$ search space halving.

---

## 📊 Complexity Reference Matrix

| Algorithm / Structure | Best Time | Average Time | Worst Time | Space Complexity |
|---|---|---|---|---|
| **Stack / Queue** | $O(1)$ | $O(1)$ | $O(1)$ | $O(N)$ |
| **Singly Linked List** | $O(1)$ | $O(N)$ | $O(N)$ | $O(N)$ |
| **Binary Search Tree (BST)** | $O(\log N)$ | $O(\log N)$ | $O(N)$ | $O(N)$ |
| **AVL Tree (Self-Balancing)** | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | $O(N)$ |
| **Bubble / Insertion / Selection Sort** | $O(N)$ / $O(N^2)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ |
| **Merge Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ |
| **Quick Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N^2)$ | $O(\log N)$ |
| **Binary Search** | $O(1)$ | $O(\log N)$ | $O(\log N)$ | $O(1)$ |

---

## 📂 Repository Structure

```
DataStructures-Website-AlgoViz/
├── index.html           # Landing hub and visualizer catalog
├── about.html           # Information about project purpose and methodology
├── style.css            # Unified responsive dark/light UI design system
├── pages/               # 12 Individual visualizer application pages
│   ├── stack.html
│   ├── queue.html
│   ├── linked_list.html
│   ├── bst.html
│   ├── avl_trees.html
│   ├── bubble_sort.html
│   ├── insertion_sort.html
│   ├── selection_sort.html
│   ├── merge_sort.html
│   ├── quick_sort.html
│   ├── linear_search.html
│   └── binary_search.html
├── js/                  # Visualization animation loops, canvas, & algorithms
└── README.md            # Project documentation
```

---

## 🚀 Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/murattt00/DataStructures-Website-AlgoViz.git
   cd DataStructures-Website-AlgoViz
   ```
2. **Open in your browser:**
   Double-click `index.html` or run with VS Code Live Server. Zero configuration or npm dependencies required!

---
