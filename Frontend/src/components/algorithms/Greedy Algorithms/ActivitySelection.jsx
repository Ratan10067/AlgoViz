import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Calendar, Users, CheckCircle, XCircle, Timer, Zap, Plus, Minus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const ActivitySelection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Activities state
  const [activities, setActivities] = useState([
    { id: 1, name: "A1", start: 1, end: 4 },
    { id: 2, name: "A2", start: 3, end: 5 },
    { id: 3, name: "A3", start: 0, end: 6 },
    { id: 4, name: "A4", start: 5, end: 7 },
    { id: 5, name: "A5", start: 3, end: 9 },
    { id: 6, name: "A6", start: 5, end: 9 },
    { id: 7, name: "A7", start: 6, end: 10 },
    { id: 8, name: "A8", start: 8, end: 11 },
    { id: 9, name: "A9", start: 8, end: 12 },
    { id: 10, name: "A10", start: 2, end: 14 },
    { id: 11, name: "A11", start: 12, end: 16 }
  ]);
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(700);
  
  // Algorithm state
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [sortedActivities, setSortedActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [lastSelected, setLastSelected] = useState(null);
  const [maxActivities, setMaxActivities] = useState(0);
  
  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [newActivity, setNewActivity] = useState({ name: "", start: "", end: "" });
  
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
    setSelectedActivities([]);
    setSortedActivities([]);
    setCurrentActivity(null);
    setLastSelected(null);
    setMaxActivities(0);
    setCurrentHighlightedLine(null);
  };

  const addActivity = () => {
    if (!newActivity.name || !newActivity.start || !newActivity.end) {
      setAlertConfig({
        isOpen: true,
        message: "Please fill in all fields for the new activity.",
        type: "error"
      });
      return;
    }

    const start = parseInt(newActivity.start);
    const end = parseInt(newActivity.end);

    if (start >= end) {
      setAlertConfig({
        isOpen: true,
        message: "End time must be greater than start time.",
        type: "error"
      });
      return;
    }

    const newId = Math.max(...activities.map(a => a.id)) + 1;
    const activity = {
      id: newId,
      name: newActivity.name,
      start,
      end
    };

    setActivities([...activities, activity]);
    setNewActivity({ name: "", start: "", end: "" });
    resetVisualization();
  };

  const removeActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
    resetVisualization();
  };

  const generateActivitySelectionSteps = () => {
    if (activities.length === 0) return [];

    const steps = [];
    
    // Step 1: Show initial activities
    steps.push({
      type: 'initial',
      description: `Starting with ${activities.length} activities`,
      activities: [...activities],
      sorted: [],
      selected: [],
      current: null,
      lastSelected: null,
      action: 'initialize',
      explanation: 'Activity Selection Problem: Select maximum number of non-overlapping activities',
      highlightedLine: 1
    });

    // Step 2: Sort by end time
    const sorted = [...activities].sort((a, b) => a.end - b.end);
    steps.push({
      type: 'sort',
      description: 'Sorted activities by end time (greedy choice)',
      activities: [...activities],
      sorted: [...sorted],
      selected: [],
      current: null,
      lastSelected: null,
      action: 'sort_by_end_time',
      explanation: 'Sort activities by their end times - this is the key insight for the greedy approach',
      highlightedLine: 8
    });

    // Step 3: Activity selection process
    const selected = [];
    let lastSelectedActivity = null;

    for (let i = 0; i < sorted.length; i++) {
      const currentActivity = sorted[i];
      
      // Check if current activity can be selected
      steps.push({
        type: 'consider',
        description: `Considering activity ${currentActivity.name} (${currentActivity.start}-${currentActivity.end})`,
        activities: [...activities],
        sorted: [...sorted],
        selected: [...selected],
        current: currentActivity,
        lastSelected: lastSelectedActivity,
        action: 'consider_activity',
        explanation: `Check if activity ${currentActivity.name} can be added to the solution`,
        highlightedLine: 12
      });

      // Check compatibility
      const compatible = !lastSelectedActivity || currentActivity.start >= lastSelectedActivity.end;
      
      if (compatible) {
        // Select the activity
        selected.push(currentActivity);
        lastSelectedActivity = currentActivity;
        
        steps.push({
          type: 'select',
          description: `Selected activity ${currentActivity.name} - compatible with previous selection`,
          activities: [...activities],
          sorted: [...sorted],
          selected: [...selected],
          current: currentActivity,
          lastSelected: lastSelectedActivity,
          action: 'select_activity',
          explanation: `Activity ${currentActivity.name} is compatible - add to solution`,
          highlightedLine: 16
        });
      } else {
        // Reject the activity
        steps.push({
          type: 'reject',
          description: `Rejected activity ${currentActivity.name} - overlaps with previous selection`,
          activities: [...activities],
          sorted: [...sorted],
          selected: [...selected],
          current: currentActivity,
          lastSelected: lastSelectedActivity,
          action: 'reject_activity',
          explanation: `Activity ${currentActivity.name} overlaps with ${lastSelectedActivity.name} - skip it`,
          highlightedLine: 14
        });
      }
    }

    // Final result
    steps.push({
      type: 'complete',
      description: `Algorithm complete! Selected ${selected.length} activities`,
      activities: [...activities],
      sorted: [...sorted],
      selected: [...selected],
      current: null,
      lastSelected: lastSelectedActivity,
      action: 'complete',
      explanation: `Optimal solution found: ${selected.length} non-overlapping activities`,
      highlightedLine: 20
    });

    return steps;
  };

  const startActivitySelection = () => {
    if (activities.length === 0) {
      setAlertConfig({
        isOpen: true,
        message: "Please add some activities first.",
        type: "error"
      });
      return;
    }
    
    const selectionSteps = generateActivitySelectionSteps();
    setSteps(selectionSteps);
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
    setActivities([
      { id: 1, name: "A1", start: 1, end: 4 },
      { id: 2, name: "A2", start: 3, end: 5 },
      { id: 3, name: "A3", start: 0, end: 6 },
      { id: 4, name: "A4", start: 5, end: 7 },
      { id: 5, name: "A5", start: 3, end: 9 },
      { id: 6, name: "A6", start: 5, end: 9 },
      { id: 7, name: "A7", start: 6, end: 10 },
      { id: 8, name: "A8", start: 8, end: 11 },
      { id: 9, name: "A9", start: 8, end: 12 },
      { id: 10, name: "A10", start: 2, end: 14 },
      { id: 11, name: "A11", start: 12, end: 16 }
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
    description: "Click 'Start Selection' to begin the activity selection algorithm",
    activities: activities,
    sorted: [],
    selected: [],
    current: null,
    lastSelected: null,
    action: 'ready',
    explanation: '',
    highlightedLine: null
  };

  // Update state based on current step
  useEffect(() => {
    if (currentStepData) {
      setSelectedActivities(currentStepData.selected || []);
      setSortedActivities(currentStepData.sorted || []);
      setCurrentActivity(currentStepData.current);
      setLastSelected(currentStepData.lastSelected);
      setMaxActivities(currentStepData.selected?.length || 0);
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
    canvas.height = 600;
    
    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw timeline and activities
    drawActivityTimeline(ctx, currentStepData);

  }, [currentStepData]);

  const drawActivityTimeline = (ctx, stepData) => {
    if (!stepData.activities || stepData.activities.length === 0) return;

    const activities = stepData.activities;
    const selected = stepData.selected || [];
    const current = stepData.current;
    const lastSelected = stepData.lastSelected;
    
    // Calculate timeline bounds
    const minTime = Math.min(...activities.map(a => a.start));
    const maxTime = Math.max(...activities.map(a => a.end));
    const timeRange = maxTime - minTime;
    
    const margin = 80;
    const timelineWidth = canvas.width - 2 * margin;
    const timelineHeight = 40;
    const activityHeight = 30;
    const activitySpacing = 35;
    
    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Activity Selection Timeline', canvas.width / 2, 30);
    
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(stepData.action.replace('_', ' ').toUpperCase(), canvas.width / 2, 55);

    // Draw timeline axis
    const timelineY = 100;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, timelineY);
    ctx.lineTo(margin + timelineWidth, timelineY);
    ctx.stroke();

    // Draw time markers
    const timeStep = timeRange >= 10 ? 2 : 1;
    for (let t = minTime; t <= maxTime; t += timeStep) {
      const x = margin + ((t - minTime) / timeRange) * timelineWidth;
      
      // Tick mark
      ctx.beginPath();
      ctx.moveTo(x, timelineY - 5);
      ctx.lineTo(x, timelineY + 5);
      ctx.stroke();
      
      // Time label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.toString(), x, timelineY + 20);
    }

    // Draw activities
    activities.forEach((activity, index) => {
      const y = timelineY + 50 + index * activitySpacing;
      const startX = margin + ((activity.start - minTime) / timeRange) * timelineWidth;
      const endX = margin + ((activity.end - minTime) / timeRange) * timelineWidth;
      const width = endX - startX;
      
      // Activity status
      let fillColor = '#334155'; // Default
      let borderColor = '#64748b';
      
      if (selected.includes(activity)) {
        fillColor = '#22c55e'; // Green for selected
        borderColor = '#16a34a';
      } else if (current && current.id === activity.id) {
        fillColor = '#fbbf24'; // Yellow for current
        borderColor = '#f59e0b';
      } else if (lastSelected && activity.start < lastSelected.end && activity !== lastSelected) {
        fillColor = '#ef4444'; // Red for conflicting
        borderColor = '#dc2626';
      }
      
      // Activity bar
      ctx.fillStyle = fillColor;
      ctx.fillRect(startX, y, width, activityHeight);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, y, width, activityHeight);
      
      // Activity name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(activity.name, startX + width / 2, y + 20);
      
      // Activity label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${activity.start}-${activity.end}`, startX - 5, y - 5);
    });

    // Draw legend
    const legendY = timelineY + 50 + activities.length * activitySpacing + 30;
    const legendItems = [
      { color: '#22c55e', label: 'Selected' },
      { color: '#fbbf24', label: 'Current' },
      { color: '#ef4444', label: 'Conflicting' },
      { color: '#334155', label: 'Available' }
    ];
    
    ctx.font = '12px sans-serif';
    legendItems.forEach((item, index) => {
      const x = margin + index * 120;
      
      // Color box
      ctx.fillStyle = item.color;
      ctx.fillRect(x, legendY, 15, 15);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(x, legendY, 15, 15);
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, x + 20, legendY + 12);
    });

    // Draw sorted activities list (if available)
    if (stepData.sorted && stepData.sorted.length > 0) {
      const sortedY = legendY + 50;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Sorted by End Time:', margin, sortedY);
      
      ctx.font = '12px monospace';
      ctx.fillStyle = '#94a3b8';
      const sortedText = stepData.sorted.map(a => `${a.name}(${a.start}-${a.end})`).join(' → ');
      const maxWidth = canvas.width - 2 * margin;
      if (ctx.measureText(sortedText).width > maxWidth) {
        // Wrap text if too long
        const lines = wrapText(ctx, sortedText, maxWidth);
        lines.forEach((line, index) => {
          ctx.fillText(line, margin, sortedY + 20 + index * 15);
        });
      } else {
        ctx.fillText(sortedText, margin, sortedY + 20);
      }
    }

    // Draw explanation at bottom
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

  const activitySelectionCode = `function activitySelection(activities) {
  // Sort activities by their end times (greedy choice)
  const sorted = activities.sort((a, b) => a.end - b.end);
  
  const selected = [];
  let lastSelected = null;
  
  // Process each activity in sorted order
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    
    // Check if current activity is compatible with last selected
    if (!lastSelected || current.start >= lastSelected.end) {
      // Select this activity
      selected.push(current);
      lastSelected = current;
    }
    // Otherwise, skip this activity (greedy choice)
  }
  
  return selected;
}

// Enhanced version with detailed tracking
function activitySelectionDetailed(activities) {
  console.log('Original activities:', activities);
  
  // Sort by end time
  const sorted = activities.sort((a, b) => a.end - b.end);
  console.log('Sorted by end time:', sorted);
  
  const selected = [];
  let lastSelected = null;
  
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    console.log(\`Considering \${current.name} (\${current.start}-\${current.end})\`);
    
    if (!lastSelected) {
      // First activity - always select
      selected.push(current);
      lastSelected = current;
      console.log(\`Selected \${current.name} (first activity)\`);
    } else if (current.start >= lastSelected.end) {
      // Compatible with last selected
      selected.push(current);
      lastSelected = current;
      console.log(\`Selected \${current.name} (compatible)\`);
    } else {
      // Overlaps with last selected
      console.log(\`Skipped \${current.name} (overlaps with \${lastSelected.name})\`);
    }
  }
  
  console.log('Final selection:', selected);
  return selected;
}

// Alternative approaches:

// 1. Recursive approach (less efficient)
function activitySelectionRecursive(activities, i = 0, lastEnd = 0) {
  if (i >= activities.length) return [];
  
  // Find next compatible activity
  while (i < activities.length && activities[i].start < lastEnd) {
    i++;
  }
  
  if (i >= activities.length) return [];
  
  // Include current activity
  const withCurrent = [activities[i], 
    ...activitySelectionRecursive(activities, i + 1, activities[i].end)];
  
  // Exclude current activity
  const withoutCurrent = activitySelectionRecursive(activities, i + 1, lastEnd);
  
  return withCurrent.length >= withoutCurrent.length ? withCurrent : withoutCurrent;
}

// 2. Dynamic Programming approach (for learning)
function activitySelectionDP(activities) {
  const n = activities.length;
  const sorted = activities.sort((a, b) => a.end - b.end);
  const dp = new Array(n).fill(0);
  const solution = new Array(n).fill(null);
  
  dp[0] = 1;
  solution[0] = [sorted[0]];
  
  for (let i = 1; i < n; i++) {
    // Find latest compatible activity
    let latest = -1;
    for (let j = i - 1; j >= 0; j--) {
      if (sorted[j].end <= sorted[i].start) {
        latest = j;
        break;
      }
    }
    
    const withCurrent = 1 + (latest >= 0 ? dp[latest] : 0);
    const withoutCurrent = dp[i - 1];
    
    if (withCurrent > withoutCurrent) {
      dp[i] = withCurrent;
      solution[i] = latest >= 0 
        ? [...solution[latest], sorted[i]]
        : [sorted[i]];
    } else {
      dp[i] = withoutCurrent;
      solution[i] = solution[i - 1];
    }
  }
  
  return solution[n - 1];
}

// Usage example:
const activities = [
  { name: 'A1', start: 1, end: 4 },
  { name: 'A2', start: 3, end: 5 },
  { name: 'A3', start: 0, end: 6 },
  { name: 'A4', start: 5, end: 7 }
];

const result = activitySelection(activities);
console.log('Selected activities:', result);
// Output: Activities that don't overlap and maximize count`;

  const presets = [
    {
      name: "Small Example",
      activities: [
        { id: 1, name: "A1", start: 1, end: 3 },
        { id: 2, name: "A2", start: 2, end: 4 },
        { id: 3, name: "A3", start: 3, end: 5 },
        { id: 4, name: "A4", start: 4, end: 6 }
      ]
    },
    {
      name: "Overlapping",
      activities: [
        { id: 1, name: "A1", start: 0, end: 3 },
        { id: 2, name: "A2", start: 1, end: 4 },
        { id: 3, name: "A3", start: 2, end: 6 },
        { id: 4, name: "A4", start: 5, end: 7 },
        { id: 5, name: "A5", start: 8, end: 9 }
      ]
    },
    {
      name: "No Conflicts",
      activities: [
        { id: 1, name: "A1", start: 1, end: 2 },
        { id: 2, name: "A2", start: 3, end: 4 },
        { id: 3, name: "A3", start: 5, end: 6 },
        { id: 4, name: "A4", start: 7, end: 8 }
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
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Activity Selection</h1>
            <p className="text-gray-400 text-sm">
              Time: O(n log n) | Space: O(1) | Greedy Algorithm
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Activity Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Activities</h3>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="p-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    {editMode ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
                
                {editMode && (
                  <div className="bg-slate-700 rounded-lg p-4 mb-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Start"
                        value={newActivity.start}
                        onChange={(e) => setNewActivity({...newActivity, start: e.target.value})}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="End"
                        value={newActivity.end}
                        onChange={(e) => setNewActivity({...newActivity, end: e.target.value})}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={addActivity}
                      className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors text-sm"
                    >
                      Add Activity
                    </button>
                  </div>
                )}

                <div className="max-h-48 overflow-y-auto space-y-2">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-2 bg-slate-700 rounded text-sm">
                      <span className="font-mono">
                        {activity.name}: {activity.start}-{activity.end}
                      </span>
                      {editMode && (
                        <button
                          onClick={() => removeActivity(activity.id)}
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
                        setActivities(preset.activities);
                        resetVisualization();
                        setEditMode(false);
                      }}
                      disabled={playing}
                      className="w-full text-left p-2 bg-slate-700 rounded text-sm hover:bg-slate-600 disabled:opacity-50 transition-colors"
                    >
                      {preset.name} ({preset.activities.length} activities)
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startActivitySelection}
                  disabled={playing || activities.length === 0}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  <span>Start Selection</span>
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
                    <span className="text-gray-400">Total Activities:</span>
                    <span className="text-blue-400 font-mono">{activities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Selected:</span>
                    <span className="text-green-400 font-mono">{selectedActivities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Efficiency:</span>
                    <span className="text-purple-400 font-mono">
                      {activities.length > 0 ? Math.round((selectedActivities.length / activities.length) * 100) : 0}%
                    </span>
                  </div>
                  {selectedActivities.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-600">
                      <div className="text-xs text-gray-400 mb-1">Selected Activities:</div>
                      <div className="text-xs font-mono text-green-400">
                        {selectedActivities.map(a => a.name).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Algorithm Steps */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Algorithm Steps</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Sort activities by end time</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Select first activity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Consider next activities</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Select if compatible</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Skip if overlapping</span>
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
                <h2 className="text-xl font-semibold mb-2">Activity Selection Visualization</h2>
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
                  code={activitySelectionCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Activity Selection Problem</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Select the maximum number of activities that can be performed by a single 
                      person, given their start and end times. Activities cannot overlap.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Greedy Strategy:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Sort activities by their end times</li>
                      <li>Select the first activity</li>
                      <li>For each remaining activity:</li>
                      <li className="ml-4">• If it starts after the last selected ends, select it</li>
                      <li className="ml-4">• Otherwise, skip it (greedy choice)</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Why End Time?</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-green-400 font-mono text-xs mb-1">Intuition:</div>
                        <div className="text-gray-300 text-xs">
                          Activities ending early leave more room for future activities
                        </div>
                      </div>
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-blue-400 font-mono text-xs mb-1">Proof:</div>
                        <div className="text-gray-300 text-xs">
                          Any optimal solution can be modified to include earliest-ending activity
                        </div>
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
                        <span className="text-green-400 font-mono">O(1)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sorting:</span>
                        <span className="text-blue-400 font-mono">O(n log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Selection:</span>
                        <span className="text-purple-400 font-mono">O(n)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Alternative Strategies:</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="bg-red-900/30 rounded p-2">
                        <div className="text-red-400 font-mono text-xs mb-1">❌ By Start Time:</div>
                        <div className="text-xs">Can select long activities that block many others</div>
                      </div>
                      <div className="bg-red-900/30 rounded p-2">
                        <div className="text-red-400 font-mono text-xs mb-1">❌ By Duration:</div>
                        <div className="text-xs">Short activities might not leave optimal gaps</div>
                      </div>
                      <div className="bg-green-900/30 rounded p-2">
                        <div className="text-green-400 font-mono text-xs mb-1">✅ By End Time:</div>
                        <div className="text-xs">Proven optimal greedy choice</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Meeting room scheduling</li>
                      <li>• Job scheduling on single machine</li>
                      <li>• Event planning</li>
                      <li>• Resource allocation</li>
                      <li>• Interval scheduling maximization</li>
                      <li>• CPU process scheduling</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Related Problems:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Weighted activity selection (DP)</li>
                      <li>• Interval graph coloring</li>
                      <li>• Platform assignment problem</li>
                      <li>• Maximum disjoint intervals</li>
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
                          <span className="text-gray-400">Considered:</span>
                          <span className="text-blue-400 font-mono">
                            {currentActivity ? currentActivity.name : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Selected:</span>
                          <span className="text-green-400 font-mono">
                            {lastSelected ? lastSelected.name : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Selected:</span>
                          <span className="text-purple-400 font-mono">{selectedActivities.length}</span>
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

export default ActivitySelection;
