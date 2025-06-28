import React, { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import edgehandles from "cytoscape-edgehandles";
import {
  Play,
  Pause,
  FastForward,
  RotateCcw,
  ArrowLeft,
  Code,
} from "lucide-react";

// register cytoscape extensions
cytoscape.use(coseBilkent);
cytoscape.use(edgehandles);

const bfsCode = `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const distances = { [start]: 0 };

  while (queue.length > 0) {          // 1
    const current = queue.shift();     // 2

    if (!visited.has(current)) {      // 3
      visited.add(current);            // 4

      for (const neighbor of graph[current]) {  // 5
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);        // 6
          distances[neighbor] = distances[current] + 1;
        }
      }
    }
  }

  return distances;                  // 7
}`;

export default function BFSVisualizer() {
  const cyContainer = useRef(null);
  const cyRef = useRef(null);

  // Graph inputs
  const [numNodes, setNumNodes] = useState(8);
  const [edgeList, setEdgeList] = useState(
    "0-1,0-2,1-3,1-4,2-4,2-5,3-6,4-6,4-7,5-7"
  );
  const [graphType, setGraphType] = useState("undirected");
  const [startNode, setStartNode] = useState("0");

  // BFS animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  // parse edges
  const parseEdges = () => {
    return edgeList
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.includes("-"))
      .flatMap((pair) => {
        const [u, v] = pair.split("-").map((x) => x.trim());
        const arr = [{ from: u, to: v }];
        if (graphType === "undirected") arr.push({ from: v, to: u });
        return arr;
      });
  };

  // compute BFS steps
  const computeBFSSteps = () => {
    const adj = {};
    for (let i = 0; i < numNodes; i++) adj[i] = [];
    parseEdges().forEach(({ from, to }) => adj[from].push(to));

    const visited = new Set();
    const queue = [startNode];
    const dist = { [startNode]: 0 };
    const out = [];

    out.push({
      visited: new Set(),
      queue: [...queue],
      current: null,
      distances: { ...dist },
    });
    while (queue.length) {
      const cur = queue.shift();
      out.push({
        visited: new Set(visited),
        queue: [...queue],
        current: cur,
        distances: { ...dist },
      });
      if (!visited.has(cur)) {
        visited.add(cur);
        for (const nbr of adj[cur]) {
          if (!visited.has(nbr) && !queue.includes(nbr)) {
            dist[nbr] = dist[cur] + 1;
            queue.push(nbr);
          }
        }
        out.push({
          visited: new Set(visited),
          queue: [...queue],
          current: cur,
          distances: { ...dist },
        });
      }
    }
    out.push({
      visited: new Set(visited),
      queue: [],
      current: null,
      distances: { ...dist },
    });
    setSteps(out);
    setCurrentStep(0);
  };

  // init cytoscape on inputs change
  useEffect(() => {
    if (!cyContainer.current) return;
    cyRef.current?.destroy();
    const cy = cytoscape({
      container: cyContainer.current,
      elements: {
        nodes: Array.from({ length: numNodes }, (_, i) => ({
          data: { id: `${i}`, label: `${i}`, distance: "∞" },
        })),
        edges: parseEdges().map((e, idx) => ({
          data: { id: `e${idx}`, source: e.from, target: e.to },
        })),
      },
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "#4b5563",
            "border-width": 2,
            "border-color": "#9ca3af",
            "text-valign": "center",
            color: "#fff",
          },
        },
        {
          selector: "node.visited",
          style: { "background-color": "#10b981", "border-color": "#6ee7b7" },
        },
        {
          selector: "node.current",
          style: {
            "background-color": "#ef4444",
            "border-color": "#fca5a5",
            width: 50,
            height: 50,
          },
        },
        {
          selector: "node.queued",
          style: { "background-color": "#3b82f6", "border-color": "#93c5fd" },
        },
        {
          selector: "node::after",
          style: {
            content: "data(distance)",
            color: "#fbbf24",
            "text-valign": "bottom",
            "text-margin-y": 10,
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#374151",
            "curve-style": "bezier",
            "target-arrow-shape":
              graphType === "directed" ? "triangle" : "none",
            "target-arrow-color": "#374151",
          },
        },
        {
          selector: "edge.highlighted",
          style: {
            width: 3,
            "line-color": "#f59e0b",
            "target-arrow-color": "#f59e0b",
          },
        },
      ],
      layout: { name: "cose-bilkent", animate: true, animationDuration: 500 },
      minZoom: 0.5,
      maxZoom: 2,
    });
    cyRef.current = cy;
    computeBFSSteps();
  }, [numNodes, edgeList, graphType, startNode]);

  // update viz on step change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !steps.length) return;
    const s = steps[currentStep];
    cy.batch(() => {
      cy.nodes().removeClass("visited queued current");
      s.visited.forEach((id) => cy.$(`#${id}`).addClass("visited"));
      s.queue.forEach((id) => cy.$(`#${id}`).addClass("queued"));
      if (s.current !== null) cy.$(`#${s.current}`).addClass("current");
      cy.nodes().forEach((n) => {
        n.data("distance", s.distances[n.id()] ?? "∞");
      });
      cy.edges().removeClass("highlighted");
      if (s.current !== null)
        cy.$(
          `edge[source="${s.current}"],edge[target="${s.current}"]`
        ).addClass("highlighted");
    });
  }, [currentStep, steps]);

  // play animation
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (currentStep < steps.length - 1) setCurrentStep((cs) => cs + 1);
      else setPlaying(false);
    }, speed);
    return () => clearTimeout(t);
  }, [playing, currentStep, steps, speed]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Controls */}
      <div className="p-4 flex space-x-2 bg-gray-800">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="p-2 bg-green-600 rounded"
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <button
          onClick={() =>
            setCurrentStep((cs) => Math.min(cs + 1, steps.length - 1))
          }
          className="p-2 bg-blue-600 rounded"
        >
          <FastForward />
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setCurrentStep(0);
          }}
          className="p-2 bg-red-600 rounded"
        >
          <RotateCcw />
        </button>
        <input
          type="number"
          min={1}
          max={50}
          value={numNodes}
          onChange={(e) => setNumNodes(Number(e.target.value))}
          className="w-16 p-1 text-black"
        />
        <input
          type="text"
          value={edgeList}
          onChange={(e) => setEdgeList(e.target.value)}
          className="flex-1 p-1 text-black"
        />
        <select
          value={graphType}
          onChange={(e) => setGraphType(e.target.value)}
          className="p-1 text-black"
        >
          <option value="undirected">Undirected</option>
          <option value="directed">Directed</option>
        </select>
        <select
          value={startNode}
          onChange={(e) => setStartNode(e.target.value)}
          className="p-1 text-black"
        >
          {Array.from({ length: numNodes }, (_, i) => (
            <option key={i} value={`${i}`}>
              Start {i}
            </option>
          ))}
        </select>
        <button onClick={computeBFSSteps} className="px-3 bg-blue-500 rounded">
          Generate
        </button>
      </div>
      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <div ref={cyContainer} className="flex-1" />
        <div className="w-64 bg-gray-800 p-4 overflow-auto">
          <h3 className="flex items-center mb-2">
            <Code className="mr-1" />
            Algorithm
          </h3>
          <pre className="text-sm font-mono bg-gray-700 p-2 h-48 overflow-auto">
            {bfsCode.split("\n").map((line, i) => (
              <div
                key={i}
                className={
                  i + 1 === steps[currentStep]?.phaseCode ? "bg-gray-600" : ""
                }
              >
                {line}
              </div>
            ))}
          </pre>
          <div className="mt-4 text-sm">
            <p>
              Step {currentStep + 1} / {steps.length}
            </p>
            <p>
              Visited: {[...(steps[currentStep]?.visited || [])].join(", ")}
            </p>
            <p>Queue: {(steps[currentStep]?.queue || []).join(", ")}</p>
            <p>Current: {steps[currentStep]?.current}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
