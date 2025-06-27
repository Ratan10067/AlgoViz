import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AlgorithmHomePage from "./components/AlgorithmHomePage";
import AuthPages from "./components/AuthPages";
import AlgorithmVisualizerPage from "./components/AlgorithmVisualizerPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AlgorithmHomePage />} />
          <Route path="/auth" element={<AuthPages />} />
          <Route path="/visualizer" element={<AlgorithmVisualizerPage />} />
          {/* Add more routes here as needed */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
