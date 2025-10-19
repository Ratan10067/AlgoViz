// Algorithm implementations in different programming languages

// Bubble Sort
export const bubbleSort = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

pair<vector<int>, pair<int, int>> bubbleSort(vector<int> arr) {
  int n = arr.size();
  int comparisons = 0;
  int swaps = 0;
  
  for (int i = 0; i < n - 1; i++) {           // Line 6
    bool swapped = false;                      // Line 7
    
    for (int j = 0; j < n - i - 1; j++) {     // Line 9
      comparisons++;                           // Line 10
      
      if (arr[j] > arr[j + 1]) {              // Line 12
        // Swap elements
        swap(arr[j], arr[j + 1]);             // Line 14
        swapped = true;                        // Line 15
        swaps++;                               // Line 16
      }
    }
    
    if (!swapped) break;                       // Line 20
  }
  
  return {arr, {comparisons, swaps}};          // Line 23
}`,

  python: `def bubble_sort(arr):
    n = len(arr)
    comparisons = 0
    swaps = 0
    
    for i in range(n - 1):                # Line 6
        swapped = False                   # Line 7
        
        for j in range(n - i - 1):        # Line 9
            comparisons += 1              # Line 10
            
            if arr[j] > arr[j + 1]:      # Line 12
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # Line 14
                swapped = True            # Line 15
                swaps += 1                # Line 16
            
        if not swapped:                   # Line 20
            break
    
    return arr, comparisons, swaps        # Line 23`,

  javascript: `function bubbleSort(arr) {
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {           // Line 6
    let swapped = false;                      // Line 7
    
    for (let j = 0; j < n - i - 1; j++) {    // Line 9
      comparisons++;                          // Line 10
      
      if (arr[j] > arr[j + 1]) {             // Line 12
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Line 14
        swapped = true;                       // Line 15
        swaps++;                              // Line 16
      }
    }
    
    if (!swapped) break;                      // Line 20
  }
  
  return { sortedArray: arr, comparisons, swaps }; // Line 23
}`
};

// Quick Sort
export const quickSort = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int partition(vector<int>& arr, int low, int high, int& comparisons, int& swaps) {
  int pivot = arr[high];                   // Line 5
  int i = (low - 1);                       // Line 6
  
  for (int j = low; j <= high - 1; j++) {  // Line 8
    comparisons++;                          // Line 9
    if (arr[j] < pivot) {                  // Line 10
      i++;                                 // Line 11
      swap(arr[i], arr[j]);                // Line 12
      swaps++;                             // Line 13
    }
  }
  swap(arr[i + 1], arr[high]);             // Line 16
  swaps++;                                 // Line 17
  return (i + 1);                          // Line 18
}

void quickSortHelper(vector<int>& arr, int low, int high, int& comparisons, int& swaps) {
  if (low < high) {                        // Line 22
    int pi = partition(arr, low, high, comparisons, swaps); // Line 23
    
    quickSortHelper(arr, low, pi - 1, comparisons, swaps);  // Line 25
    quickSortHelper(arr, pi + 1, high, comparisons, swaps); // Line 26
  }
}

pair<vector<int>, pair<int, int>> quickSort(vector<int> arr) {
  int comparisons = 0;
  int swaps = 0;
  
  quickSortHelper(arr, 0, arr.size() - 1, comparisons, swaps);
  
  return {arr, {comparisons, swaps}};
}`,

  python: `def quick_sort(arr):
    comparisons = 0
    swaps = 0
    
    def partition(arr, low, high):
        nonlocal comparisons, swaps
        pivot = arr[high]                   # Line 5
        i = low - 1                         # Line 6
        
        for j in range(low, high):          # Line 8
            comparisons += 1                # Line 9
            if arr[j] < pivot:              # Line 10
                i += 1                      # Line 11
                arr[i], arr[j] = arr[j], arr[i]  # Line 12
                swaps += 1                  # Line 13
                
        arr[i + 1], arr[high] = arr[high], arr[i + 1]  # Line 16
        swaps += 1                          # Line 17
        return i + 1                        # Line 18
    
    def quick_sort_helper(arr, low, high):
        if low < high:                      # Line 22
            pi = partition(arr, low, high)  # Line 23
            
            quick_sort_helper(arr, low, pi - 1)  # Line 25
            quick_sort_helper(arr, pi + 1, high) # Line 26
    
    # Create a copy of the array to avoid modifying the original
    arr_copy = arr.copy()
    quick_sort_helper(arr_copy, 0, len(arr_copy) - 1)
    
    return arr_copy, comparisons, swaps`,

  javascript: `function quickSort(arr) {
  let comparisons = 0;
  let swaps = 0;
  
  function partition(arr, low, high) {
    const pivot = arr[high];                  // Line 5
    let i = low - 1;                          // Line 6
    
    for (let j = low; j < high; j++) {        // Line 8
      comparisons++;                          // Line 9
      if (arr[j] < pivot) {                   // Line 10
        i++;                                  // Line 11
        [arr[i], arr[j]] = [arr[j], arr[i]];  // Line 12
        swaps++;                              // Line 13
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Line 16
    swaps++;                                  // Line 17
    return i + 1;                             // Line 18
  }
  
  function quickSortHelper(arr, low, high) {
    if (low < high) {                         // Line 22
      const pi = partition(arr, low, high);   // Line 23
      
      quickSortHelper(arr, low, pi - 1);      // Line 25
      quickSortHelper(arr, pi + 1, high);     // Line 26
    }
  }
  
  // Create a copy of the array to avoid modifying the original
  const arrCopy = [...arr];
  quickSortHelper(arrCopy, 0, arrCopy.length - 1);
  
  return { sortedArray: arrCopy, comparisons, swaps };
}`
};

// Merge Sort
export const mergeSort = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right, int& comparisons, int& merges) {
  int n1 = mid - left + 1;
  int n2 = right - mid;
  
  // Create temporary arrays
  vector<int> L(n1), R(n2);
  
  // Copy data to temporary arrays
  for (int i = 0; i < n1; i++)
    L[i] = arr[left + i];
  for (int j = 0; j < n2; j++)
    R[j] = arr[mid + 1 + j];
  
  // Merge the temporary arrays back
  int i = 0, j = 0, k = left;
  
  while (i < n1 && j < n2) {
    comparisons++;
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
    merges++;
  }
  
  // Copy remaining elements
  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
    merges++;
  }
  
  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
    merges++;
  }
}

void mergeSortHelper(vector<int>& arr, int left, int right, int& comparisons, int& merges) {
  if (left < right) {
    int mid = left + (right - left) / 2;
    
    // Sort first and second halves
    mergeSortHelper(arr, left, mid, comparisons, merges);
    mergeSortHelper(arr, mid + 1, right, comparisons, merges);
    
    // Merge the sorted halves
    merge(arr, left, mid, right, comparisons, merges);
  }
}

pair<vector<int>, pair<int, int>> mergeSort(vector<int> arr) {
  int comparisons = 0;
  int merges = 0;
  
  mergeSortHelper(arr, 0, arr.size() - 1, comparisons, merges);
  
  return {arr, {comparisons, merges}};
}`,

  python: `def merge_sort(arr):
    comparisons = 0
    merges = 0
    
    def merge(arr, left, mid, right):
        nonlocal comparisons, merges
        n1 = mid - left + 1
        n2 = right - mid
        
        # Create temporary arrays
        L = [0] * n1
        R = [0] * n2
        
        # Copy data to temporary arrays
        for i in range(n1):
            L[i] = arr[left + i]
        for j in range(n2):
            R[j] = arr[mid + 1 + j]
        
        # Merge the temporary arrays back
        i = 0
        j = 0
        k = left
        
        while i < n1 and j < n2:
            comparisons += 1
            if L[i] <= R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
            merges += 1
        
        # Copy remaining elements
        while i < n1:
            arr[k] = L[i]
            i += 1
            k += 1
            merges += 1
        
        while j < n2:
            arr[k] = R[j]
            j += 1
            k += 1
            merges += 1
    
    def merge_sort_helper(arr, left, right):
        if left < right:
            mid = left + (right - left) // 2
            
            # Sort first and second halves
            merge_sort_helper(arr, left, mid)
            merge_sort_helper(arr, mid + 1, right)
            
            # Merge the sorted halves
            merge(arr, left, mid, right)
    
    # Create a copy of the array to avoid modifying the original
    arr_copy = arr.copy()
    merge_sort_helper(arr_copy, 0, len(arr_copy) - 1)
    
    return arr_copy, comparisons, merges`,

  javascript: `function mergeSort(arr) {
  let comparisons = 0;
  let merges = 0;
  
  function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    // Create temporary arrays
    const L = new Array(n1);
    const R = new Array(n2);
    
    // Copy data to temporary arrays
    for (let i = 0; i < n1; i++)
      L[i] = arr[left + i];
    for (let j = 0; j < n2; j++)
      R[j] = arr[mid + 1 + j];
    
    // Merge the temporary arrays back
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      comparisons++;
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      k++;
      merges++;
    }
    
    // Copy remaining elements
    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
      merges++;
    }
    
    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
      merges++;
    }
  }
  
  function mergeSortHelper(arr, left, right) {
    if (left < right) {
      const mid = Math.floor(left + (right - left) / 2);
      
      // Sort first and second halves
      mergeSortHelper(arr, left, mid);
      mergeSortHelper(arr, mid + 1, right);
      
      // Merge the sorted halves
      merge(arr, left, mid, right);
    }
  }
  
  // Create a copy of the array to avoid modifying the original
  const arrCopy = [...arr];
  mergeSortHelper(arrCopy, 0, arrCopy.length - 1);
  
  return { sortedArray: arrCopy, comparisons, merges };
}`
};

// BFS
export const bfs = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

unordered_map<int, int> bfs(const unordered_map<int, vector<int>>& graph, int start) {
  unordered_set<int> visited;
  queue<int> queue;
  unordered_map<int, int> distances;
  
  queue.push(start);                        // Initialize queue with start node
  distances[start] = 0;                     // Distance to start is 0
  
  while (!queue.empty()) {                  // Line 6
    int current = queue.front();            // Line 6
    queue.pop();                            // Line 6
    
    if (visited.find(current) == visited.end()) {  // Line 8
      visited.insert(current);                     // Line 9
      
      for (int neighbor : graph.at(current)) {     // Line 11
        if (visited.find(neighbor) == visited.end() &&
            find(queue.front(), queue.back(), neighbor) == queue.back()) {  // Line 13
          queue.push(neighbor);                    // Line 14
          distances[neighbor] = distances[current] + 1;  // Line 15
        }
      }
    }
  }
  
  return distances;                         // Line 21
}`,

  python: `def bfs(graph, start):
    visited = set()
    queue = [start]
    distances = {start: 0}

    while queue:                            # Line 6
        current = queue.pop(0)              # Line 6
        
        if current not in visited:          # Line 8
            visited.add(current)            # Line 9
            
            for neighbor in graph[current]: # Line 11
                if neighbor not in visited and neighbor not in queue:  # Line 13
                    queue.append(neighbor)  # Line 14
                    distances[neighbor] = distances[current] + 1  # Line 15
    
    return distances                        # Line 21`,

  javascript: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const distances = { [start]: 0 };

  while (queue.length > 0) {
    const current = queue.shift();             // Line 6
    
    if (!visited.has(current)) {               // Line 8
      visited.add(current);                    // Line 9
      
      for (const neighbor of graph[current]) { // Line 11
        if (!visited.has(neighbor) &&
            !queue.includes(neighbor)) {       // Line 13
          queue.push(neighbor);                // Line 14
          distances[neighbor] = distances[current] + 1; // Line 15
        }
      }
    }
  }
  
  return distances;                            // Line 21
}`
};

// Binary Search
export const binarySearch = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int binarySearch(vector<int> arr, int target) {
  int left = 0;                             // Line 1
  int right = arr.size() - 1;               // Line 2
  
  while (left <= right) {                   // Line 3
    int mid = left + (right - left) / 2;    // Line 4
    
    if (arr[mid] == target) {               // Line 5
      return mid;                           // Line 6
    } else if (arr[mid] < target) {         // Line 7
      left = mid + 1;                       // Line 8
    } else {                                // Line 9
      right = mid - 1;                      // Line 10
    }
  }
  
  return -1;                                // Line 11
}`,

  python: `def binary_search(arr, target):
    left = 0                                # Line 1
    right = len(arr) - 1                    # Line 2
    
    while left <= right:                    # Line 3
        mid = left + (right - left) // 2    # Line 4
        
        if arr[mid] == target:              # Line 5
            return mid                      # Line 6
        elif arr[mid] < target:             # Line 7
            left = mid + 1                  # Line 8
        else:                               # Line 9
            right = mid - 1                 # Line 10
    
    return -1                               # Line 11`,

  javascript: `function binarySearch(arr, target) {
  let left = 0;                             // Line 1
  let right = arr.length - 1;               // Line 2
  
  while (left <= right) {                   // Line 3
    const mid = Math.floor(left + (right - left) / 2);  // Line 4
    
    if (arr[mid] === target) {              // Line 5
      return mid;                           // Line 6
    } else if (arr[mid] < target) {         // Line 7
      left = mid + 1;                       // Line 8
    } else {                                // Line 9
      right = mid - 1;                      // Line 10
    }
  }
  
  return -1;                                // Line 11
}`
};

// Linear Search
export const linearSearch = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int linearSearch(vector<int> arr, int target) {
  for (int i = 0; i < arr.size(); i++) {    // Line 1
    if (arr[i] == target) {                 // Line 3
      return i;                             // Line 4
    }                                       // Line 6
  }
  return -1;                                // Line 7
}`,

  python: `def linear_search(arr, target):
    for i in range(len(arr)):               # Line 1
        if arr[i] == target:                # Line 3
            return i                        # Line 4
                                            # Line 6
    return -1                               # Line 7`,

  javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {   // Line 1
    if (arr[i] === target) {                // Line 3
      return i;                             // Line 4
    }                                       // Line 6
  }
  return -1;                                // Line 7
}`
};

// Heap Sort
export const heapSort = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

void heapify(vector<int>& arr, int n, int i) {
  int largest = i;                          // Line 1
  int left = 2 * i + 1;                     // Line 2
  int right = 2 * i + 2;                    // Line 3
  
  if (left < n && arr[left] > arr[largest]) // Line 7
    largest = left;                         // Line 8
    
  if (right < n && arr[right] > arr[largest]) // Line 11
    largest = right;                        // Line 12
    
  if (largest != i) {                       // Line 15
    swap(arr[i], arr[largest]);             // Line 16
    heapify(arr, n, largest);               // Line 17
  }
}

void heapSort(vector<int>& arr) {
  int n = arr.size();
  
  // Build heap                             // Line 3
  for (int i = n / 2 - 1; i >= 0; i--)     // Line 4
    heapify(arr, n, i);
    
  // Extract elements from heap            // Line 6
  for (int i = n - 1; i > 0; i--) {        // Line 7
    swap(arr[0], arr[i]);                   // Line 8
    heapify(arr, i, 0);                     // Line 9
  }
}`,

  python: `def heapify(arr, n, i):
    largest = i                             # Line 1
    left = 2 * i + 1                        # Line 2
    right = 2 * i + 2                       # Line 3
    
    if left < n and arr[left] > arr[largest]:  # Line 7
        largest = left                      # Line 8
        
    if right < n and arr[right] > arr[largest]:  # Line 11
        largest = right                     # Line 12
        
    if largest != i:                        # Line 15
        arr[i], arr[largest] = arr[largest], arr[i]  # Line 16
        heapify(arr, n, largest)            # Line 17

def heap_sort(arr):
    n = len(arr)
    
    # Build heap                           # Line 3
    for i in range(n // 2 - 1, -1, -1):    # Line 4
        heapify(arr, n, i)
        
    # Extract elements from heap          # Line 6
    for i in range(n - 1, 0, -1):          # Line 7
        arr[0], arr[i] = arr[i], arr[0]     # Line 8
        heapify(arr, i, 0)                  # Line 9`,

  javascript: `function heapify(arr, n, i) {
  let largest = i;                          // Line 1
  let left = 2 * i + 1;                     // Line 2
  let right = 2 * i + 2;                    // Line 3
  
  if (left < n && arr[left] > arr[largest]) // Line 7
    largest = left;                         // Line 8
    
  if (right < n && arr[right] > arr[largest]) // Line 11
    largest = right;                        // Line 12
    
  if (largest !== i) {                      // Line 15
    [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Line 16
    heapify(arr, n, largest);               // Line 17
  }
}

function heapSort(arr) {
  const n = arr.length;
  
  // Build heap                            // Line 3
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) // Line 4
    heapify(arr, n, i);
    
  // Extract elements from heap           // Line 6
  for (let i = n - 1; i > 0; i--) {        // Line 7
    [arr[0], arr[i]] = [arr[i], arr[0]];    // Line 8
    heapify(arr, i, 0);                     // Line 9
  }
}`
};

// Tree Traversal
export const treeTraversal = {
  cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Inorder Traversal: Left -> Root -> Right
void inorderTraversal(TreeNode* root) {
    if (root == nullptr) return;            // Line 1
    
    inorderTraversal(root->left);           // Line 2
    cout << root->val << " ";               // Line 3
    inorderTraversal(root->right);          // Line 4
}

// Preorder Traversal: Root -> Left -> Right  
void preorderTraversal(TreeNode* root) {
    if (root == nullptr) return;            // Line 1
    
    cout << root->val << " ";               // Line 2
    preorderTraversal(root->left);          // Line 3
    preorderTraversal(root->right);         // Line 4
}

// Postorder Traversal: Left -> Right -> Root
void postorderTraversal(TreeNode* root) {
    if (root == nullptr) return;            // Line 1
    
    postorderTraversal(root->left);         // Line 2
    postorderTraversal(root->right);        // Line 3
    cout << root->val << " ";               // Line 4
}`,

  python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Inorder Traversal: Left -> Root -> Right
def inorder_traversal(root):
    if not root:                            # Line 1
        return
    
    inorder_traversal(root.left)            # Line 2
    print(root.val, end=" ")                # Line 3
    inorder_traversal(root.right)           # Line 4

# Preorder Traversal: Root -> Left -> Right
def preorder_traversal(root):
    if not root:                            # Line 1
        return
        
    print(root.val, end=" ")                # Line 2
    preorder_traversal(root.left)           # Line 3
    preorder_traversal(root.right)          # Line 4

# Postorder Traversal: Left -> Right -> Root
def postorder_traversal(root):
    if not root:                            # Line 1
        return
        
    postorder_traversal(root.left)          # Line 2
    postorder_traversal(root.right)         # Line 3
    print(root.val, end=" ")                # Line 4`,

  javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Inorder Traversal: Left -> Root -> Right
function inorderTraversal(root) {
  if (!root) return;                        // Line 1
  
  inorderTraversal(root.left);              // Line 2
  console.log(root.val);                    // Line 3
  inorderTraversal(root.right);             // Line 4
}

// Preorder Traversal: Root -> Left -> Right
function preorderTraversal(root) {
  if (!root) return;                        // Line 1
  
  console.log(root.val);                    // Line 2
  preorderTraversal(root.left);             // Line 3
  preorderTraversal(root.right);            // Line 4
}

// Postorder Traversal: Left -> Right -> Root
function postorderTraversal(root) {
  if (!root) return;                        // Line 1
  
  postorderTraversal(root.left);            // Line 2
  postorderTraversal(root.right);           // Line 3
  console.log(root.val);                    // Line 4
}`
};

// Fibonacci Sequence
export const fibonacci = {
  cpp: `// Iterative Approach - O(n) time, O(1) space
int fibonacciIterative(int n) {
    if (n <= 1) return n;                   // Line 1
    
    int a = 0, b = 1;                       // Line 2
    for (int i = 2; i <= n; i++) {          // Line 3
        int temp = a + b;                   // Line 4
        a = b;                              // Line 5
        b = temp;                           // Line 6
    }
    return b;                               // Line 7
}

// Recursive Approach - O(2^n) time, O(n) space
int fibonacciRecursive(int n) {
    if (n <= 1) return n;                   // Line 2
    return fibonacciRecursive(n-1) + fibonacciRecursive(n-2); // Line 4
}

// Dynamic Programming - O(n) time, O(n) space
int fibonacciDP(int n) {
    if (n <= 1) return n;                   // Line 1
    
    vector<int> dp(n + 1);                  // Line 2
    dp[0] = 0;                              // Line 2
    dp[1] = 1;                              // Line 3
    
    for (int i = 2; i <= n; i++) {          // Line 5
        dp[i] = dp[i-1] + dp[i-2];          // Line 5
    }
    return dp[n];                           // Line 6
}`,

  python: `# Iterative Approach - O(n) time, O(1) space
def fibonacci_iterative(n):
    if n <= 1:
        return n                            # Line 1
    
    a, b = 0, 1                             # Line 2
    for i in range(2, n + 1):               # Line 3
        temp = a + b                        # Line 4
        a = b                               # Line 5
        b = temp                            # Line 6
    return b                                # Line 7

# Recursive Approach - O(2^n) time, O(n) space
def fibonacci_recursive(n):
    if n <= 1:
        return n                            # Line 2
    return fibonacci_recursive(n-1) + fibonacci_recursive(n-2)  # Line 4

# Dynamic Programming - O(n) time, O(n) space
def fibonacci_dp(n):
    if n <= 1:
        return n                            # Line 1
    
    dp = [0] * (n + 1)                      # Line 2
    dp[0] = 0                               # Line 2
    dp[1] = 1                               # Line 3
    
    for i in range(2, n + 1):               # Line 5
        dp[i] = dp[i-1] + dp[i-2]           # Line 5
    return dp[n]                            # Line 6`,

  javascript: `// Iterative Approach - O(n) time, O(1) space
function fibonacciIterative(n) {
  if (n <= 1) return n;                     // Line 1
  
  let a = 0, b = 1;                         // Line 2
  for (let i = 2; i <= n; i++) {            // Line 3
    const temp = a + b;                     // Line 4
    a = b;                                  // Line 5
    b = temp;                               // Line 6
  }
  return b;                                 // Line 7
}

// Recursive Approach - O(2^n) time, O(n) space
function fibonacciRecursive(n) {
  if (n <= 1) return n;                     // Line 2
  return fibonacciRecursive(n-1) + fibonacciRecursive(n-2); // Line 4
}

// Dynamic Programming - O(n) time, O(n) space
function fibonacciDP(n) {
  if (n <= 1) return n;                     // Line 1
  
  const dp = new Array(n + 1);             // Line 2
  dp[0] = 0;                                // Line 2
  dp[1] = 1;                                // Line 3
  
  for (let i = 2; i <= n; i++) {            // Line 5
    dp[i] = dp[i-1] + dp[i-2];              // Line 5
  }
  return dp[n];                             // Line 6
}`
};

// Binary Search Tree
export const bst = {
  cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Insert operation
TreeNode* insert(TreeNode* root, int val) {
    if (root == nullptr) {                  // Line 2
        return new TreeNode(val);
    }
    
    if (val < root->val) {                  // Line 4
        root->left = insert(root->left, val);
    } else if (val > root->val) {           // Line 6
        root->right = insert(root->right, val);
    }
    return root;                            // Line 8
}

// Search operation
bool search(TreeNode* root, int val) {
    if (root == nullptr) return false;      // Line 2
    if (val == root->val) return true;      // Line 3
    
    if (val < root->val) {                  // Line 5
        return search(root->left, val);
    } else {                                // Line 7
        return search(root->right, val);
    }
}`,

  python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Insert operation
def insert(root, val):
    if not root:                            # Line 2
        return TreeNode(val)
    
    if val < root.val:                      # Line 4
        root.left = insert(root.left, val)
    elif val > root.val:                    # Line 6
        root.right = insert(root.right, val)
    return root                             # Line 8

# Search operation  
def search(root, val):
    if not root:                            # Line 2
        return False
    if val == root.val:                     # Line 3
        return True
        
    if val < root.val:                      # Line 5
        return search(root.left, val)
    else:                                   # Line 7
        return search(root.right, val)`,

  javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Insert operation
function insert(root, val) {
  if (!root) {                              // Line 2
    return new TreeNode(val);
  }
  
  if (val < root.val) {                     // Line 4
    root.left = insert(root.left, val);
  } else if (val > root.val) {              // Line 6
    root.right = insert(root.right, val);
  }
  return root;                              // Line 8
}

// Search operation
function search(root, val) {
  if (!root) return false;                  // Line 2
  if (val === root.val) return true;        // Line 3
  
  if (val < root.val) {                     // Line 5
    return search(root.left, val);
  } else {                                  // Line 7
    return search(root.right, val);
  }
}`
};

// AVL Tree  
export const avlTree = {
  cpp: `struct AVLNode {
    int val, height;
    AVLNode* left;
    AVLNode* right;
    AVLNode(int x) : val(x), height(1), left(nullptr), right(nullptr) {}
};

int getHeight(AVLNode* node) {              // Line 2
    return node ? node->height : 0;
}

int getBalance(AVLNode* node) {             // Line 5
    return node ? getHeight(node->left) - getHeight(node->right) : 0;
}

AVLNode* rotateRight(AVLNode* y) {          // Line 8
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    
    x->right = y;
    y->left = T2;
    
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    
    return x;
}`,

  python: `class AVLNode:
    def __init__(self, val):
        self.val = val
        self.height = 1
        self.left = None
        self.right = None

def get_height(node):                       # Line 2
    return node.height if node else 0

def get_balance(node):                      # Line 5
    return get_height(node.left) - get_height(node.right) if node else 0

def rotate_right(y):                        # Line 8
    x = y.left
    T2 = x.right
    
    x.right = y
    y.left = T2
    
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    
    return x`,

  javascript: `class AVLNode {
  constructor(val) {
    this.val = val;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

function getHeight(node) {                  // Line 2
  return node ? node.height : 0;
}

function getBalance(node) {                 // Line 5
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function rotateRight(y) {                   // Line 8
  const x = y.left;
  const T2 = x.right;
  
  x.right = y;
  y.left = T2;
  
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  
  return x;
}`
};

// Knapsack Problem
export const knapsack = {
  cpp: `int knapsack(int W, vector<int>& weights, vector<int>& values, int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    
    for (int i = 1; i <= n; i++) {            // Line 3
        for (int w = 1; w <= W; w++) {        // Line 4
            if (weights[i-1] <= w) {          // Line 5
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], 
                              dp[i-1][w]);    // Line 6
            } else {                          // Line 7
                dp[i][w] = dp[i-1][w];        // Line 8
            }
        }
    }
    
    return dp[n][W];                          // Line 12
}`,

  python: `def knapsack(W, weights, values, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    
    for i in range(1, n + 1):                 # Line 3
        for w in range(1, W + 1):             # Line 4
            if weights[i-1] <= w:             # Line 5
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], 
                              dp[i-1][w])     # Line 6
            else:                             # Line 7
                dp[i][w] = dp[i-1][w]         # Line 8
    
    return dp[n][W]                           # Line 11`,

  javascript: `function knapsack(W, weights, values, n) {
  const dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {              // Line 3
    for (let w = 1; w <= W; w++) {            // Line 4
      if (weights[i-1] <= w) {                // Line 5
        dp[i][w] = Math.max(values[i-1] + dp[i-1][w-weights[i-1]], 
                           dp[i-1][w]);       // Line 6
      } else {                                // Line 7
        dp[i][w] = dp[i-1][w];                // Line 8
      }
    }
  }
  
  return dp[n][W];                            // Line 12
}`
};

// Longest Common Subsequence
export const lcs = {
  cpp: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.length();
    int n = text2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {            // Line 5
        for (int j = 1; j <= n; j++) {        // Line 6
            if (text1[i-1] == text2[j-1]) {   // Line 7
                dp[i][j] = dp[i-1][j-1] + 1;  // Line 8
            } else {                          // Line 9
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]); // Line 10
            }
        }
    }
    
    return dp[m][n];                          // Line 14
}`,

  python: `def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):                 # Line 5
        for j in range(1, n + 1):             # Line 6
            if text1[i-1] == text2[j-1]:      # Line 7
                dp[i][j] = dp[i-1][j-1] + 1   # Line 8
            else:                             # Line 9
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]) # Line 10
    
    return dp[m][n]                           # Line 12`,

  javascript: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {              // Line 5
    for (let j = 1; j <= n; j++) {            // Line 6
      if (text1[i-1] === text2[j-1]) {        // Line 7
        dp[i][j] = dp[i-1][j-1] + 1;          // Line 8
      } else {                                // Line 9
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]); // Line 10
      }
    }
  }
  
  return dp[m][n];                            // Line 14
}`
};

// DFS
export const dfs = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

void dfsHelper(const unordered_map<int, vector<int>>& graph, 
               int current, 
               unordered_set<int>& visited,
               unordered_map<int, int>& discovery,
               int depth = 0) {
  
  visited.insert(current);                  // Line 6
  discovery[current] = depth;               // Line 7
  
  for (int neighbor : graph.at(current)) {  // Line 9
    if (visited.find(neighbor) == visited.end()) {  // Line 10
      dfsHelper(graph, neighbor, visited, discovery, depth + 1);  // Line 11
    }
  }
}

unordered_map<int, int> dfs(const unordered_map<int, vector<int>>& graph, int start) {
  unordered_set<int> visited;
  unordered_map<int, int> discovery;
  
  dfsHelper(graph, start, visited, discovery);
  
  return discovery;                         // Line 21
}`,

  python: `def dfs(graph, start):
    visited = set()
    discovery = {}
    
    def dfs_helper(current, depth=0):
        visited.add(current)                # Line 6
        discovery[current] = depth          # Line 7
        
        for neighbor in graph[current]:     # Line 9
            if neighbor not in visited:     # Line 10
                dfs_helper(neighbor, depth + 1)  # Line 11
    
    dfs_helper(start)
    return discovery                        # Line 21`,

  javascript: `function dfs(graph, start) {
  const visited = new Set();
  const discovery = {};
  
  function dfsHelper(current, depth = 0) {
    visited.add(current);                   // Line 6
    discovery[current] = depth;             // Line 7
    
    for (const neighbor of graph[current]) {  // Line 9
      if (!visited.has(neighbor)) {         // Line 10
        dfsHelper(neighbor, depth + 1);     // Line 11
      }
    }
  }
  
  dfsHelper(start);
  return discovery;                         // Line 21
}`
};

// Dijkstra's Algorithm
export const dijkstra = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

unordered_map<int, int> dijkstra(
    const unordered_map<int, vector<pair<int, int>>>& graph, 
    int start) {
  
  // Priority queue to store vertices that need to be processed
  // {distance, vertex}
  priority_queue<pair<int, int>, 
                 vector<pair<int, int>>, 
                 greater<pair<int, int>>> pq;
  
  // Map to store shortest distance from start to each vertex
  unordered_map<int, int> distances;
  
  // Initialize all distances as infinite
  for (const auto& entry : graph) {
    distances[entry.first] = numeric_limits<int>::max();
  }
  
  // Distance to the start vertex is 0
  distances[start] = 0;
  pq.push({0, start});
  
  while (!pq.empty()) {
    int u = pq.top().second;
    pq.pop();
    
    // For each adjacent vertex of u
    for (const auto& edge : graph.at(u)) {
      int v = edge.first;
      int weight = edge.second;
      
      // If there is a shorter path to v through u
      if (distances[u] != numeric_limits<int>::max() && 
          distances[u] + weight < distances[v]) {
        // Update distance of v
        distances[v] = distances[u] + weight;
        pq.push({distances[v], v});
      }
    }
  }
  
  return distances;
}`,

  python: `import heapq

def dijkstra(graph, start):
    # Priority queue to store vertices that need to be processed
    # (distance, vertex)
    pq = [(0, start)]
    
    # Dictionary to store shortest distance from start to each vertex
    distances = {}
    
    # Initialize all distances as infinite
    for vertex in graph:
        distances[vertex] = float('infinity')
    
    # Distance to the start vertex is 0
    distances[start] = 0
    
    while pq:
        # Get vertex with minimum distance
        current_distance, u = heapq.heappop(pq)
        
        # If we've already found a better path, skip
        if current_distance > distances[u]:
            continue
        
        # For each adjacent vertex of u
        for v, weight in graph[u]:
            # If there is a shorter path to v through u
            if distances[u] + weight < distances[v]:
                # Update distance of v
                distances[v] = distances[u] + weight
                heapq.heappush(pq, (distances[v], v))
    
    return distances`,

  javascript: `function dijkstra(graph, start) {
  // Priority queue implementation using an array
  // Each element is [distance, vertex]
  const pq = [[0, start]];
  
  // Map to store shortest distance from start to each vertex
  const distances = {};
  
  // Initialize all distances as infinite
  for (const vertex in graph) {
    distances[vertex] = Infinity;
  }
  
  // Distance to the start vertex is 0
  distances[start] = 0;
  
  while (pq.length > 0) {
    // Sort the priority queue to get the minimum distance vertex
    pq.sort((a, b) => a[0] - b[0]);
    
    // Get vertex with minimum distance
    const [currentDistance, u] = pq.shift();
    
    // If we've already found a better path, skip
    if (currentDistance > distances[u]) {
      continue;
    }
    
    // For each adjacent vertex of u
    for (const [v, weight] of graph[u]) {
      // If there is a shorter path to v through u
      if (distances[u] + weight < distances[v]) {
        // Update distance of v
        distances[v] = distances[u] + weight;
        pq.push([distances[v], v]);
      }
    }
  }
  
  return distances;
}`
}; 