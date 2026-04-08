"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedTopic, setSelectedTopic] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const currentQuestion = questions[currentIndex];

  // 🔥 Start Quiz
  const startQuiz = async () => {
  if (!selectedTopic) {
    alert("Select topic");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/quiz?topic=${selectedTopic}`
    );
    const data = await res.json();

    console.log("Fetched:", data); // 🔥 debug

    if (!data.length) {
      alert("No questions found for this topic");
      return;
    }

    setQuestions(data);
    setQuizStarted(true);
    setTimeLeft(60);
  } catch (err) {
    console.error(err);
  }
};

  // 🔥 Timer
  useEffect(() => {
    if (!quizStarted) return;
    if (result !== null) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, result]);

  // 🔥 Select Answer
  const handleSelect = (qId, option) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  // 🔥 Submit
  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      selectedAnswer: answers[qId]
    }));

    const res = await fetch("http://localhost:3000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ answers: formattedAnswers })
    });

    const data = await res.json();
    setResult(data);
  };

  // 🔁 Reset
  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
    setCurrentIndex(0);
    setTimeLeft(60);
    setQuizStarted(false);
    setSelectedTopic("");
    setQuestions([]);
  };

  // ============================
  // 🔵 SCREEN 1: TOPIC SELECT
  // ============================
  if (!quizStarted) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${
  darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
}`}>

        {/* Dark Mode */}
<div className="fixed top-4 right-4 z-50">
  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`w-10 h-10 flex items-center justify-center rounded-full shadow ${
      darkMode
        ? "bg-white text-black"
        : "bg-black text-white"
    }`}
  >
    {darkMode ? "☀" : "☾"}
  </button>
</div>

   <h1 className="text-3xl font-bold mb-6 text-top">
   UPSC WITH VICKY
   </h1>

<select
  value={selectedTopic}
  onChange={(e) => setSelectedTopic(e.target.value)}
  className={`p-3 rounded w-64 ${
    darkMode
      ? "bg-gray-800 text-white"
      : "bg-white text-black"
  }`}
>
          <option value="">Select Topic</option>
          <option value="Modern History">Modern History</option>
          <option value="Polity">Polity</option>
          <option value="Geography">Geography</option>
        </select>

        <button
          onClick={startQuiz}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  // ============================
  // 🔵 SCREEN 2: QUIZ
  // ============================
  return (
    <div className={`min-h-screen p-6 flex flex-col items-center ${
  darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
}`}>

      {/* Dark Mode */}
<div className="fixed top-4 right-4 z-50">
  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`w-10 h-10 flex items-center justify-center rounded-full shadow ${
      darkMode
        ? "bg-white text-black"
        : "bg-black text-white"
    }`}
  >
    {darkMode ? "☀" : "☾"}
  </button>
</div>                                                                                      
      <h1 className="text-3xl font-bold mb-6 text-center">
       UPSC WITH VICKY
      </h1>

{/* Timer */}
<h2 className="text-center text-red-500 mb-4">
  Time Left: {timeLeft}s
</h2>

{/* Question */}
<div className="mb-4">
  <h3 className="text-lg font-semibold mb-2">{currentQuestion.question}</h3>
  {currentQuestion.options.map((opt, i) => {
    let color = "";

    if (result) {
      if (opt === currentQuestion.correctAnswer) {
        color = "bg-green-300";
      } else if (opt === answers[currentQuestion._id]) {
        color = "bg-red-300";
      }
    }

    return (
      <label
        key={i}
        className={`block p-2 rounded cursor-pointer ${color} ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        <input
          type="radio"
          name={currentQuestion._id}
          checked={answers[currentQuestion._id] === opt}
          disabled={result !== null}
          onChange={() =>
            handleSelect(currentQuestion._id, opt)
          }
          className="mr-2"
        />
        {opt}
      </label>
    );
  })}
</div>

      {/* Navigation */}
      <div className="flex justify-between mt-6 w-full max-w-xl">
  <button
    onClick={() =>
      setCurrentIndex(prev => Math.max(prev - 1, 0))
    }
    className="bg-gray-500 text-white px-4 py-2 rounded"
  >
    Prev
  </button>

  <button
    onClick={() =>
      setCurrentIndex(prev =>
        Math.min(prev + 1, questions.length - 1)
      )
    }
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Next
  </button>
</div>

      {/* Submit */}
<div className="text-center mt-6">
  <button 
  onClick={handleSubmit} 
  disabled={result !== null}
  className="bg-green-500 text-white px-6 py-2 rounded">
    Submit
  </button>
</div>

      {/* Result */}
      {result && (
        <div className="text-center mt-4">
          <h2>Score: {result.score} / {result.total}</h2>

          <button onClick={resetQuiz} className="bg-blue-500 text-white px-4 py-2 rounded">
            Attempt Again
          </button>
        </div>
      )}
    </div>
  );
}