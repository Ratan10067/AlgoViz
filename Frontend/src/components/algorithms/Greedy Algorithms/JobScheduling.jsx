import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Briefcase, Timer, DollarSign, TrendingUp, Users, Plus, Minus, XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const JobScheduling = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Jobs state
  const [jobs, setJobs] = useState([
    { id: 1, name: "Job1", deadline: 2, profit: 100 },
    { id: 2, name: "Job2", deadline: 1, profit: 19 },
    { id: 3, name: "Job3", deadline: 2, profit: 27 },
    { id: 4, name: "Job4", deadline: 1, profit: 25 },
    { id: 5, name: "Job5", deadline: 3, profit: 15 }
  ]);
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(700);
  
  // Algorithm state
  const [sortedJobs, setSortedJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [maxDeadline, setMaxDeadline] = useState(0);
  
  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [newJob, setNewJob] = useState({ name: "", deadline: "", profit: "" });
  
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
    setSortedJobs([]);
    setSelectedJobs([]);
    setCurrentJob(null);
    setSchedule([]);
    setTotalProfit(0);
    setMaxDeadline(0);
    setCurrentHighlightedLine(null);
  };

  const addJob = () => {
    if (!newJob.name || !newJob.deadline || !newJob.profit) {
      setAlertConfig({
        isOpen: true,
        message: "Please fill in all fields for the new job.",
        type: "error"
      });
      return;
    }

    const deadline = parseInt(newJob.deadline);
    const profit = parseInt(newJob.profit);

    if (deadline <= 0 || profit <= 0) {
      setAlertConfig({
        isOpen: true,
        message: "Deadline and profit must be positive integers.",
        type: "error"
      });
      return;
    }

    const newId = Math.max(...jobs.map(j => j.id)) + 1;
    const job = {
      id: newId,
      name: newJob.name,
      deadline,
      profit
    };

    setJobs([...jobs, job]);
    setNewJob({ name: "", deadline: "", profit: "" });
    resetVisualization();
  };

  const removeJob = (id) => {
    setJobs(jobs.filter(j => j.id !== id));
    resetVisualization();
  };

  const generateJobSchedulingSteps = () => {
    if (jobs.length === 0) return [];

    const steps = [];
    const maxDead = Math.max(...jobs.map(j => j.deadline));
    
    // Step 1: Show initial jobs
    steps.push({
      type: 'initial',
      description: `Starting with ${jobs.length} jobs`,
      jobs: [...jobs],
      sorted: [],
      selected: [],
      current: null,
      schedule: Array(maxDead).fill(null),
      totalProfit: 0,
      maxDeadline: maxDead,
      action: 'initialize',
      explanation: 'Job Scheduling Problem: Select jobs to maximize profit while meeting deadlines',
      highlightedLine: 1
    });

    // Step 2: Sort by profit
    const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
    steps.push({
      type: 'sort',
      description: 'Sorted jobs by profit (descending)',
      jobs: [...jobs],
      sorted: [...sorted],
      selected: [],
      current: null,
      schedule: Array(maxDead).fill(null),
      totalProfit: 0,
      maxDeadline: maxDead,
      action: 'sort_by_profit',
      explanation: 'Sort jobs in descending order of profit - greedy choice: always consider highest profit job first',
      highlightedLine: 4
    });

    // Step 3: Job scheduling process
    const selected = [];
    const schedule = Array(maxDead).fill(null);
    let totalProfit = 0;

    for (let i = 0; i < sorted.length; i++) {
      const job = sorted[i];
      
      // Consider current job
      steps.push({
        type: 'consider',
        description: `Considering ${job.name} (profit: ${job.profit}, deadline: ${job.deadline})`,
        jobs: [...jobs],
        sorted: [...sorted],
        selected: [...selected],
        current: job,
        schedule: [...schedule],
        totalProfit,
        maxDeadline: maxDead,
        action: 'consider_job',
        explanation: `Examining ${job.name}: Can we schedule it before deadline ${job.deadline}?`,
        highlightedLine: 8
      });

      // Find latest available slot before deadline
      let slot = -1;
      for (let j = Math.min(job.deadline - 1, maxDead - 1); j >= 0; j--) {
        if (schedule[j] === null) {
          slot = j;
          break;
        }
      }

      if (slot !== -1) {
        // Schedule the job
        selected.push(job);
        schedule[slot] = job;
        totalProfit += job.profit;
        
        steps.push({
          type: 'schedule',
          description: `Scheduled ${job.name} at time slot ${slot + 1} (profit: +${job.profit})`,
          jobs: [...jobs],
          sorted: [...sorted],
          selected: [...selected],
          current: job,
          schedule: [...schedule],
          totalProfit,
          maxDeadline: maxDead,
          action: 'schedule_job',
          explanation: `Found available slot ${slot + 1} before deadline ${job.deadline}. Add job to schedule.`,
          highlightedLine: 12
        });
      } else {
        // Cannot schedule the job
        steps.push({
          type: 'reject',
          description: `Cannot schedule ${job.name} - no available slots before deadline ${job.deadline}`,
          jobs: [...jobs],
          sorted: [...sorted],
          selected: [...selected],
          current: job,
          schedule: [...schedule],
          totalProfit,
          maxDeadline: maxDead,
          action: 'reject_job',
          explanation: `No available time slots before deadline ${job.deadline}. Skip this job.`,
          highlightedLine: 10
        });
      }
    }

    // Final result
    steps.push({
      type: 'complete',
      description: `Job scheduling complete! Total profit: ${totalProfit}`,
      jobs: [...jobs],
      sorted: [...sorted],
      selected: [...selected],
      current: null,
      schedule: [...schedule],
      totalProfit,
      maxDeadline: maxDead,
      action: 'complete',
      explanation: `Optimal schedule found: ${selected.length} jobs scheduled with maximum profit ${totalProfit}`,
      highlightedLine: 16
    });

    return steps;
  };

  const startJobScheduling = () => {
    if (jobs.length === 0) {
      setAlertConfig({
        isOpen: true,
        message: "Please add some jobs first.",
        type: "error"
      });
      return;
    }
    
    const schedulingSteps = generateJobSchedulingSteps();
    setSteps(schedulingSteps);
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
    setJobs([
      { id: 1, name: "Job1", deadline: 2, profit: 100 },
      { id: 2, name: "Job2", deadline: 1, profit: 19 },
      { id: 3, name: "Job3", deadline: 2, profit: 27 },
      { id: 4, name: "Job4", deadline: 1, profit: 25 },
      { id: 5, name: "Job5", deadline: 3, profit: 15 }
    ]);
    resetVisualization();
    setEditMode(false);
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
    description: "Add jobs and click 'Start Scheduling' to begin",
    jobs: jobs,
    sorted: [],
    selected: [],
    current: null,
    schedule: [],
    totalProfit: 0,
    maxDeadline: Math.max(...jobs.map(j => j.deadline), 0),
    action: 'ready',
    explanation: '',
    highlightedLine: null
  };

  // Update state based on current step
  useEffect(() => {
    if (currentStepData) {
      setSortedJobs(currentStepData.sorted || []);
      setSelectedJobs(currentStepData.selected || []);
      setCurrentJob(currentStepData.current);
      setSchedule(currentStepData.schedule || []);
      setTotalProfit(currentStepData.totalProfit || 0);
      setMaxDeadline(currentStepData.maxDeadline || 0);
      setCurrentHighlightedLine(currentStepData.highlightedLine);
    }
  }, [currentStepData]);

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

    // Draw job scheduling visualization
    drawJobSchedulingVisualization(ctx, currentStepData);

  }, [currentStepData]);

  const drawJobSchedulingVisualization = (ctx, stepData) => {
    if (!stepData.jobs || stepData.jobs.length === 0) return;

    const jobs = stepData.jobs;
    const sorted = stepData.sorted || [];
    const selected = stepData.selected || [];
    const current = stepData.current;
    const schedule = stepData.schedule || [];
    const maxDead = stepData.maxDeadline || Math.max(...jobs.map(j => j.deadline));
    
    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Job Scheduling with Deadlines', canvas.width / 2, 30);
    
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(stepData.action.replace('_', ' ').toUpperCase(), canvas.width / 2, 55);

    // Draw timeline
    const timelineX = 50;
    const timelineY = 100;
    const timelineWidth = 600;
    const slotWidth = timelineWidth / maxDead;
    const slotHeight = 60;
    
    // Timeline header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Schedule Timeline:', timelineX, timelineY - 10);
    
    // Draw time slots
    for (let i = 0; i < maxDead; i++) {
      const x = timelineX + i * slotWidth;
      const y = timelineY;
      
      // Slot background
      ctx.fillStyle = schedule[i] ? '#22c55e' : '#334155';
      ctx.fillRect(x, y, slotWidth - 2, slotHeight);
      
      // Slot border
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, slotWidth - 2, slotHeight);
      
      // Time slot label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Time ${i + 1}`, x + slotWidth / 2, y - 5);
      
      // Job in slot
      if (schedule[i]) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(schedule[i].name, x + slotWidth / 2, y + 25);
        ctx.font = '10px sans-serif';
        ctx.fillText(`P:${schedule[i].profit}`, x + slotWidth / 2, y + 40);
        ctx.fillText(`D:${schedule[i].deadline}`, x + slotWidth / 2, y + 52);
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.fillText('Empty', x + slotWidth / 2, y + 35);
      }
    }

    // Draw jobs table
    const tableX = 50;
    const tableY = timelineY + slotHeight + 60;
    const cellWidth = 100;
    const cellHeight = 30;
    
    // Table headers
    const headers = ['Job', 'Profit', 'Deadline', 'Status'];
    ctx.fillStyle = '#475569';
    headers.forEach((header, i) => {
      ctx.fillRect(tableX + i * cellWidth, tableY, cellWidth, cellHeight);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(tableX + i * cellWidth, tableY, cellWidth, cellHeight);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(header, tableX + i * cellWidth + cellWidth / 2, tableY + 20);
    });

    // Display jobs (sorted order if available)
    const displayJobs = sorted.length > 0 ? sorted : jobs;
    
    displayJobs.forEach((job, index) => {
      const y = tableY + (index + 1) * cellHeight;
      
      // Row background
      let bgColor = '#334155';
      if (current && current.id === job.id) {
        bgColor = '#fbbf24'; // Current job
      } else if (selected.some(s => s.id === job.id)) {
        bgColor = '#22c55e'; // Selected job
      }
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(tableX, y, cellWidth * 4, cellHeight);
      
      // Cell borders
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = '#64748b';
        ctx.strokeRect(tableX + i * cellWidth, y, cellWidth, cellHeight);
      }
      
      // Cell content
      ctx.fillStyle = current && current.id === job.id ? '#1e293b' : '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      
      // Job name
      ctx.fillText(job.name, tableX + cellWidth / 2, y + 20);
      
      // Profit
      ctx.fillText(job.profit.toString(), tableX + cellWidth * 1.5, y + 20);
      
      // Deadline
      ctx.fillText(job.deadline.toString(), tableX + cellWidth * 2.5, y + 20);
      
      // Status
      let status = 'Pending';
      if (selected.some(s => s.id === job.id)) {
        status = 'Scheduled';
      } else if (current && current.id === job.id) {
        status = 'Considering';
      } else if (stepData.action === 'complete') {
        status = 'Rejected';
      }
      ctx.fillText(status, tableX + cellWidth * 3.5, y + 20);
    });

    // Draw algorithm stats
    const statsX = 500;
    const statsY = tableY + (displayJobs.length + 2) * cellHeight + 30;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Statistics:', statsX, statsY);
    
    const stats = [
      `Total Jobs: ${jobs.length}`,
      `Jobs Scheduled: ${selected.length}`,
      `Jobs Rejected: ${jobs.length - selected.length}`,
      `Total Profit: ${stepData.totalProfit}`,
      `Time Slots Used: ${schedule.filter(s => s !== null).length} / ${maxDead}`,
      `Efficiency: ${jobs.length > 0 ? ((selected.length / jobs.length) * 100).toFixed(1) : '0'}%`
    ];
    
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#94a3b8';
    stats.forEach((stat, index) => {
      ctx.fillText(stat, statsX, statsY + 25 + index * 18);
    });

    // Draw legend
    const legendX = 50;
    const legendY = statsY;
    const legendItems = [
      { color: '#22c55e', label: 'Scheduled' },
      { color: '#fbbf24', label: 'Current' },
      { color: '#334155', label: 'Available' },
      { color: '#475569', label: 'Empty Slot' }
    ];
    
    ctx.font = '12px sans-serif';
    legendItems.forEach((item, index) => {
      const x = legendX;
      const y = legendY + 25 + index * 20;
      
      // Color box
      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, 15, 15);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(x, y, 15, 15);
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, x + 20, y + 12);
    });

    // Draw explanation
    if (stepData.explanation) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      const maxWidth = canvas.width - 40;
      const lines = wrapText(ctx, stepData.explanation, maxWidth);
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height - 60 + index * 15);
      });
    }
  };

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

  const jobSchedulingCode = `function jobScheduling(jobs) {
  // Sort jobs by profit in descending order (greedy choice)
  const sortedJobs = jobs.sort((a, b) => b.profit - a.profit);
  
  // Find maximum deadline to determine schedule size
  const maxDeadline = Math.max(...jobs.map(job => job.deadline));
  
  // Initialize schedule array (null = empty slot)
  const schedule = new Array(maxDeadline).fill(null);
  const selectedJobs = [];
  let totalProfit = 0;
  
  // Process jobs in order of profit
  for (const job of sortedJobs) {
    // Find latest available slot before job's deadline
    let slot = -1;
    for (let i = Math.min(job.deadline - 1, maxDeadline - 1); i >= 0; i--) {
      if (schedule[i] === null) {
        slot = i;
        break;
      }
    }
    
    // If slot found, schedule the job
    if (slot !== -1) {
      schedule[slot] = job;
      selectedJobs.push(job);
      totalProfit += job.profit;
    }
    // Otherwise, job is rejected (no available slots)
  }
  
  return {
    schedule,
    selectedJobs,
    totalProfit,
    rejectedJobs: jobs.filter(job => !selectedJobs.includes(job))
  };
}

// Enhanced version with detailed tracking
function jobSchedulingDetailed(jobs) {
  console.log('Job Scheduling with Deadlines');
  console.log('Jobs:', jobs);
  
  // Step 1: Sort by profit
  const sortedJobs = jobs.sort((a, b) => b.profit - a.profit);
  console.log('Sorted by profit:', sortedJobs.map(j => \`\${j.name}(P:\${j.profit},D:\${j.deadline})\`));
  
  const maxDeadline = Math.max(...jobs.map(job => job.deadline));
  console.log('Maximum deadline:', maxDeadline);
  
  // Step 2: Initialize schedule
  const schedule = new Array(maxDeadline).fill(null);
  const selectedJobs = [];
  let totalProfit = 0;
  
  // Step 3: Process each job
  for (const job of sortedJobs) {
    console.log(\`\\nConsidering \${job.name}:\`);
    console.log(\`  Profit: \${job.profit}, Deadline: \${job.deadline}\`);
    
    // Find slot
    let slot = -1;
    for (let i = Math.min(job.deadline - 1, maxDeadline - 1); i >= 0; i--) {
      if (schedule[i] === null) {
        slot = i;
        break;
      }
    }
    
    if (slot !== -1) {
      schedule[slot] = job;
      selectedJobs.push(job);
      totalProfit += job.profit;
      console.log(\`  → Scheduled at time slot \${slot + 1}\`);
      console.log(\`  → Total profit: \${totalProfit}\`);
    } else {
      console.log(\`  → Rejected (no available slots before deadline)\`);
    }
    
    console.log('  Current schedule:', schedule.map((j, i) => 
      \`Slot\${i+1}:\${j ? j.name : 'Empty'}\`
    ));
  }
  
  console.log(\`\\nFinal Results:\`);
  console.log('Selected jobs:', selectedJobs.map(j => j.name));
  console.log('Total profit:', totalProfit);
  console.log('Rejection rate:', \`\${((jobs.length - selectedJobs.length) / jobs.length * 100).toFixed(1)}%\`);
  
  return { schedule, selectedJobs, totalProfit };
}

// Disjoint Set Union approach (more efficient for large inputs)
class DisjointSet {
  constructor(n) {
    this.parent = Array.from({length: n}, (_, i) => i);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const px = this.find(x);
    const py = this.find(y);
    if (px !== py) {
      this.parent[px] = py;
    }
  }
}

function jobSchedulingDSU(jobs) {
  const sortedJobs = jobs.sort((a, b) => b.profit - a.profit);
  const maxDeadline = Math.max(...jobs.map(job => job.deadline));
  
  // DSU to track available slots
  const dsu = new DisjointSet(maxDeadline + 1);
  const selectedJobs = [];
  let totalProfit = 0;
  
  for (const job of sortedJobs) {
    // Find latest available slot
    const availableSlot = dsu.find(job.deadline);
    
    if (availableSlot > 0) {
      selectedJobs.push(job);
      totalProfit += job.profit;
      
      // Mark this slot as occupied by pointing to previous slot
      dsu.union(availableSlot, availableSlot - 1);
    }
  }
  
  return { selectedJobs, totalProfit };
}

// Usage example:
const jobs = [
  { name: 'Job1', deadline: 2, profit: 100 },
  { name: 'Job2', deadline: 1, profit: 19 },
  { name: 'Job3', deadline: 2, profit: 27 },
  { name: 'Job4', deadline: 1, profit: 25 },
  { name: 'Job5', deadline: 3, profit: 15 }
];

const result = jobScheduling(jobs);
console.log('Optimal schedule:', result.schedule);
console.log('Total profit:', result.totalProfit);

// Time Complexity: O(n²) for basic version, O(n log n) with DSU
// Space Complexity: O(max_deadline)`;

  const presets = [
    {
      name: "Small Example",
      jobs: [
        { id: 1, name: "A", deadline: 2, profit: 100 },
        { id: 2, name: "B", deadline: 1, profit: 19 },
        { id: 3, name: "C", deadline: 2, profit: 27 }
      ]
    },
    {
      name: "Classic Problem",
      jobs: [
        { id: 1, name: "Job1", deadline: 4, profit: 20 },
        { id: 2, name: "Job2", deadline: 1, profit: 10 },
        { id: 3, name: "Job3", deadline: 1, profit: 40 },
        { id: 4, name: "Job4", deadline: 1, profit: 30 }
      ]
    },
    {
      name: "Mixed Deadlines",
      jobs: [
        { id: 1, name: "A", deadline: 3, profit: 50 },
        { id: 2, name: "B", deadline: 1, profit: 20 },
        { id: 3, name: "C", deadline: 2, profit: 30 },
        { id: 4, name: "D", deadline: 3, profit: 10 },
        { id: 5, name: "E", deadline: 2, profit: 40 }
      ]
    }
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
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Job Scheduling</h1>
            <p className="text-gray-400 text-sm">
              Time: O(n²) | Space: O(max_deadline) | Greedy Algorithm
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Job Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Jobs</h3>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="p-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    {editMode ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
                
                {editMode && (
                  <div className="bg-slate-700 rounded-lg p-4 mb-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Job name"
                      value={newJob.name}
                      onChange={(e) => setNewJob({...newJob, name: e.target.value})}
                      className="w-full p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Deadline"
                        value={newJob.deadline}
                        onChange={(e) => setNewJob({...newJob, deadline: e.target.value})}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                        min="1"
                      />
                      <input
                        type="number"
                        placeholder="Profit"
                        value={newJob.profit}
                        onChange={(e) => setNewJob({...newJob, profit: e.target.value})}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                        min="1"
                      />
                    </div>
                    <button
                      onClick={addJob}
                      className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors text-sm"
                    >
                      Add Job
                    </button>
                  </div>
                )}

                <div className="max-h-40 overflow-y-auto space-y-2">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-2 bg-slate-700 rounded text-sm">
                      <div className="flex-1">
                        <div className="font-medium">{job.name}</div>
                        <div className="text-xs text-gray-400">
                          Deadline: {job.deadline}, Profit: {job.profit}
                        </div>
                      </div>
                      {editMode && (
                        <button
                          onClick={() => removeJob(job.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-medium mb-2">Example Sets</label>
                <div className="space-y-2">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setJobs(preset.jobs);
                        resetVisualization();
                        setEditMode(false);
                      }}
                      disabled={playing}
                      className="w-full text-left p-2 bg-slate-700 rounded text-sm hover:bg-slate-600 disabled:opacity-50 transition-colors"
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-400">
                        {preset.jobs.length} jobs
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startJobScheduling}
                  disabled={playing || jobs.length === 0}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Start Scheduling</span>
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
                  <span>Results</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Jobs:</span>
                    <span className="text-blue-400 font-mono">{jobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Scheduled:</span>
                    <span className="text-green-400 font-mono">{selectedJobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rejected:</span>
                    <span className="text-red-400 font-mono">{jobs.length - selectedJobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Profit:</span>
                    <span className="text-purple-400 font-mono">{totalProfit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Success Rate:</span>
                    <span className="text-yellow-400 font-mono">
                      {jobs.length > 0 ? Math.round((selectedJobs.length / jobs.length) * 100) : 0}%
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
                    <span>Sort jobs by profit (descending)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Create empty schedule timeline</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>For each job, find latest slot</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Schedule if slot available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Reject if no slots before deadline</span>
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
                <h2 className="text-xl font-semibold mb-2">Job Scheduling Visualization</h2>
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
                  code={jobSchedulingCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Job Scheduling with Deadlines</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Schedule jobs to maximize profit while ensuring each job completes 
                      before its deadline. Each job takes exactly one time unit.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Problem Definition:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Each job has a deadline and profit</li>
                      <li>• Each job takes exactly 1 time unit</li>
                      <li>• Job must complete before its deadline</li>
                      <li>• Goal: Maximize total profit</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Greedy Strategy:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Sort jobs by profit (descending)</li>
                      <li>For each job in sorted order:</li>
                      <li className="ml-4">• Find latest available time slot before deadline</li>
                      <li className="ml-4">• If slot exists, schedule the job</li>
                      <li className="ml-4">• Otherwise, reject the job</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Why Greedy Works:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-green-400 font-mono text-xs mb-1">Exchange Argument:</div>
                        <div className="text-gray-300 text-xs">
                          Can always replace lower profit job with higher profit job
                        </div>
                      </div>
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-blue-400 font-mono text-xs mb-1">Latest Slot:</div>
                        <div className="text-gray-300 text-xs">
                          Scheduling at latest possible slot preserves flexibility
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity Analysis:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-yellow-400 font-mono">O(n²)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-green-400 font-mono">O(max_deadline)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sorting:</span>
                        <span className="text-blue-400 font-mono">O(n log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Slot Finding:</span>
                        <span className="text-purple-400 font-mono">O(n × max_deadline)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Can be optimized to O(n log n) using Disjoint Set Union
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Example Walkthrough:</h4>
                    <div className="bg-slate-700 rounded p-3 text-xs">
                      <div className="text-gray-300 mb-2">Jobs: A(d=2,p=100), B(d=1,p=19), C(d=2,p=27)</div>
                      <div className="space-y-1 text-gray-400">
                        <div>1. Sort by profit: A(100), C(27), B(19)</div>
                        <div>2. Schedule A at slot 2 (before deadline 2)</div>
                        <div>3. Schedule C at slot 1 (before deadline 2)</div>
                        <div>4. Cannot schedule B (no slots before deadline 1)</div>
                        <div className="text-green-400">Result: A, C with profit 127</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Optimizations:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Disjoint Set Union for O(n log n) complexity</li>
                      <li>• Binary search for slot finding</li>
                      <li>• Segment tree for range updates</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• CPU job scheduling</li>
                      <li>• Project deadline management</li>
                      <li>• Task prioritization</li>
                      <li>• Resource allocation</li>
                      <li>• Manufacturing scheduling</li>
                      <li>• Batch processing systems</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Related Problems:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Weighted job scheduling (DP)</li>
                      <li>• Job scheduling with precedence</li>
                      <li>• Multi-processor scheduling</li>
                      <li>• Earliest deadline first (EDF)</li>
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
                          <span className="text-gray-400">Current Job:</span>
                          <span className="text-blue-400 font-mono">
                            {currentJob ? currentJob.name : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Jobs Scheduled:</span>
                          <span className="text-green-400 font-mono">{selectedJobs.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Slots Used:</span>
                          <span className="text-yellow-400 font-mono">
                            {schedule.filter(s => s !== null).length} / {maxDeadline}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Profit:</span>
                          <span className="text-purple-400 font-mono">{totalProfit}</span>
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

export default JobScheduling;
