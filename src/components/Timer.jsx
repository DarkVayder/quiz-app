import { useState, useEffect } from "react";

const Timer = ({ onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeout]);

  return <div className="text-black font-bold text-lg">Time left ⏳: {timeLeft}s</div>;
};

export default Timer;
