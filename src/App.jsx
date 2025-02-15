import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import MultiChoiceQuiz from "./components/MultiChoiceQuiz";
import DragDropQuiz from "./components/DragDropQuiz";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/multi-choice" element={<MultiChoiceQuiz />} />
          <Route path="/drag-drop" element={<DragDropQuiz />} />
        </Routes>
      </Router>
      
      {/* React Toastify Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
