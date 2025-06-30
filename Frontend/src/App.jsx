import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AlgorithmHomePage from "./components/AlgorithmHomePage";
import AlgorithmVisualizerPage from "./components/AlgorithmVisualizerPage";
import BFSVisualizer from "./components/BFSVisualizer";
import DocumentationModal from "./components/DocumentationModal";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import DijkstraVisualizer from "./components/DijkstraVisualizer";
import BlogPage from "./components/BlogPage";
import CheatSheet from "./components/CheatSheet";
import ComingSoonPage from "./components/ComingSoon";
import NotFoundPage from "./components/PageNotFound";
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
          <Route path="/dijkstra-visualizer" element={<DijkstraVisualizer />} />
          <Route path="/view-documentation" element={<DocumentationModal />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/cheatsheet" element={<CheatSheet />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/page-not-found" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
