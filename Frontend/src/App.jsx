import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AlgorithmHomePage from "./components/AlgorithmHomePage";
import AuthPages from "./components/AuthPages";
import AlgorithmVisualizerPage from "./components/AlgorithmVisualizerPage";
import BFSVisualizer from "./components/BFSVisualizer";
import DocumentationModal from "./components/DocumentationModal";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AlgorithmHomePage />} />
          <Route path="/auth" element={<AuthPages />} />
          <Route path="/visualizer" element={<AlgorithmVisualizerPage />} />
          <Route path="/bfs-visualizer" element={<BFSVisualizer />} />
          <Route path="/view-documentation" element={<DocumentationModal />} />
          {/* Add more routes here as needed */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
