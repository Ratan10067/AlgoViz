import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AlgorithmHomePage from "./components/AlgorithmHomePage";
import AlgorithmVisualizerPage from "./components/AlgorithmVisualizerPage";
import BFSVisualizer from "./components/BFSVisualizer";
import DocumentationModal from "./components/DocumentationModal";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AlgorithmHomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
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
