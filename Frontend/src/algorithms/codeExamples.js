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