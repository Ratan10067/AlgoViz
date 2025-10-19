import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Binary, FileText, Archive, TreePine, Hash, Zap, ArrowRight, Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const HuffmanCoding = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Input state
  const [inputText, setInputText] = useState("HELLO WORLD");
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(700);
  
  // Algorithm state
  const [frequencies, setFrequencies] = useState({});
  const [huffmanTree, setHuffmanTree] = useState(null);
  const [huffmanCodes, setHuffmanCodes] = useState({});
  const [originalBits, setOriginalBits] = useState(0);
  const [compressedBits, setCompressedBits] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(0);
  
  // UI state
  const [activeRightTab, setActiveRightTab] = useState("stats");
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
    customButtons: null,
  });

  const handleBack = () => {
    setAlertConfig({
      isOpen: true,
      message: "Are you sure you want to go back? Any unsaved progress will be lost.",
      type: "warning",
      customButtons: [
        {
          label: "Stay",
          onClick: () => setAlertConfig({ isOpen: false }),
          variant: "secondary"
        },
        {
          label: "Go Back",
          onClick: () => {
            setAlertConfig({ isOpen: false });
            navigate("/");
          },
          variant: "destructive"
        }
      ]
    });
  };

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setPlaying(false);
    setStarted(false);
    setFrequencies({});
    setHuffmanTree(null);
    setHuffmanCodes({});
    setOriginalBits(0);
    setCompressedBits(0);
    setCompressionRatio(0);
    setCurrentHighlightedLine(null);
  };

  // Node class for Huffman tree
  class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
      this.char = char;
      this.freq = freq;
      this.left = left;
      this.right = right;
      this.id = Math.random().toString(36).substr(2, 9);
    }

    isLeaf() {
      return this.left === null && this.right === null;
    }
  }

  // Priority Queue implementation
  class MinHeap {
    constructor() {
      this.heap = [];
    }

    getParentIndex(index) {
      return Math.floor((index - 1) / 2);
    }

    getLeftChildIndex(index) {
      return 2 * index + 1;
    }

    getRightChildIndex(index) {
      return 2 * index + 2;
    }

    swap(index1, index2) {
      [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    heapifyUp(index) {
      const parentIndex = this.getParentIndex(index);
      if (parentIndex >= 0 && this.heap[parentIndex].freq > this.heap[index].freq) {
        this.swap(parentIndex, index);
        this.heapifyUp(parentIndex);
      }
    }

    heapifyDown(index) {
      const leftChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);
      let smallest = index;

      if (leftChildIndex < this.heap.length && 
          this.heap[leftChildIndex].freq < this.heap[smallest].freq) {
        smallest = leftChildIndex;
      }

      if (rightChildIndex < this.heap.length && 
          this.heap[rightChildIndex].freq < this.heap[smallest].freq) {
        smallest = rightChildIndex;
      }

      if (smallest !== index) {
        this.swap(index, smallest);
        this.heapifyDown(smallest);
      }
    }

    insert(node) {
      this.heap.push(node);
      this.heapifyUp(this.heap.length - 1);
    }

    extractMin() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();

      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown(0);
      return min;
    }

    size() {
      return this.heap.length;
    }

    toArray() {
      return [...this.heap];
    }
  }

  const calculateFrequencies = (text) => {
    const freq = {};
    for (const char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
  };

  const generateHuffmanCodes = (root, codes = {}, code = '') => {
    if (!root) return codes;
    
    if (root.isLeaf()) {
      codes[root.char] = code || '0'; // Handle single character case
      return codes;
    }
    
    generateHuffmanCodes(root.left, codes, code + '0');
    generateHuffmanCodes(root.right, codes, code + '1');
    
    return codes;
  };

  const generateHuffmanSteps = () => {
    if (!inputText.trim()) return [];

    const text = inputText.trim();
    const freq = calculateFrequencies(text);
    const steps = [];

    // Step 1: Calculate frequencies
    steps.push({
      type: 'frequencies',
      description: `Calculated character frequencies for "${text}"`,
      frequencies: { ...freq },
      heap: [],
      tree: null,
      codes: {},
      action: 'calculate_frequencies',
      explanation: 'Count the frequency of each character in the input text',
      currentNodes: [],
      mergedNode: null
    });

    // Step 2: Create initial heap
    const heap = new MinHeap();
    const initialNodes = [];
    
    Object.entries(freq).forEach(([char, frequency]) => {
      const node = new HuffmanNode(char, frequency);
      heap.insert(node);
      initialNodes.push(node);
    });

    steps.push({
      type: 'create_heap',
      description: `Created min-heap with ${Object.keys(freq).length} leaf nodes`,
      frequencies: { ...freq },
      heap: heap.toArray().map(node => ({ ...node })),
      tree: null,
      codes: {},
      action: 'create_heap',
      explanation: 'Create leaf nodes for each character and add to min-heap',
      currentNodes: [],
      mergedNode: null
    });

    // Step 3: Build Huffman tree
    let stepCount = 0;
    while (heap.size() > 1) {
      stepCount++;
      
      // Extract two minimum nodes
      const node1 = heap.extractMin();
      const node2 = heap.extractMin();
      
      steps.push({
        type: 'extract_nodes',
        description: `Step ${stepCount}: Extracted two minimum frequency nodes`,
        frequencies: { ...freq },
        heap: heap.toArray().map(node => ({ ...node })),
        tree: null,
        codes: {},
        action: 'extract_min',
        explanation: `Removed nodes with frequencies ${node1.freq} and ${node2.freq} from heap`,
        currentNodes: [node1, node2],
        mergedNode: null
      });

      // Create new internal node
      const mergedNode = new HuffmanNode(
        null, 
        node1.freq + node2.freq, 
        node1, 
        node2
      );
      
      heap.insert(mergedNode);
      
      steps.push({
        type: 'merge_nodes',
        description: `Step ${stepCount}: Created internal node with frequency ${mergedNode.freq}`,
        frequencies: { ...freq },
        heap: heap.toArray().map(node => ({ ...node })),
        tree: null,
        codes: {},
        action: 'merge_nodes',
        explanation: `Merged nodes into new internal node and added back to heap`,
        currentNodes: [node1, node2],
        mergedNode: mergedNode
      });
    }

    // Step 4: Tree complete
    const root = heap.extractMin();
    steps.push({
      type: 'tree_complete',
      description: 'Huffman tree construction complete!',
      frequencies: { ...freq },
      heap: [],
      tree: root,
      codes: {},
      action: 'tree_complete',
      explanation: 'Single node remaining in heap becomes the root of Huffman tree',
      currentNodes: [],
      mergedNode: null
    });

    // Step 5: Generate codes
    const codes = generateHuffmanCodes(root);
    steps.push({
      type: 'generate_codes',
      description: 'Generated Huffman codes for each character',
      frequencies: { ...freq },
      heap: [],
      tree: root,
      codes: { ...codes },
      action: 'generate_codes',
      explanation: 'Traverse tree to assign binary codes: left=0, right=1',
      currentNodes: [],
      mergedNode: null
    });

    // Step 6: Calculate compression
    const originalBits = text.length * 8; // Assuming 8 bits per character
    const compressedBits = Object.entries(codes).reduce((total, [char, code]) => {
      return total + (freq[char] * code.length);
    }, 0);
    const ratio = ((originalBits - compressedBits) / originalBits * 100).toFixed(1);

    steps.push({
      type: 'compression_analysis',
      description: `Compression analysis: ${ratio}% size reduction achieved`,
      frequencies: { ...freq },
      heap: [],
      tree: root,
      codes: { ...codes },
      action: 'analyze_compression',
      explanation: `Original: ${originalBits} bits, Compressed: ${compressedBits} bits`,
      currentNodes: [],
      mergedNode: null,
      originalBits,
      compressedBits,
      ratio
    });

    return steps;
  };

  const startHuffmanCoding = () => {
    if (!inputText.trim()) {
      setAlertConfig({
        isOpen: true,
        message: "Please enter some text to encode.",
        type: "error"
      });
      return;
    }
    
    const huffmanSteps = generateHuffmanSteps();
    setSteps(huffmanSteps);
    setCurrentStep(0);
    setStarted(true);
    setPlaying(true);
  };

  const pauseResume = () => {
    setPlaying(!playing);
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const reset = () => {
    setInputText("HELLO WORLD");
    resetVisualization();
  };

  // Auto-play effect
  useEffect(() => {
    let interval;
    if (playing && started && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1100 - speed);
    }
    return () => clearInterval(interval);
  }, [playing, started, currentStep, steps.length, speed]);

  const currentStepData = steps[currentStep] || {
    description: "Enter text and click 'Generate Huffman Codes'",
    frequencies: {},
    heap: [],
    tree: null,
    codes: {},
    action: 'ready',
    explanation: '',
    currentNodes: [],
    mergedNode: null
  };

  // Canvas drawing effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 900;
    canvas.height = 700;
    
    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw based on current step
    if (currentStepData.action === 'ready' || currentStepData.action === 'calculate_frequencies') {
      drawFrequencyTable(ctx, currentStepData.frequencies);
    } else if (currentStepData.action === 'create_heap' || currentStepData.action === 'extract_min' || currentStepData.action === 'merge_nodes') {
      drawHeapVisualization(ctx, currentStepData.heap, currentStepData.currentNodes, currentStepData.mergedNode);
    } else if (currentStepData.tree) {
      drawHuffmanTree(ctx, currentStepData.tree, currentStepData.codes);
    }

    // Draw current action
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Huffman Coding Algorithm', canvas.width / 2, 30);
    
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(currentStepData.action.replace('_', ' ').toUpperCase(), canvas.width / 2, 55);

    // Draw explanation
    if (currentStepData.explanation) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      const maxWidth = canvas.width - 40;
      const lines = wrapText(ctx, currentStepData.explanation, maxWidth);
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height - 60 + index * 15);
      });
    }

  }, [currentStepData]);

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const drawFrequencyTable = (ctx, frequencies) => {
    const entries = Object.entries(frequencies);
    if (entries.length === 0) return;

    const startX = 50;
    const startY = 100;
    const cellWidth = 80;
    const cellHeight = 40;

    // Draw table header
    ctx.fillStyle = '#475569';
    ctx.fillRect(startX, startY, cellWidth, cellHeight);
    ctx.fillRect(startX + cellWidth, startY, cellWidth, cellHeight);
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, cellWidth, cellHeight);
    ctx.strokeRect(startX + cellWidth, startY, cellWidth, cellHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Character', startX + cellWidth / 2, startY + 25);
    ctx.fillText('Frequency', startX + cellWidth * 1.5, startY + 25);

    // Draw table rows
    entries.forEach(([char, freq], index) => {
      const y = startY + (index + 1) * cellHeight;
      
      ctx.fillStyle = '#334155';
      ctx.fillRect(startX, y, cellWidth, cellHeight);
      ctx.fillRect(startX + cellWidth, y, cellWidth, cellHeight);
      
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(startX, y, cellWidth, cellHeight);
      ctx.strokeRect(startX + cellWidth, y, cellWidth, cellHeight);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.fillText(char === ' ' ? 'SPACE' : char, startX + cellWidth / 2, y + 25);
      ctx.fillText(freq.toString(), startX + cellWidth * 1.5, y + 25);
    });
  };

  const drawHeapVisualization = (ctx, heap, currentNodes, mergedNode) => {
    if (heap.length === 0 && currentNodes.length === 0) return;

    const startX = 50;
    const startY = 150;
    const nodeWidth = 60;
    const nodeHeight = 40;
    const spacing = 10;

    // Draw heap nodes
    heap.forEach((node, index) => {
      const x = startX + index * (nodeWidth + spacing);
      const y = startY;
      
      ctx.fillStyle = '#334155';
      ctx.fillRect(x, y, nodeWidth, nodeHeight);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, nodeWidth, nodeHeight);

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      const char = node.char || 'INT';
      ctx.fillText(char, x + nodeWidth / 2, y + 15);
      ctx.fillText(node.freq.toString(), x + nodeWidth / 2, y + 30);
    });

    // Draw current nodes being processed
    if (currentNodes.length > 0) {
      const currentY = startY + 80;
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Extracted Nodes:', startX, currentY - 10);

      currentNodes.forEach((node, index) => {
        const x = startX + index * (nodeWidth + spacing);
        const y = currentY;
        
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x, y, nodeWidth, nodeHeight);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, nodeWidth, nodeHeight);

        ctx.fillStyle = '#1e293b';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        const char = node.char || 'INT';
        ctx.fillText(char, x + nodeWidth / 2, y + 15);
        ctx.fillText(node.freq.toString(), x + nodeWidth / 2, y + 30);
      });
    }

    // Draw merged node
    if (mergedNode) {
      const mergedY = startY + 160;
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('New Internal Node:', startX, mergedY - 10);

      const x = startX;
      const y = mergedY;
      
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x, y, nodeWidth, nodeHeight);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, nodeWidth, nodeHeight);

      ctx.fillStyle = '#1e293b';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('INT', x + nodeWidth / 2, y + 15);
      ctx.fillText(mergedNode.freq.toString(), x + nodeWidth / 2, y + 30);
    }
  };

  const drawHuffmanTree = (ctx, tree, codes) => {
    if (!tree) return;

    const treeWidth = 700;
    const treeHeight = 400;
    const startX = (canvas.width - treeWidth) / 2;
    const startY = 120;

    // Calculate node positions
    const positions = new Map();
    let nodeId = 0;

    const calculatePositions = (node, x, y, levelWidth) => {
      if (!node) return;
      
      positions.set(node.id, { x, y, node });
      
      if (node.left || node.right) {
        const childY = y + 80;
        const childSpacing = levelWidth / 4;
        
        if (node.left) {
          calculatePositions(node.left, x - childSpacing, childY, levelWidth / 2);
        }
        if (node.right) {
          calculatePositions(node.right, x + childSpacing, childY, levelWidth / 2);
        }
      }
    };

    calculatePositions(tree, startX + treeWidth / 2, startY, treeWidth);

    // Draw edges
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    positions.forEach(({ x, y, node }) => {
      if (node.left) {
        const leftPos = positions.get(node.left.id);
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(leftPos.x, leftPos.y);
        ctx.stroke();
        
        // Draw '0' label
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        const midX = (x + leftPos.x) / 2;
        const midY = (y + leftPos.y) / 2;
        ctx.fillText('0', midX - 10, midY);
      }
      
      if (node.right) {
        const rightPos = positions.get(node.right.id);
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(rightPos.x, rightPos.y);
        ctx.stroke();
        
        // Draw '1' label
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        const midX = (x + rightPos.x) / 2;
        const midY = (y + rightPos.y) / 2;
        ctx.fillText('1', midX + 10, midY);
      }
    });

    // Draw nodes
    positions.forEach(({ x, y, node }) => {
      const radius = 20;
      
      // Node circle
      ctx.fillStyle = node.isLeaf() ? '#22c55e' : '#6366f1';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node content
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      
      if (node.isLeaf()) {
        const char = node.char === ' ' ? 'SP' : node.char;
        ctx.fillText(char, x, y - 5);
        ctx.fillText(node.freq.toString(), x, y + 8);
      } else {
        ctx.fillText(node.freq.toString(), x, y + 3);
      }
    });

    // Draw codes table
    if (Object.keys(codes).length > 0) {
      const tableX = 50;
      const tableY = startY + treeHeight + 50;
      const cellWidth = 70;
      const cellHeight = 25;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Huffman Codes:', tableX, tableY - 10);

      Object.entries(codes).forEach(([char, code], index) => {
        const x = tableX + index * (cellWidth + 10);
        const y = tableY;
        
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = '#64748b';
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        const displayChar = char === ' ' ? 'SPACE' : char;
        ctx.fillText(`${displayChar}: ${code}`, x + cellWidth / 2, y + 17);
      });
    }
  };

  const huffmanCode = `class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
  
  isLeaf() {
    return this.left === null && this.right === null;
  }
}

function buildHuffmanTree(text) {
  // Step 1: Calculate character frequencies
  const frequencies = {};
  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  // Step 2: Create min-heap with leaf nodes
  const heap = new MinHeap();
  Object.entries(frequencies).forEach(([char, freq]) => {
    heap.insert(new HuffmanNode(char, freq));
  });
  
  // Step 3: Build tree by merging nodes
  while (heap.size() > 1) {
    const node1 = heap.extractMin();
    const node2 = heap.extractMin();
    
    const merged = new HuffmanNode(
      null,                    // Internal node has no character
      node1.freq + node2.freq, // Combined frequency
      node1,                   // Left child
      node2                    // Right child
    );
    
    heap.insert(merged);
  }
  
  return heap.extractMin(); // Root of Huffman tree
}

function generateCodes(root, codes = {}, code = '') {
  if (!root) return codes;
  
  if (root.isLeaf()) {
    codes[root.char] = code || '0'; // Handle single char case
    return codes;
  }
  
  generateCodes(root.left, codes, code + '0');  // Left = 0
  generateCodes(root.right, codes, code + '1'); // Right = 1
  
  return codes;
}

function huffmanEncode(text) {
  if (!text) return { encoded: '', codes: {}, tree: null };
  
  // Build Huffman tree
  const tree = buildHuffmanTree(text);
  
  // Generate codes for each character
  const codes = generateCodes(tree);
  
  // Encode the text
  const encoded = text.split('').map(char => codes[char]).join('');
  
  return { encoded, codes, tree };
}

function huffmanDecode(encoded, tree) {
  if (!encoded || !tree) return '';
  
  let decoded = '';
  let current = tree;
  
  for (const bit of encoded) {
    current = bit === '0' ? current.left : current.right;
    
    if (current.isLeaf()) {
      decoded += current.char;
      current = tree; // Reset to root
    }
  }
  
  return decoded;
}

// Usage example:
const text = "HELLO WORLD";
const { encoded, codes, tree } = huffmanEncode(text);

console.log('Original:', text);
console.log('Codes:', codes);
console.log('Encoded:', encoded);
console.log('Decoded:', huffmanDecode(encoded, tree));

// Compression analysis:
const originalBits = text.length * 8; // ASCII = 8 bits per char
const compressedBits = encoded.length;
const compressionRatio = (1 - compressedBits / originalBits) * 100;
console.log(\`Compression: \${compressionRatio.toFixed(1)}%\`);`;

  const exampleTexts = [
    "HELLO WORLD",
    "ABRACADABRA",
    "MISSISSIPPI",
    "THE QUICK BROWN FOX",
    "COMPRESSION ALGORITHM"
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Alert {...alertConfig} />
      
      {/* Header */}
      <div className="bg-slate-800 border-b border-purple-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="bg-purple-600 p-2 rounded-lg">
            <Binary className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Huffman Coding</h1>
            <p className="text-gray-400 text-sm">
              Time: O(n log n) | Space: O(n) | Greedy Algorithm
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Input Text</label>
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value.toUpperCase());
                    resetVisualization();
                  }}
                  disabled={playing}
                  className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none font-mono resize-none"
                  rows="3"
                  placeholder="Enter text to encode..."
                />
              </div>

              {/* Example Texts */}
              <div>
                <label className="block text-sm font-medium mb-2">Example Texts</label>
                <div className="space-y-2">
                  {exampleTexts.map((text, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(text);
                        resetVisualization();
                      }}
                      disabled={playing}
                      className="w-full text-left p-2 bg-slate-700 rounded text-xs hover:bg-slate-600 disabled:opacity-50 transition-colors font-mono"
                    >
                      "{text}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startHuffmanCoding}
                  disabled={playing || !inputText.trim()}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Binary className="w-4 h-4" />
                  <span>Generate Huffman Codes</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={pauseResume}
                    disabled={!started}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{playing ? 'Pause' : 'Resume'}</span>
                  </button>
                  
                  <button
                    onClick={stepForward}
                    disabled={!started || currentStep >= steps.length - 1}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>Step</span>
                  </button>
                </div>

                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Speed Control */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Speed: {Math.round((speed / 1000) * 100)}%
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Results */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Compression Stats</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Text Length:</span>
                    <span className="text-blue-400 font-mono">{inputText.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unique Chars:</span>
                    <span className="text-green-400 font-mono">
                      {Object.keys(currentStepData.frequencies).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Original Bits:</span>
                    <span className="text-red-400 font-mono">
                      {currentStepData.originalBits || inputText.length * 8}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Compressed Bits:</span>
                    <span className="text-yellow-400 font-mono">
                      {currentStepData.compressedBits || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Compression:</span>
                    <span className="text-purple-400 font-mono">
                      {currentStepData.ratio || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Algorithm Steps */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Algorithm Steps</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Calculate character frequencies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Create min-heap with leaf nodes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Merge two minimum nodes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Generate binary codes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Analyze compression ratio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Middle Panel - Visualization */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full bg-slate-900 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-5xl">
              {/* Description */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">Huffman Tree Construction</h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              {/* Canvas Visualization */}
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-700 rounded-lg bg-slate-800/50"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>

              {/* Progress */}
              {started && (
                <div className="mt-8">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{currentStep + 1} / {steps.length}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>

        {/* Right Panel - Code & Info */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-l border-purple-500">
            {/* Tabs */}
            <div className="flex border-b border-slate-600">
              <button
                onClick={() => setActiveRightTab("code")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeRightTab === "code"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Code2 className="w-4 h-4 inline mr-2" />
                Code
              </button>
              <button
                onClick={() => setActiveRightTab("info")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeRightTab === "info"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Info
              </button>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              {activeRightTab === "code" ? (
                <BasicCodeDisplay
                  code={huffmanCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Huffman Coding</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      A lossless data compression algorithm that assigns variable-length codes 
                      to characters based on their frequencies. More frequent characters get 
                      shorter codes, achieving optimal compression.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Algorithm Steps:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Count frequency of each character</li>
                      <li>Create leaf nodes and add to min-heap</li>
                      <li>While heap has more than one node:</li>
                      <li className="ml-4">• Extract two minimum nodes</li>
                      <li className="ml-4">• Create internal node with combined frequency</li>
                      <li className="ml-4">• Add new node back to heap</li>
                      <li>Generate codes by traversing tree (left=0, right=1)</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Properties:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-green-400 font-mono text-xs mb-1">Prefix Property:</div>
                        <div className="text-gray-300 text-xs">No code is prefix of another code</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-blue-400 font-mono text-xs mb-1">Optimal:</div>
                        <div className="text-gray-300 text-xs">Produces minimum expected code length</div>
                      </div>
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-purple-400 font-mono text-xs mb-1">Greedy:</div>
                        <div className="text-gray-300 text-xs">Always merges two minimum frequency nodes</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity Analysis:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-yellow-400 font-mono">O(n log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-green-400 font-mono">O(n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Heap Ops:</span>
                        <span className="text-blue-400 font-mono">O(log k)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      n = text length, k = unique characters
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Compression Example:</h4>
                    <div className="bg-slate-700 rounded p-3 text-xs">
                      <div className="text-gray-300 mb-2">Text: "ABBA"</div>
                      <div className="space-y-1 text-gray-400">
                        <div>Frequencies: A=2, B=2</div>
                        <div>Fixed-length: A=0, B=1 → "0110" (4 bits)</div>
                        <div>Huffman: A=0, B=1 → "0110" (4 bits)</div>
                        <div className="text-yellow-400">For longer texts with skewed frequencies, savings are significant!</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• ZIP and GZIP compression</li>
                      <li>• JPEG image compression (DCT coefficients)</li>
                      <li>• MP3 audio compression</li>
                      <li>• Network data transmission</li>
                      <li>• Database compression</li>
                      <li>• Text file compression</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Variants:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Adaptive Huffman (dynamic)</li>
                      <li>• Canonical Huffman (ordered codes)</li>
                      <li>• Modified Huffman (fax compression)</li>
                      <li>• Deflate algorithm (LZ77 + Huffman)</li>
                    </ul>
                  </div>

                  {started && (
                    <div>
                      <h4 className="font-medium mb-2">Current State:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Action:</span>
                          <span className="text-white font-mono capitalize">
                            {currentStepData.action?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Characters:</span>
                          <span className="text-blue-400 font-mono">
                            {Object.keys(currentStepData.frequencies).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Heap Size:</span>
                          <span className="text-green-400 font-mono">{currentStepData.heap.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Codes Generated:</span>
                          <span className="text-purple-400 font-mono">
                            {Object.keys(currentStepData.codes).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default HuffmanCoding;
