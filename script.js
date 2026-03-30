let array         = [];       // current working array
let animations    = [];       // pre-computed animation frames
let animIdx       = 0;        // current frame index
let isRunning     = false;    // sort is active
let isPaused      = false;    // sort is paused
let animTimer     = null;     // setTimeout handle
let comparisons   = 0;        // comparison counter
let swaps         = 0;        // swap counter
let currentAlgo   = 'bubble'; // selected algorithm key
let currentLang   = 'c';      // selected code language
let currentSpeed  = 'slow'; // animation speed key
let sortedIndices = new Set();// indices already in final position
let compResults   = {};       // comparison chart data
let lightMode     = false;    // theme flag

const SPEEDS = { slow: 220, medium: 80, fast: 22, turbo: 4 };

const ALGO_INFO = {
  bubble: {
    name: 'Bubble Sort',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    desc: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The largest elements bubble to the end of the list in each pass. An early-exit flag stops the algorithm when the array is already sorted, giving O(n) best-case.'
  },
  selection: {
    name: 'Selection Sort',
    best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    desc: 'Selection Sort divides the array into sorted and unsorted halves. It repeatedly scans the unsorted section to find the minimum element, then moves it to the end of the sorted section. It makes at most n–1 swaps, which is useful when memory writes are expensive.'
  },
  insertion: {
    name: 'Insertion Sort',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    desc: 'Insertion Sort builds the final sorted array one element at a time. It picks each new element and inserts it into its correct position among the already-sorted elements by shifting larger elements rightward. It is very efficient on small or nearly-sorted datasets.'
  },
  merge: {
    name: 'Merge Sort',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',
    desc: 'Merge Sort uses divide-and-conquer: it splits the array in half, recursively sorts each half, then merges the two sorted halves into one. It guarantees O(n log n) performance in all cases and is a stable sort, but requires O(n) auxiliary space.'
  },
  quick: {
    name: 'Quick Sort',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)',
    desc: 'Quick Sort picks a pivot element and partitions the array so that all elements smaller than the pivot come before it and all larger elements come after. It then recursively sorts both partitions. In practice it is one of the fastest comparison sorts despite the O(n²) worst case.'
  },
  counting: {
    name: 'Counting Sort',
    best: 'O(n+k)', avg: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)',
    desc: 'Counting Sort is a non-comparison integer sorting algorithm. It counts the frequency of each distinct value, computes prefix sums to find positions, then places each element at its correct index. It is extremely fast when the value range k is not much larger than n.'
  }
};

const CODE = {
  bubble: {
    c: `<span class="kw">void</span> <span class="fn">bubbleSort</span>(<span class="kw">int</span> arr[], <span class="kw">int</span> n) {
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
    <span class="kw">int</span> swapped = <span class="num">0</span>;
    <span class="kw">for</span> (<span class="kw">int</span> j = <span class="num">0</span>; j < n - i - <span class="num">1</span>; j++) {
      <span class="cm">// Compare adjacent elements</span>
      <span class="kw">if</span> (arr[j] > arr[j + <span class="num">1</span>]) {
        <span class="kw">int</span> tmp = arr[j];
        arr[j] = arr[j + <span class="num">1</span>];
        arr[j + <span class="num">1</span>] = tmp;
        swapped = <span class="num">1</span>;
      }
    }
    <span class="cm">// Early exit if no swaps occurred</span>
    <span class="kw">if</span> (!swapped) <span class="kw">break</span>;
  }
}`,
    cpp: `<span class="kw">void</span> <span class="fn">bubbleSort</span>(<span class="tp">vector</span>&lt;<span class="kw">int</span>&gt;&amp; arr) {
  <span class="kw">int</span> n = arr.<span class="fn">size</span>();
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
    <span class="kw">bool</span> swapped = <span class="kw">false</span>;
    <span class="kw">for</span> (<span class="kw">int</span> j = <span class="num">0</span>; j < n - i - <span class="num">1</span>; j++) {
      <span class="kw">if</span> (arr[j] > arr[j + <span class="num">1</span>]) {
        <span class="fn">swap</span>(arr[j], arr[j + <span class="num">1</span>]);
        swapped = <span class="kw">true</span>;
      }
    }
    <span class="kw">if</span> (!swapped) <span class="kw">break</span>;
  }
}`,
    java: `<span class="kw">public void</span> <span class="fn">bubbleSort</span>(<span class="kw">int</span>[] arr) {
  <span class="kw">int</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
    <span class="kw">boolean</span> swapped = <span class="kw">false</span>;
    <span class="kw">for</span> (<span class="kw">int</span> j = <span class="num">0</span>; j < n - i - <span class="num">1</span>; j++) {
      <span class="kw">if</span> (arr[j] > arr[j + <span class="num">1</span>]) {
        <span class="kw">int</span> tmp = arr[j];
        arr[j]     = arr[j + <span class="num">1</span>];
        arr[j + <span class="num">1</span>] = tmp;
        swapped = <span class="kw">true</span>;
      }
    }
    <span class="kw">if</span> (!swapped) <span class="kw">break</span>;
  }
}`,
    python: `<span class="kw">def</span> <span class="fn">bubble_sort</span>(arr):
    n = <span class="fn">len</span>(arr)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n - <span class="num">1</span>):
        swapped = <span class="kw">False</span>
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n - i - <span class="num">1</span>):
            <span class="cm"># Compare adjacent elements</span>
            <span class="kw">if</span> arr[j] > arr[j + <span class="num">1</span>]:
                arr[j], arr[j + <span class="num">1</span>] = arr[j + <span class="num">1</span>], arr[j]
                swapped = <span class="kw">True</span>
        <span class="kw">if not</span> swapped:
            <span class="kw">break</span>
    <span class="kw">return</span> arr`
  },

  selection: {
    c: `<span class="kw">void</span> <span class="fn">selectionSort</span>(<span class="kw">int</span> arr[], <span class="kw">int</span> n) {
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
    <span class="kw">int</span> minIdx = i;
    <span class="kw">for</span> (<span class="kw">int</span> j = i + <span class="num">1</span>; j < n; j++) {
      <span class="kw">if</span> (arr[j] < arr[minIdx])
        minIdx = j;
    }
    <span class="cm">// Swap minimum element to position i</span>
    <span class="kw">int</span> tmp    = arr[minIdx];
    arr[minIdx] = arr[i];
    arr[i]      = tmp;
  }
}`,
    cpp: `<span class="kw">void</span> <span class="fn">selectionSort</span>(<span class="tp">vector</span>&lt;<span class="kw">int</span>&gt;&amp; arr) {
  <span class="kw">int</span> n = arr.<span class="fn">size</span>();
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
    <span class="kw">int</span> minIdx = i;
    <span class="kw">for</span> (<span class="kw">int</span> j = i + <span class="num">1</span>; j < n; j++)
      <span class="kw">if</span> (arr[j] < arr[minIdx]) minIdx = j;
    <span class="fn">swap</span>(arr[i], arr[minIdx]);
  }
}`,
    java: `<span class="kw">public void</span> <span class="fn">selectionSort</span>(<span class="kw">int</span>[] arr) {
  <span class="kw">int</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
    <span class="kw">int</span> minIdx = i;
    <span class="kw">for</span> (<span class="kw">int</span> j = i + <span class="num">1</span>; j < n; j++)
      <span class="kw">if</span> (arr[j] < arr[minIdx]) minIdx = j;
    <span class="kw">int</span> tmp    = arr[minIdx];
    arr[minIdx] = arr[i];
    arr[i]      = tmp;
  }
}`,
    python: `<span class="kw">def</span> <span class="fn">selection_sort</span>(arr):
    n = <span class="fn">len</span>(arr)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n - <span class="num">1</span>):
        min_idx = i
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(i + <span class="num">1</span>, n):
            <span class="kw">if</span> arr[j] < arr[min_idx]:
                min_idx = j
        <span class="cm"># Swap minimum to correct position</span>
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    <span class="kw">return</span> arr`
  },

  insertion: {
    c: `<span class="kw">void</span> <span class="fn">insertionSort</span>(<span class="kw">int</span> arr[], <span class="kw">int</span> n) {
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">1</span>; i < n; i++) {
    <span class="kw">int</span> key = arr[i];
    <span class="kw">int</span> j   = i - <span class="num">1</span>;
    <span class="cm">// Shift larger elements right</span>
    <span class="kw">while</span> (j >= <span class="num">0</span> && arr[j] > key) {
      arr[j + <span class="num">1</span>] = arr[j];
      j--;
    }
    arr[j + <span class="num">1</span>] = key;
  }
}`,
    cpp: `<span class="kw">void</span> <span class="fn">insertionSort</span>(<span class="tp">vector</span>&lt;<span class="kw">int</span>&gt;&amp; arr) {
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">1</span>; i < (<span class="kw">int</span>)arr.<span class="fn">size</span>(); i++) {
    <span class="kw">int</span> key = arr[i], j = i - <span class="num">1</span>;
    <span class="kw">while</span> (j >= <span class="num">0</span> && arr[j] > key) {
      arr[j + <span class="num">1</span>] = arr[j];
      j--;
    }
    arr[j + <span class="num">1</span>] = key;
  }
}`,
    java: `<span class="kw">public void</span> <span class="fn">insertionSort</span>(<span class="kw">int</span>[] arr) {
  <span class="kw">int</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">1</span>; i < n; i++) {
    <span class="kw">int</span> key = arr[i];
    <span class="kw">int</span> j   = i - <span class="num">1</span>;
    <span class="kw">while</span> (j >= <span class="num">0</span> && arr[j] > key) {
      arr[j + <span class="num">1</span>] = arr[j];
      j--;
    }
    arr[j + <span class="num">1</span>] = key;
  }
}`,
    python: `<span class="kw">def</span> <span class="fn">insertion_sort</span>(arr):
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="fn">len</span>(arr)):
        key = arr[i]
        j   = i - <span class="num">1</span>
        <span class="cm"># Shift larger elements right</span>
        <span class="kw">while</span> j >= <span class="num">0</span> <span class="kw">and</span> arr[j] > key:
            arr[j + <span class="num">1</span>] = arr[j]
            j -= <span class="num">1</span>
        arr[j + <span class="num">1</span>] = key
    <span class="kw">return</span> arr`
  },

  merge: {
    c: `<span class="kw">void</span> <span class="fn">merge</span>(<span class="kw">int</span> arr[], <span class="kw">int</span> l, <span class="kw">int</span> m, <span class="kw">int</span> r) {
  <span class="kw">int</span> n1 = m - l + <span class="num">1</span>, n2 = r - m;
  <span class="kw">int</span> L[n1], R[n2];
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < n1; i++) L[i] = arr[l + i];
  <span class="kw">for</span> (<span class="kw">int</span> j = <span class="num">0</span>; j < n2; j++) R[j] = arr[m + <span class="num">1</span> + j];
  <span class="kw">int</span> i = <span class="num">0</span>, j = <span class="num">0</span>, k = l;
  <span class="kw">while</span> (i < n1 && j < n2)
    arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
  <span class="kw">while</span> (i < n1) arr[k++] = L[i++];
  <span class="kw">while</span> (j < n2) arr[k++] = R[j++];
}

<span class="kw">void</span> <span class="fn">mergeSort</span>(<span class="kw">int</span> arr[], <span class="kw">int</span> l, <span class="kw">int</span> r) {
  <span class="kw">if</span> (l < r) {
    <span class="kw">int</span> m = l + (r - l) / <span class="num">2</span>;
    <span class="fn">mergeSort</span>(arr, l, m);
    <span class="fn">mergeSort</span>(arr, m + <span class="num">1</span>, r);
    <span class="fn">merge</span>(arr, l, m, r);
  }
}`,
    cpp: `<span class="kw">void</span> <span class="fn">mergeSort</span>(<span class="tp">vector</span>&lt;<span class="kw">int</span>&gt;&amp; arr, <span class="kw">int</span> l, <span class="kw">int</span> r) {
  <span class="kw">if</span> (l >= r) <span class="kw">return</span>;
  <span class="kw">int</span> m = l + (r - l) / <span class="num">2</span>;
  <span class="fn">mergeSort</span>(arr, l, m);
  <span class="fn">mergeSort</span>(arr, m + <span class="num">1</span>, r);
  <span class="cm">// In-place merge</span>
  <span class="tp">vector</span>&lt;<span class="kw">int</span>&gt; tmp(arr.begin()+l, arr.begin()+r+<span class="num">1</span>);
  <span class="kw">int</span> i = <span class="num">0</span>, j = m - l + <span class="num">1</span>, k = l;
  <span class="kw">while</span> (i <= m-l && j <= r-l)
    arr[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
  <span class="kw">while</span> (i <= m-l) arr[k++] = tmp[i++];
  <span class="kw">while</span> (j <= r-l) arr[k++] = tmp[j++];
}`,
    java: `<span class="kw">public void</span> <span class="fn">mergeSort</span>(<span class="kw">int</span>[] arr, <span class="kw">int</span> l, <span class="kw">int</span> r) {
  <span class="kw">if</span> (l >= r) <span class="kw">return</span>;
  <span class="kw">int</span> m = l + (r - l) / <span class="num">2</span>;
  <span class="fn">mergeSort</span>(arr, l, m);
  <span class="fn">mergeSort</span>(arr, m + <span class="num">1</span>, r);
  <span class="fn">merge</span>(arr, l, m, r);
}

<span class="kw">void</span> <span class="fn">merge</span>(<span class="kw">int</span>[] arr, <span class="kw">int</span> l, <span class="kw">int</span> m, <span class="kw">int</span> r) {
  <span class="kw">int</span>[] tmp = Arrays.<span class="fn">copyOfRange</span>(arr, l, r + <span class="num">1</span>);
  <span class="kw">int</span> i = <span class="num">0</span>, j = m - l + <span class="num">1</span>, k = l;
  <span class="kw">while</span> (i <= m-l && j < tmp.length)
    arr[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
  <span class="kw">while</span> (i <= m-l) arr[k++] = tmp[i++];
  <span class="kw">while</span> (j < tmp.length) arr[k++] = tmp[j++];
}`,
    python: `<span class="kw">def</span> <span class="fn">merge_sort</span>(arr):
    <span class="kw">if</span> <span class="fn">len</span>(arr) <= <span class="num">1</span>:
        <span class="kw">return</span> arr
    mid   = <span class="fn">len</span>(arr) // <span class="num">2</span>
    left  = <span class="fn">merge_sort</span>(arr[:mid])
    right = <span class="fn">merge_sort</span>(arr[mid:])
    <span class="kw">return</span> <span class="fn">_merge</span>(left, right)

<span class="kw">def</span> <span class="fn">_merge</span>(left, right):
    result, i, j = [], <span class="num">0</span>, <span class="num">0</span>
    <span class="kw">while</span> i < <span class="fn">len</span>(left) <span class="kw">and</span> j < <span class="fn">len</span>(right):
        <span class="kw">if</span> left[i] <= right[j]:
            result.<span class="fn">append</span>(left[i]); i += <span class="num">1</span>
        <span class="kw">else</span>:
            result.<span class="fn">append</span>(right[j]); j += <span class="num">1</span>
    <span class="kw">return</span> result + left[i:] + right[j:]`
  },

  quick: {
    c: `<span class="kw">int</span> <span class="fn">partition</span>(<span class="kw">int</span> arr[], <span class="kw">int</span> lo, <span class="kw">int</span> hi) {
  <span class="kw">int</span> pivot = arr[hi], i = lo - <span class="num">1</span>;
  <span class="kw">for</span> (<span class="kw">int</span> j = lo; j < hi; j++) {
    <span class="kw">if</span> (arr[j] <= pivot) {
      i++;
      <span class="kw">int</span> tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
  }
  <span class="kw">int</span> tmp   = arr[i+<span class="num">1</span>];
  arr[i+<span class="num">1</span>]  = arr[hi];
  arr[hi]   = tmp;
  <span class="kw">return</span> i + <span class="num">1</span>;
}

<span class="kw">void</span> <span class="fn">quickSort</span>(<span class="kw">int</span> arr[], <span class="kw">int</span> lo, <span class="kw">int</span> hi) {
  <span class="kw">if</span> (lo < hi) {
    <span class="kw">int</span> pi = <span class="fn">partition</span>(arr, lo, hi);
    <span class="fn">quickSort</span>(arr, lo, pi - <span class="num">1</span>);
    <span class="fn">quickSort</span>(arr, pi + <span class="num">1</span>, hi);
  }
}`,
    cpp: `<span class="kw">int</span> <span class="fn">partition</span>(<span class="tp">vector</span>&lt;<span class="kw">int</span>&gt;&amp; arr, <span class="kw">int</span> lo, <span class="kw">int</span> hi) {
  <span class="kw">int</span> pivot = arr[hi], i = lo - <span class="num">1</span>;
  <span class="kw">for</span> (<span class="kw">int</span> j = lo; j < hi; j++)
    <span class="kw">if</span> (arr[j] <= pivot) <span class="fn">swap</span>(arr[++i], arr[j]);
  <span class="fn">swap</span>(arr[i + <span class="num">1</span>], arr[hi]);
  <span class="kw">return</span> i + <span class="num">1</span>;
}

<span class="kw">void</span> <span class="fn">quickSort</span>(<span class="tp">vector</span>&lt;<span class="kw">int</span>&gt;&amp; arr, <span class="kw">int</span> lo, <span class="kw">int</span> hi) {
  <span class="kw">if</span> (lo < hi) {
    <span class="kw">int</span> pi = <span class="fn">partition</span>(arr, lo, hi);
    <span class="fn">quickSort</span>(arr, lo, pi - <span class="num">1</span>);
    <span class="fn">quickSort</span>(arr, pi + <span class="num">1</span>, hi);
  }
}`,
    java: `<span class="kw">public void</span> <span class="fn">quickSort</span>(<span class="kw">int</span>[] arr, <span class="kw">int</span> lo, <span class="kw">int</span> hi) {
  <span class="kw">if</span> (lo < hi) {
    <span class="kw">int</span> pi = <span class="fn">partition</span>(arr, lo, hi);
    <span class="fn">quickSort</span>(arr, lo, pi - <span class="num">1</span>);
    <span class="fn">quickSort</span>(arr, pi + <span class="num">1</span>, hi);
  }
}

<span class="kw">int</span> <span class="fn">partition</span>(<span class="kw">int</span>[] arr, <span class="kw">int</span> lo, <span class="kw">int</span> hi) {
  <span class="kw">int</span> pivot = arr[hi], i = lo - <span class="num">1</span>;
  <span class="kw">for</span> (<span class="kw">int</span> j = lo; j < hi; j++) {
    <span class="kw">if</span> (arr[j] <= pivot) {
      i++;
      <span class="kw">int</span> t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
  }
  <span class="kw">int</span> t = arr[i+<span class="num">1</span>]; arr[i+<span class="num">1</span>] = arr[hi]; arr[hi] = t;
  <span class="kw">return</span> i + <span class="num">1</span>;
}`,
    python: `<span class="kw">def</span> <span class="fn">quick_sort</span>(arr, lo, hi):
    <span class="kw">if</span> lo < hi:
        pi = <span class="fn">partition</span>(arr, lo, hi)
        <span class="fn">quick_sort</span>(arr, lo, pi - <span class="num">1</span>)
        <span class="fn">quick_sort</span>(arr, pi + <span class="num">1</span>, hi)

<span class="kw">def</span> <span class="fn">partition</span>(arr, lo, hi):
    pivot, i = arr[hi], lo - <span class="num">1</span>
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(lo, hi):
        <span class="kw">if</span> arr[j] <= pivot:
            i += <span class="num">1</span>
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + <span class="num">1</span>], arr[hi] = arr[hi], arr[i + <span class="num">1</span>]
    <span class="kw">return</span> i + <span class="num">1</span>`
  },

  counting: {
    c: `<span class="kw">void</span> <span class="fn">countingSort</span>(<span class="kw">int</span> arr[], <span class="kw">int</span> n) {
  <span class="kw">int</span> max = arr[<span class="num">0</span>];
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">1</span>; i < n; i++)
    <span class="kw">if</span> (arr[i] > max) max = arr[i];

  <span class="kw">int</span> count[max + <span class="num">1</span>];
  <span class="fn">memset</span>(count, <span class="num">0</span>, <span class="kw">sizeof</span>(count));

  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < n; i++)
    count[arr[i]]++;

  <span class="kw">int</span> idx = <span class="num">0</span>;
  <span class="kw">for</span> (<span class="kw">int</span> v = <span class="num">0</span>; v <= max; v++)
    <span class="kw">while</span> (count[v]--) arr[idx++] = v;
}`,
    cpp: `<span class="kw">void</span> <span class="fn">countingSort</span>(<span class="tp">vector</span>&lt;<span class="kw">int</span>&gt;&amp; arr) {
  <span class="kw">int</span> mx = *<span class="fn">max_element</span>(arr.<span class="fn">begin</span>(), arr.<span class="fn">end</span>());
  <span class="tp">vector</span>&lt;<span class="kw">int</span>&gt; cnt(mx + <span class="num">1</span>, <span class="num">0</span>);

  <span class="kw">for</span> (<span class="kw">int</span> x : arr) cnt[x]++;

  <span class="kw">int</span> idx = <span class="num">0</span>;
  <span class="kw">for</span> (<span class="kw">int</span> v = <span class="num">0</span>; v <= mx; v++)
    <span class="kw">while</span> (cnt[v]-- > <span class="num">0</span>) arr[idx++] = v;
}`,
    java: `<span class="kw">public void</span> <span class="fn">countingSort</span>(<span class="kw">int</span>[] arr) {
  <span class="kw">int</span> max = Arrays.<span class="fn">stream</span>(arr).<span class="fn">max</span>().<span class="fn">getAsInt</span>();
  <span class="kw">int</span>[] cnt = <span class="kw">new int</span>[max + <span class="num">1</span>];

  <span class="kw">for</span> (<span class="kw">int</span> x : arr) cnt[x]++;

  <span class="kw">int</span> idx = <span class="num">0</span>;
  <span class="kw">for</span> (<span class="kw">int</span> v = <span class="num">0</span>; v <= max; v++)
    <span class="kw">while</span> (cnt[v]-- > <span class="num">0</span>) arr[idx++] = v;
}`,
    python: `<span class="kw">def</span> <span class="fn">counting_sort</span>(arr):
    <span class="kw">if not</span> arr:
        <span class="kw">return</span> arr
    mx    = <span class="fn">max</span>(arr)
    count = [<span class="num">0</span>] * (mx + <span class="num">1</span>)

    <span class="kw">for</span> x <span class="kw">in</span> arr:
        count[x] += <span class="num">1</span>

    idx = <span class="num">0</span>
    <span class="kw">for</span> v, c <span class="kw">in</span> <span class="fn">enumerate</span>(count):
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(c):
            arr[idx] = v; idx += <span class="num">1</span>
    <span class="kw">return</span> arr`
  }
};

/** Bubble Sort */
function getBubbleFrames(arr) {
  const a = [...arr], n = a.length, frames = [];
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      frames.push({ type: 'compare', indices: [j, j + 1], arr: [...a],
        msg: `Pass ${i+1}: Comparing a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        frames.push({ type: 'swap', indices: [j, j + 1], arr: [...a],
          msg: `Swapping a[${j}]=${a[j]} ↔ a[${j+1}]=${a[j+1]}` });
        swapped = true;
      }
    }
    frames.push({ type: 'sorted', indices: [n - 1 - i], arr: [...a],
      msg: `a[${n-1-i}]=${a[n-1-i]} is now in its final position` });
    if (!swapped) break;
  }
  // Mark all sorted
  frames.push({ type: 'sorted', indices: [...Array(n).keys()], arr: [...a],
    msg: '✓ Array fully sorted!' });
  return frames;
}

/** Selection Sort */
function getSelectionFrames(arr) {
  const a = [...arr], n = a.length, frames = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      frames.push({ type: 'compare', indices: [minIdx, j], arr: [...a],
        msg: `Finding minimum in [${i}..${n-1}]: comparing a[${minIdx}]=${a[minIdx]} with a[${j}]=${a[j]}` });
      if (a[j] < a[minIdx]) { minIdx = j; }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      frames.push({ type: 'swap', indices: [i, minIdx], arr: [...a],
        msg: `Placing minimum ${a[i]} at index ${i}` });
    }
    frames.push({ type: 'sorted', indices: [i], arr: [...a],
      msg: `Position ${i} is sorted (value=${a[i]})` });
  }
  frames.push({ type: 'sorted', indices: [...Array(n).keys()], arr: [...a],
    msg: '✓ Array fully sorted!' });
  return frames;
}

/** Insertion Sort */
function getInsertionFrames(arr) {
  const a = [...arr], n = a.length, frames = [];
  frames.push({ type: 'sorted', indices: [0], arr: [...a],
    msg: 'a[0] is trivially sorted' });
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    frames.push({ type: 'compare', indices: [i, j], arr: [...a],
      msg: `Inserting key=${key} from position ${i}` });
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      frames.push({ type: 'swap', indices: [j, j + 1], arr: [...a],
        msg: `Shifting a[${j}]=${a[j]} right to position ${j+1}` });
      j--;
    }
    a[j + 1] = key;
    frames.push({ type: 'sorted', indices: [...Array(i + 1).keys()], arr: [...a],
      msg: `Inserted ${key} at position ${j+1}` });
  }
  return frames;
}

/** Merge Sort */
function getMergeFrames(arr) {
  const a = [...arr], n = a.length, frames = [];

  function mergeHelper(l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    mergeHelper(l, m);
    mergeHelper(m + 1, r);
    // Merge step
    const left  = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      frames.push({ type: 'compare', indices: [l + i, m + 1 + j], arr: [...a],
        msg: `Merging [${l}..${m}] and [${m+1}..${r}]: comparing ${left[i]} vs ${right[j]}` });
      if (left[i] <= right[j]) { a[k++] = left[i++]; }
      else                     { a[k++] = right[j++]; }
      frames.push({ type: 'overwrite', indices: [k - 1], arr: [...a],
        msg: `Placed ${a[k-1]} at position ${k-1}` });
    }
    while (i < left.length)  { a[k++] = left[i++];  frames.push({ type: 'overwrite', indices: [k-1], arr: [...a], msg: `Copied ${a[k-1]}` }); }
    while (j < right.length) { a[k++] = right[j++]; frames.push({ type: 'overwrite', indices: [k-1], arr: [...a], msg: `Copied ${a[k-1]}` }); }
    for (let x = l; x <= r; x++)
      frames.push({ type: 'sorted', indices: [x], arr: [...a],
        msg: `Subarray [${l}..${r}] merged and sorted` });
  }

  mergeHelper(0, n - 1);
  return frames;
}

/** Quick Sort */
function getQuickFrames(arr) {
  const a = [...arr], n = a.length, frames = [];

  function partition(lo, hi) {
    const pivot = a[hi];
    frames.push({ type: 'pivot', indices: [hi], arr: [...a],
      msg: `Pivot = ${pivot} (index ${hi})` });
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      frames.push({ type: 'compare', indices: [j, hi], arr: [...a],
        msg: `Comparing a[${j}]=${a[j]} with pivot=${pivot}` });
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          frames.push({ type: 'swap', indices: [i, j], arr: [...a],
            msg: `Swapping a[${i}]=${a[i]} ↔ a[${j}]=${a[j]}` });
        }
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    frames.push({ type: 'swap', indices: [i + 1, hi], arr: [...a],
      msg: `Pivot ${pivot} placed at final position ${i+1}` });
    frames.push({ type: 'sorted', indices: [i + 1], arr: [...a],
      msg: `a[${i+1}]=${pivot} is in its final sorted position` });
    return i + 1;
  }

  function qs(lo, hi) {
    if (lo < hi) {
      const pi = partition(lo, hi);
      qs(lo, pi - 1);
      qs(pi + 1, hi);
    } else if (lo === hi) {
      frames.push({ type: 'sorted', indices: [lo], arr: [...a],
        msg: `Single element a[${lo}]=${a[lo]} is already sorted` });
    }
  }

  qs(0, n - 1);
  return frames;
}

/** Counting Sort */
function getCountingFrames(arr) {
  const a = [...arr], n = a.length, frames = [];
  const max   = Math.max(...a);
  const count = new Array(max + 1).fill(0);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    count[a[i]]++;
    frames.push({ type: 'compare', indices: [i], arr: [...a],
      msg: `Counting: a[${i}]=${a[i]} → count[${a[i]}]=${count[a[i]]}` });
  }

  // Reconstruct
  let idx = 0;
  for (let v = 0; v <= max; v++) {
    while (count[v]-- > 0) {
      a[idx] = v;
      frames.push({ type: 'overwrite', indices: [idx], arr: [...a],
        msg: `Placing value ${v} at position ${idx}` });
      frames.push({ type: 'sorted', indices: [idx], arr: [...a],
        msg: `a[${idx}] = ${v} (sorted)` });
      idx++;
    }
  }
  return frames;
}

function buildBars(arrData) {
  const container = document.getElementById('bar-container');
  container.innerHTML = '';
  arrData.forEach(() => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    container.appendChild(bar);
  });
  renderBars(arrData, null);
  document.getElementById('arrSizeDisplay').textContent = arrData.length;
  document.getElementById('arrayDisplay').textContent   = arrData.join(', ');
}

function renderBars(arrData, highlights) {
  const container = document.getElementById('bar-container');
  const bars      = container.querySelectorAll('.bar');
  const max       = Math.max(...arrData);

  bars.forEach((bar, i) => {
    bar.style.height = ((arrData[i] / max) * 100) + '%';
    bar.className = 'bar';
    if (!highlights) return;

    if      (highlights.sorted  && highlights.sorted.has(i))  bar.classList.add('sorted');
    else if (highlights.swap    && highlights.swap.has(i))    bar.classList.add('swapping');
    else if (highlights.compare && highlights.compare.has(i)) bar.classList.add('comparing');
    else if (highlights.pivot   && highlights.pivot.has(i))   bar.classList.add('pivot');
    else if (highlights.active  && highlights.active.has(i))  bar.classList.add('active');
  });
}

function applyFrame(frame) {
  const preserved = new Set(sortedIndices); 
  const highlights = { sorted: new Set(preserved) };

  switch (frame.type) {
    case 'compare':
      highlights.compare = new Set(frame.indices);
      comparisons++;
      document.getElementById('compCount').textContent = comparisons;
      break;
    case 'swap':
      highlights.swap = new Set(frame.indices);
      swaps++;
      document.getElementById('swapCount').textContent = swaps;
      break;
    case 'sorted':
      frame.indices.forEach(i => sortedIndices.add(i));
      highlights.sorted = new Set(sortedIndices);
      break;
    case 'pivot':
      highlights.pivot = new Set(frame.indices);
      break;
    case 'overwrite':
      highlights.active = new Set(frame.indices);
      break;
  }

  renderBars(frame.arr, highlights);
  document.getElementById('stepInfo').textContent = frame.msg || '';
}

function runNext() {
  if (!isRunning || isPaused) return;
  if (animIdx >= animations.length) {
    finishSort();
    return;
  }
  applyFrame(animations[animIdx]);
  animIdx++;
  animTimer = setTimeout(runNext, SPEEDS[currentSpeed]);
}

function startSort() {
  if (isRunning) return;
  if (!array.length) { showToast('No array loaded!', 'error'); return; }

  sortedIndices.clear();
  comparisons = 0;
  swaps       = 0;
  document.getElementById('compCount').textContent = '0';
  document.getElementById('swapCount').textContent = '0';

  buildBars(array);

  const GEN = {
    bubble:    getBubbleFrames,
    selection: getSelectionFrames,
    insertion: getInsertionFrames,
    merge:     getMergeFrames,
    quick:     getQuickFrames,
    counting:  getCountingFrames
  };
  animations = GEN[currentAlgo]([...array]);
  animIdx    = 0;
  isRunning  = true;
  isPaused   = false;

  setUIState('running');
  setStatus('running', `Sorting with ${ALGO_INFO[currentAlgo].name}…`);
  logSort(currentAlgo, array.length);
  runNext();
}

function pauseResume() {
  if (!isRunning) return;
  if (isPaused) {
    isPaused = false;
    document.getElementById('pauseBtn').textContent = '⏸ Pause';
    setStatus('running', `Resuming ${ALGO_INFO[currentAlgo].name}…`);
    runNext();
  } else {
    isPaused = true;
    clearTimeout(animTimer);
    document.getElementById('pauseBtn').textContent = '▶ Resume';
    setStatus('paused', 'Paused — click Resume to continue');
  }
}

function stepMode() {
  if (isRunning && !isPaused) {
    isPaused = true;
    clearTimeout(animTimer);
    document.getElementById('pauseBtn').textContent = '▶ Resume';
    setStatus('paused', 'Step mode active');
  }

  if (!isRunning) {
    if (!array.length) { showToast('No array loaded!', 'error'); return; }
    sortedIndices.clear();
    comparisons = 0;
    swaps       = 0;
    buildBars(array);
    const GEN = {
      bubble:    getBubbleFrames,
      selection: getSelectionFrames,
      insertion: getInsertionFrames,
      merge:     getMergeFrames,
      quick:     getQuickFrames,
      counting:  getCountingFrames
    };
    animations = GEN[currentAlgo]([...array]);
    animIdx    = 0;
    isRunning  = true;
    isPaused   = true;
    setUIState('running');
    document.getElementById('pauseBtn').textContent = '▶ Resume';
  }

  if (animIdx >= animations.length) { finishSort(); return; }
  applyFrame(animations[animIdx++]);
  setStatus('paused', `Step ${animIdx} / ${animations.length} — press ⏭ for next`);
}

function finishSort() {
  isRunning = false;
  isPaused  = false;
  clearTimeout(animTimer);

  array.forEach((_, i) => sortedIndices.add(i));
  const last = animations[animations.length - 1];
  if (last) renderBars(last.arr, { sorted: new Set(sortedIndices) });

  setUIState('idle');
  setStatus('done', `✓ Done — ${comparisons} comparisons, ${swaps} swaps`);
  showToast(`✓ Sorted! ${comparisons} comparisons, ${swaps} swaps`, 'success');
}

function resetAll() {
  clearTimeout(animTimer);
  isRunning  = false;
  isPaused   = false;
  animations = [];
  animIdx    = 0;
  comparisons = 0;
  swaps       = 0;
  sortedIndices.clear();

  document.getElementById('compCount').textContent      = '0';
  document.getElementById('swapCount').textContent      = '0';
  document.getElementById('pauseBtn').textContent       = '⏸ Pause';
  document.getElementById('stepInfo').textContent       = 'Step-by-step mode: click ⏭ Step to advance one step at a time.';

  buildBars(array);
  setUIState('idle');
  setStatus('idle', 'Ready — select algorithm and press Start');
}

function setUIState(state) {
  const running = (state === 'running');
  document.getElementById('startBtn').disabled    = running;
  document.getElementById('pauseBtn').disabled    = !running;
  document.getElementById('applyBtn').disabled    = running;
  document.getElementById('generateBtn').disabled = running;
  document.getElementById('customArray').disabled = running;
  document.getElementById('sizeRange').disabled   = running;
  document.querySelectorAll('.algo-btn').forEach(b => b.disabled = running);
}

function setStatus(state, msg) {
  const dot  = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  dot.className  = 'status-dot';
  if (state === 'running') dot.classList.add('running');
  if (state === 'done')    dot.classList.add('done');
  if (state === 'paused')  dot.classList.add('paused');
  text.textContent = msg;
}

function generateRandom() {
  const size = parseInt(document.getElementById('sizeRange').value);
  array = Array.from({ length: size },
    () => Math.floor(Math.random() * 95) + 5);
  buildBars(array);
  resetAll();
  showToast(`Generated ${size} random elements`);
}

function applyCustomArray() {
  const raw = document.getElementById('customArray').value.trim();
  if (!raw) { showToast('Please enter values', 'error'); return; }

  const parsed = raw
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n) && n > 0 && n <= 999);

  if (parsed.length < 2)  { showToast('Enter at least 2 valid numbers (1–999)', 'error'); return; }
  if (parsed.length > 100) { showToast('Max 100 elements for custom input', 'error'); return; }

  array = parsed;
  buildBars(array);
  resetAll();
  showToast(`Loaded ${array.length} elements`);
}

function updateSizeDisplay(val) {
  document.getElementById('sizeDisplay').textContent = val;
}

function selectAlgo(algo) {
  if (isRunning) return;
  currentAlgo = algo;

  document.querySelectorAll('.algo-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.algo === algo));

  const info = ALGO_INFO[algo];
  document.getElementById('algoTitle').textContent = info.name;
  document.getElementById('cBest').textContent     = info.best;
  document.getElementById('cAvg').textContent      = info.avg;
  document.getElementById('cWorst').textContent    = info.worst;
  document.getElementById('cSpace').textContent    = info.space;
  document.getElementById('algoDesc').textContent  = info.desc;

  renderCode();
}

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.lang === lang));
  renderCode();
}

function renderCode() {
  const block = document.getElementById('codeBlock');
  const html  = CODE[currentAlgo]?.[currentLang]
              || '<span class="cm">// Code not available for this combination</span>';

  const lines = html.split('\n');
  block.innerHTML = lines
    .map((line, i) => `<span class="code-line" id="cl-${i}">${line || ' '}</span>`)
    .join('\n');
}

function saveArray() {
  if (!array.length) { showToast('No array to save', 'error'); return; }
  try {
    const store = JSON.parse(localStorage.getItem('vs_saved') || '[]');
    store.push({ arr: array, ts: Date.now(), algo: currentAlgo });
    if (store.length > 5) store.shift();       // keep last 5
    localStorage.setItem('vs_saved', JSON.stringify(store));
    updateSavedInfo();
    showToast('Array saved!', 'success');
  } catch (e) { showToast('Save failed (storage unavailable)', 'error'); }
}

function loadArray() {
  try {
    const store = JSON.parse(localStorage.getItem('vs_saved') || '[]');
    if (!store.length) { showToast('No saved arrays found', 'error'); return; }
    const last = store[store.length - 1];
    array = last.arr;
    buildBars(array);
    resetAll();
    showToast(
      `Loaded ${array.length} elements  (saved ${new Date(last.ts).toLocaleTimeString()})`,
      'success'
    );
  } catch (e) { showToast('Load failed', 'error'); }
}

function clearSaved() {
  localStorage.removeItem('vs_saved');
  updateSavedInfo();
  showToast('Saved arrays cleared');
}

function updateSavedInfo() {
  try {
    const store = JSON.parse(localStorage.getItem('vs_saved') || '[]');
    document.getElementById('savedInfo').textContent =
      store.length ? `${store.length} array(s) saved` : 'No saved arrays';
  } catch (e) {}
}

function logSort(algo, size) {
  const log   = document.getElementById('sortLog');
  const entry = document.createElement('span');
  entry.style.color   = 'var(--accent-cyan)';
  entry.textContent   = `[${new Date().toLocaleTimeString()}] ${ALGO_INFO[algo].name} · n=${size}`;

  const placeholder = log.querySelector('.log-placeholder');
  if (placeholder) placeholder.remove();
  log.insertBefore(entry, log.firstChild);
  if (log.children.length > 10) log.lastChild.remove();
}

async function runComparison() {
  if (isRunning) { showToast('Wait for the current sort to finish', 'error'); return; }
  if (!array.length) { showToast('No array loaded', 'error'); return; }

  showToast('Benchmarking all algorithms…');

  const GEN = {
    bubble:    getBubbleFrames,
    selection: getSelectionFrames,
    insertion: getInsertionFrames,
    merge:     getMergeFrames,
    quick:     getQuickFrames,
    counting:  getCountingFrames
  };

  const results = {};
  for (const algo of Object.keys(GEN)) {
    const t0       = performance.now();
    GEN[algo]([...array]);
    results[algo] = +(performance.now() - t0).toFixed(3);
  }

  compResults = results;
  renderCompareChart(results);
  showToast('Comparison complete!', 'success');
}

function renderCompareChart(results) {
  const chart  = document.getElementById('compareChart');
  chart.innerHTML = '';
  const maxVal = Math.max(...Object.values(results), 0.001);

  Object.keys(ALGO_INFO).forEach(algo => {
    const ms  = results[algo] || 0;
    const pct = (ms / maxVal) * 100;

    const row = document.createElement('div');
    row.className = 'compare-row';
    row.innerHTML = `
      <span class="compare-name">${ALGO_INFO[algo].name.replace(' Sort', '')}</span>
      <div class="compare-bar-outer">
        <div class="compare-bar-inner" style="width:${pct}%">
          ${pct > 22 ? `<span class="compare-time">${ms}ms</span>` : ''}
        </div>
      </div>
      <span class="compare-time-label">${ms}ms</span>
    `;
    chart.appendChild(row);
  });
}

function setSpeed(s) {
  currentSpeed = s;
  document.querySelectorAll('.speed-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.speed === s));
}

function toggleTheme() {
  lightMode = !lightMode;
  document.body.classList.toggle('light-mode', lightMode);
  document.getElementById('themeToggle').textContent =
    lightMode ? '🌙 Dark Mode' : '☀️ Light Mode';
}

let toastTimer;
function showToast(msg, type) {
  const t     = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ''; }, 2800);
}

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;  // don't intercept typing

  if (e.code === 'Space') {
    e.preventDefault();
    isRunning ? pauseResume() : startSort();
  }
  if (e.code === 'KeyR') resetAll();
  if (e.code === 'ArrowRight')         stepMode();
});

function init() {
  generateRandom();   // generate initial random array
  renderCode();       // populate code block
  updateSavedInfo();  // show saved array count
  setUIState('idle');
  setStatus('idle', 'Ready — select algorithm and press Start');
}

init();