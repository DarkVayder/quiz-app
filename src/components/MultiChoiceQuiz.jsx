import { useState } from "react";
import { useNavigate } from "react-router-dom";
import quizData from "../utils/quizData";
import { toast } from "react-toastify";
import Timer from "./Timer";
import { saveScore, getScore } from "../utils/localStorage";
import { FaHome } from "react-icons/fa";

const MultiChoiceQuiz = () => {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(getScore());
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (selected) => {
    if (selectedOption) return; 

    setSelectedOption(selected);
    const isCorrect = selected === quizData.multipleChoice[questionIndex].correct;

    if (isCorrect) {
      toast.success("Correct!");
      const newScore = score + 5;
      setScore(newScore);
      saveScore(newScore);
    } else {
      toast.error("Incorrect!");
    }

    setTimeout(() => {
      if (questionIndex + 1 < quizData.multipleChoice.length) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setQuizComplete(true);
      }
      setSelectedOption(null);
    }, 1500);
  };

  const handlePlayAgain = () => {
    setQuestionIndex(0);
    setScore(0);
    saveScore(0);
    setQuizComplete(false);
    setSelectedOption(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-white px-6">
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 p-2 bg-purple-700 text-white rounded-full hover:bg-purple-600 transition"
      >
        <FaHome size={20} />
      </button>

      {/* Quiz Box */}
      <div className="w-full max-w-3xl bg-gray-100 text-black shadow-xl rounded-lg p-8 text-center">
        {!quizComplete ? (
          <>
            {/* Timer */}
            <div className="mb-6 flex justify-start">
              <Timer onTimeout={() => setQuestionIndex((prev) => prev + 1)} />
            </div>

            {/* Goal */}
            <div className="mb-6 bg-purple-700 text-white flex items-start text-lg font-bold py-2 px-4 rounded-md">
              🎯 Goal: 45 points
            </div>

            {/* Question Number */}
            <h3 className="text-black font-bold text-sm mb-3 flex items-start">
              Question {questionIndex + 1} of {quizData.multipleChoice.length}
            </h3>

            {/* Question */}
            <h2 className="text-2xl flex items-start font-semibold mb-6">{quizData.multipleChoice[questionIndex].question}</h2>

            {/* Options */}
            <div className="grid gap-4">
              {quizData.multipleChoice[questionIndex].options.map((option, i) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === quizData.multipleChoice[questionIndex].correct;
                const optionLabel = ["A", "B", "C", "D"][i];

                return (
                  <button
                    key={i}
                    className={`w-full flex items-center p-4 rounded-lg border-2 transition text-left text-lg font-medium ${
                      isSelected
                        ? isCorrect
                          ? "border-green-500 bg-green-700 text-white"
                          : "border-red-500 bg-red-700 text-white"
                        : "border-gray-500 bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedOption}
                  >
                    <span className="font-bold mr-4 text-xl">{optionLabel}.</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz Complete! 🎉</h2>
            <p className="text-xl font-medium mb-6">Your Score: {score} points</p>

            {/* Play Again Button */}
            <button
              className="px-6 py-3 bg-gray-200 text-black font-semibold rounded-lg shadow-md hover:bg-gray-300 transition"
              onClick={handlePlayAgain}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiChoiceQuiz;
