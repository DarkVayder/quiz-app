import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 animate-fade-in">
       Mini Quiz App
      </h1>

      {/* Quiz Options */}
      <div className="w-full max-w-xs space-y-4">
        <Link
          to="/multi-choice"
          className="block w-full py-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-lg rounded-lg text-center shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-indigo-700"
          aria-label="Start Multiple Choice Quiz"
        >
          Start Multiple Choice Quiz
        </Link>

        <Link
          to="/drag-drop"
          className="block w-full py-5 bg-gradient-to-r from-blue-500 to-teal-600 text-white font-semibold text-lg rounded-lg text-center shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-teal-700"
          aria-label="Start Drag & Drop Quiz"
        >
          Start Drag & Drop Quiz
        </Link>
      </div>
    </div>
  );
};

export default Home;
