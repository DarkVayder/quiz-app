export const saveScore = (score) => {
    localStorage.setItem("quizScore", JSON.stringify(score));
  };
  
  export const getScore = () => {
    return JSON.parse(localStorage.getItem("quizScore")) || 0;
  };
  