import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AlgorithmHomePage from "./components/AlgorithmHomePage";
import AlgorithmVisualizerPage from "./components/AlgorithmVisualizerPage";
import BubbleSort from "./components/BubbleSort";
import QuickSort from "./components/QuickSort";
import MergeSort from "./components/MergeSort";
import BFSVisualizer from "./components/BFSVisualizer";
import DFSVisualizer from "./components/DFSVisualizer";
import DijkstraVisualizer from "./components/DijkstraVisualizer";
import DocumentationModal from "./components/DocumentationModal";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import BlogPage from "./components/BlogPage";
import CheatSheet from "./components/CheatSheet";
import ComingSoonPage from "./components/ComingSoon";
import NotFoundPage from "./components/PageNotFound";
import SupportPage from "./components/SupportPage";
import AboutPage from "./components/AboutPage";
import UserProfilePage from "./components/UserProfilePage";
import AlgorithmsPage from "./components/AlgorithmsPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AlgorithmHomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/visualizer" element={<AlgorithmVisualizerPage />} />
          <Route path="/bubble-sort" element={<BubbleSort />} />
          <Route path="/quick-sort" element={<QuickSort />} />
          <Route path="/merge-sort" element={<MergeSort />} />
          <Route path="/bfs-visualizer" element={<BFSVisualizer />} />
          <Route path="/dfs-visualizer" element={<DFSVisualizer />} />
          <Route path="/dijkstra-visualizer" element={<DijkstraVisualizer />} />
          <Route path="/view-documentation" element={<DocumentationModal />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/cheatsheet" element={<CheatSheet />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/algorithms" element={<AlgorithmsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
