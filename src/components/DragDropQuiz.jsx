import { useState } from "react";
import quizData from "../utils/quizData";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { toast } from "react-toastify";
import { saveScore, getScore } from "../utils/localStorage";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const DragDropQuiz = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(getScore());
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const totalQuestions = quizData.dragDrop.length;
  const currentQuestion = quizData.dragDrop[currentIndex];

  const initialPairs = shuffleArray(
    currentQuestion.pairs.map((item, index) => ({
      ...item,
      id: `item-${index}`,
    }))
  );

  const [items, setItems] = useState(initialPairs);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    setItems((prevItems) => arrayMove(prevItems, oldIndex, newIndex));
  };

  const checkAnswers = () => {
    let correct = true;
    items.forEach((item, index) => {
      if (item.term !== currentQuestion.pairs[index].term) correct = false;
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
      setCurrentIndex(currentIndex + 1);
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
      setCurrentIndex(currentIndex - 1);
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

  // 🔄 Play Again Logic (from MultiChoiceQuiz)
  const handlePlayAgain = () => {
    setCurrentIndex(0);
    setScore(0);
    saveScore(0);
    setSubmitted(false);
    setIsCorrect(null);
    setItems(
      shuffleArray(
        quizData.dragDrop[0].pairs.map((item, index) => ({
          ...item,
          id: `item-${index}`,
        }))
      )
    );
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

        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id} term={item.term} submitted={submitted} correctTerm={currentQuestion.pairs.find((p) => p.id === item.id)?.term} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {submitted && isCorrect && <p className="text-green-700 font-bold text-center mt-3">✅ Well done!</p>}
        {submitted && isCorrect === false && <p className="text-red-700 font-bold text-center mt-3">❌ Try again!</p>}

        <div className="mt-6 flex justify-between items-center">
          {currentIndex > 0 && <button onClick={prevQuestion} className="p-2 rounded-full bg-purple-700 text-white hover:bg-purple-600"><FaArrowLeft size={20} /></button>}
          <button onClick={checkAnswers} className="py-2 px-6 rounded-lg bg-purple-700 text-white hover:bg-purple-600">Submit</button>
          {currentIndex + 1 < totalQuestions ? (
            <button onClick={nextQuestion} className="py-2 px-6 rounded-lg bg-purple-700 text-white hover:bg-purple-600">Continue</button>
          ) : (
            <button onClick={handlePlayAgain} className="py-2 px-6 rounded-lg bg-purple-700 text-white hover:bg-purple-600">Play Again</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragDropQuiz;
