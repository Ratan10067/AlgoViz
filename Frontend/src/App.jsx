import { BrowserRouter, Route, Routes } from "react-router-dom";
import AlgorithmHomePage from "./components/AlgorithmHomePage";
import BubbleSort from "./components/algorithms/Arrays and Sorting/BubbleSort";
import QuickSort from "./components/algorithms/Arrays and Sorting/QuickSort";
import MergeSort from "./components/algorithms/Arrays and Sorting/MergeSort";
import HeapSort from "./components/algorithms/Arrays and Sorting/HeapSort";
import BinarySearch from "./components/algorithms/Search Algorithms/BinarySearch";
import LinearSearch from "./components/algorithms/Search Algorithms/LinearSearch";
import ExponentialSearch from "./components/algorithms/Search Algorithms/ExponentialSearch";
import InterpolationSearch from "./components/algorithms/Search Algorithms/InterpolationSearch";
import JumpSearch from "./components/algorithms/Search Algorithms/JumpSearch";
import TernarySearch from "./components/algorithms/Search Algorithms/TernarySearch";
import BFS from "./components/algorithms/Trees and Graphs/BFS";
import DFS from "./components/algorithms/Trees and Graphs/DFS";
import Dijkstra from "./components/algorithms/Trees and Graphs/Dijkstra";
import TreeTraversal from "./components/algorithms/Trees and Graphs/TreeTraversal";
import BST from "./components/algorithms/Trees and Graphs/BST";
import AVLTree from "./components/algorithms/Trees and Graphs/AVLTree";
import Fibonacci from "./components/algorithms/Dynamic Programming/Fibonacci";
import Knapsack from "./components/algorithms/Dynamic Programming/Knapsack";
import LCS from "./components/algorithms/Dynamic Programming/LCS";
import EditDistance from "./components/algorithms/Dynamic Programming/EditDistance";
import CoinChange from "./components/algorithms/Dynamic Programming/CoinChange";
import MatrixChainMult from "./components/algorithms/Dynamic Programming/MatrixChainMult";
import ActivitySelection from "./components/algorithms/Greedy Algorithms/ActivitySelection";
import HuffmanCoding from "./components/algorithms/Greedy Algorithms/HuffmanCoding";
import FractionalKnapsack from "./components/algorithms/Greedy Algorithms/FractionalKnapsack";
import JobScheduling from "./components/algorithms/Greedy Algorithms/JobScheduling";
import MST from "./components/algorithms/Greedy Algorithms/MST";
import CoinChangeGreedy from "./components/algorithms/Greedy Algorithms/CoinChangeGreedy";
import NQueens from "./components/algorithms/Backtracking/NQueens";
import SudokuSolver from "./components/algorithms/Backtracking/SudokuSolver";
import MazeSolver from "./components/algorithms/Backtracking/MazeSolver";
import SubsetSum from "./components/algorithms/Backtracking/SubsetSum";
import GraphColoring from "./components/algorithms/Backtracking/GraphColoring";
import HamiltonianPath from "./components/algorithms/Backtracking/HamiltonianPath";
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
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <>
      <Routes>
        {/* Routes that include Navbar via layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<AlgorithmHomePage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/cheatsheet" element={<CheatSheet />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
          {/* Add more as needed */}
        </Route>

        {/* Routes without Navbar */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/view-documentation" element={<DocumentationModal />} />
        <Route path="/bubble-sort" element={<BubbleSort />} />
        <Route path="/quick-sort" element={<QuickSort />} />
        <Route path="/merge-sort" element={<MergeSort />} />
        <Route path="/heap-sort" element={<HeapSort />} />
        <Route path="/binary-search" element={<BinarySearch />} />
        <Route path="/linear-search" element={<LinearSearch />} />
        <Route path="/exponential-search" element={<ExponentialSearch />} />
        <Route path="/interpolation-search" element={<InterpolationSearch />} />
        <Route path="/jump-search" element={<JumpSearch />} />
        <Route path="/ternary-search" element={<TernarySearch />} />
        <Route path="/bfs-visualizer" element={<BFS />} />
        <Route path="/dfs-visualizer" element={<DFS />} />
        <Route path="/dijkstra-visualizer" element={<Dijkstra />} />
        <Route path="/tree-traversal" element={<TreeTraversal />} />
        <Route path="/bst" element={<BST />} />
        <Route path="/avl-tree" element={<AVLTree />} />
        <Route path="/fibonacci" element={<Fibonacci />} />
        <Route path="/knapsack" element={<Knapsack />} />
        <Route path="/lcs" element={<LCS />} />
        <Route path="/edit-distance" element={<EditDistance />} />
        <Route path="/coin-change" element={<CoinChange />} />
        <Route path="/matrix-chain-multiplication" element={<MatrixChainMult />} />
        <Route path="/activity-selection" element={<ActivitySelection />} />
        <Route path="/huffman-coding" element={<HuffmanCoding />} />
        <Route path="/fractional-knapsack" element={<FractionalKnapsack />} />
        <Route path="/job-scheduling" element={<JobScheduling />} />
        <Route path="/minimum-spanning-tree" element={<MST />} />
        <Route path="/coin-change-greedy" element={<CoinChangeGreedy />} />
        <Route path="/n-queens" element={<NQueens />} />
        <Route path="/sudoku-solver" element={<SudokuSolver />} />
        <Route path="/maze-solver" element={<MazeSolver />} />
        <Route path="/subset-sum" element={<SubsetSum />} />
        <Route path="/graph-coloring" element={<GraphColoring />} />
        <Route path="/hamiltonian-path" element={<HamiltonianPath />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="/page-not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
