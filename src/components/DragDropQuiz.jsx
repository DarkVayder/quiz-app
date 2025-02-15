import { useState, useEffect } from "react";
import quizData from "../utils/quizData";
import { toast } from "react-toastify";
import { saveScore, getScore } from "../utils/localStorage";
import { FaArrowLeft, FaRedo, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const shuffleArray = (array) => {
  return array
    .map((item) => ({ ...item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => ({ term: item.term, id: item.id }));
};

const DragDropQuiz = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(getScore());
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const totalQuestions = quizData.dragDrop.length;
  const currentQuestion = quizData.dragDrop[currentIndex];

  const formattedPairs = shuffleArray(
    currentQuestion.pairs.map((item, index) => ({
      ...item,
      id: `item-${index}`,
    }))
  );

  const [items, setItems] = useState(formattedPairs);

  useEffect(() => {
    const preventTouchMove = (e) => {
      if (draggedIndex !== null) e.preventDefault();
    };

    document.addEventListener("touchmove", preventTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, [draggedIndex]);

  // Handles dragging on desktop
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedItems = [...items];
    const movedItem = updatedItems.splice(draggedIndex, 1)[0];
    updatedItems.splice(index, 0, movedItem);

    setItems(updatedItems);
    setDraggedIndex(null);
  };

  // Handles touch gestures for mobile
  const handleTouchStart = (index) => {
    setDraggedIndex(index);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling while dragging
  };

  const handleTouchEnd = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedItems = [...items];
    const movedItem = updatedItems.splice(draggedIndex, 1)[0];
    updatedItems.splice(index, 0, movedItem);

    setItems(updatedItems);
    setDraggedIndex(null);
  };

  const checkAnswers = () => {
    let correct = true;
    items.forEach((item, index) => {
      if (item.term !== currentQuestion.pairs[index].term) {
        correct = false;
      }
    });

    setIsCorrect(correct);

    if (correct) {
      toast.success("✅ Correct match!");
      const newScore = score + 10;
      setScore(newScore);
      saveScore(newScore);
    } else {
      toast.error("❌ Incorrect order! Try again.");
    }

    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setItems(
        shuffleArray(
          quizData.dragDrop[currentIndex + 1].pairs.map((item, index) => ({
            ...item,
            id: `item-${index}`,
          }))
        )
      );
      setSubmitted(false);
      setIsCorrect(null);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setItems(
        shuffleArray(
          quizData.dragDrop[currentIndex - 1].pairs.map((item, index) => ({
            ...item,
            id: `item-${index}`,
          }))
        )
      );
      setSubmitted(false);
      setIsCorrect(null);
    }
  };

  const refreshQuiz = () => {
    setItems(
      shuffleArray(
        quizData.dragDrop[currentIndex].pairs.map((item, index) => ({
          ...item,
          id: `item-${index}`,
        }))
      )
    );
    setSubmitted(false);
    setIsCorrect(null);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    saveScore(0);
    setItems(
      shuffleArray(
        quizData.dragDrop[0].pairs.map((item, index) => ({
          ...item,
          id: `item-${index}`,
        }))
      )
    );
    setSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 p-2 bg-purple-700 text-white rounded-full hover:bg-purple-600 transition"
      >
        <FaHome size={20} />
      </button>

      <div className="w-full max-w-lg flex justify-between items-center mt-16 px-4">
        <div className="relative w-24 h-2 bg-gray-300 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-purple-700 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <div className="text-lg font-semibold text-purple-700">Score: {score}</div>
      </div>

      <div className="max-w-lg w-full bg-white p-6 shadow-lg rounded-lg mt-6">
        <h2 className="text-lg font-bold text-center text-gray-800">
          {currentQuestion.title}
        </h2>
        <p className="text-gray-500 mb-4 text-center">
          Drag (or tap and hold) the correct term below to match its definition above.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, index) => {
            const isMatchCorrect =
              submitted && item.term === currentQuestion.pairs[index].term;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                onTouchStart={() => handleTouchStart(index)}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(index)}
                className={`p-4 text-sm rounded-lg border text-center cursor-move transition ${
                  isMatchCorrect
                    ? "bg-green-100 border-green-500 text-green-700"
                    : submitted
                    ? "bg-red-100 border-red-500 text-red-700"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {item.term}
              </div>
            );
          })}
        </div>

        {submitted && isCorrect && <p className="text-green-700 font-bold text-center mt-3">✅ Well done!</p>}
        {submitted && isCorrect === false && <p className="text-red-700 font-bold text-center mt-3">❌ Try again!</p>}

        <div className="mt-6 flex justify-between items-center">
          {currentIndex > 0 && <button onClick={prevQuestion} className="p-2 rounded-full bg-purple-700 text-white hover:bg-purple-600"><FaArrowLeft size={20} /></button>}
          <button onClick={refreshQuiz} className="p-2 rounded-full bg-purple-700 text-white hover:bg-purple-600"><FaRedo size={20} /></button>
          {!submitted ? (
            <button onClick={checkAnswers} className="py-2 px-6 rounded-lg bg-purple-700 text-white hover:bg-purple-600">Submit</button>
          ) : currentIndex + 1 < totalQuestions ? (
            <button onClick={nextQuestion} className="py-2 px-6 rounded-lg bg-purple-700 text-white hover:bg-purple-600">Continue</button>
          ) : (
            <button onClick={restartQuiz} className="py-2 px-6 rounded-lg bg-purple-700 text-white hover:bg-purple-600">Play Again</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragDropQuiz;
