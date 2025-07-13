const codeExamples = require('./algorithms/codeExamples');
const { dijkstra, dfs, bfs, bubbleSort, mergeSort, quickSort } = codeExamples;

console.log('Testing code examples:');

// Test dijkstra
console.log('\nDijkstra:');
console.log('cpp type:', typeof dijkstra.cpp);
console.log('python type:', typeof dijkstra.python);
console.log('javascript type:', typeof dijkstra.javascript);
console.log('cpp starts with:', dijkstra.cpp.substring(0, 20));
console.log('python starts with:', dijkstra.python.substring(0, 20));
console.log('javascript starts with:', dijkstra.javascript.substring(0, 20));

// Test dfs
console.log('\nDFS:');
console.log('cpp type:', typeof dfs.cpp);
console.log('python type:', typeof dfs.python);
console.log('javascript type:', typeof dfs.javascript);
console.log('cpp starts with:', dfs.cpp.substring(0, 20));
console.log('python starts with:', dfs.python.substring(0, 20));
console.log('javascript starts with:', dfs.javascript.substring(0, 20));

// Test bfs
console.log('\nBFS:');
console.log('cpp type:', typeof bfs.cpp);
console.log('python type:', typeof bfs.python);
console.log('javascript type:', typeof bfs.javascript);
console.log('cpp starts with:', bfs.cpp.substring(0, 20));
console.log('python starts with:', bfs.python.substring(0, 20));
console.log('javascript starts with:', bfs.javascript.substring(0, 20));

// Test SimpleCodeBlock with null values
console.log('\nTesting with null values:');
try {
  const testString = null;
  console.log('Split result:', testString?.split('\n') || []);
} catch (error) {
  console.error('Error with null value:', error.message);
}

// Test SimpleCodeBlock with undefined values
console.log('\nTesting with undefined values:');
try {
  const testString = undefined;
  console.log('Split result:', testString?.split('\n') || []);
} catch (error) {
  console.error('Error with undefined value:', error.message);
} 