import { useState } from "react";
import { generateQuestion, checkAnswer } from "../utils/subnetCalculator";
import BitRuler from "./BitRuler";
import "./PracticeQuiz.css";

export default function PracticeQuiz() {
  const [question, setQuestion] = useState(() => generateQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  function handleSubmit(e) {
    e.preventDefault();
    if (submitted) return;
    const correct = checkAnswer(userAnswer, question.answer);
    setIsCorrect(correct);
    setSubmitted(true);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  }

  function handleNext() {
    setQuestion(generateQuestion(question.type));
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
  }

  return (
    <section id="practice" className="section practice-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Practice</span>
          <h2>Test yourself against random subnets</h2>
          <p>
            Every question is generated fresh — same math the calculator
            uses, just checking whether you can do it in your head first.
          </p>
        </div>

        <div className="practice-layout">
          <div className="practice-card card">
            <div className="practice-scoreboard">
              <span>
                Score: <strong>{score.correct}</strong> / {score.total}
              </span>
              <span className="practice-question-type">{question.label}</span>
            </div>

            <p className="practice-prompt">{question.prompt}</p>

            <BitRuler binary={question.result.binaryIp} prefix={question.prefix} compact />

            <form className="practice-form" onSubmit={handleSubmit}>
              <input
                className={`text-input ${
                  submitted ? (isCorrect ? "is-correct" : "is-error") : ""
                }`}
                type="text"
                placeholder="Type your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={submitted}
                autoComplete="off"
                aria-label="Your answer"
              />
              {!submitted ? (
                <button type="submit" className="btn btn-primary" disabled={!userAnswer.trim()}>
                  Submit answer
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Next question
                </button>
              )}
            </form>

            {submitted && (
              <div className={`practice-feedback ${isCorrect ? "is-correct" : "is-error"}`}>
                <p className="practice-feedback-verdict">
                  {isCorrect ? "Correct." : "Not quite."}{" "}
                  {!isCorrect && (
                    <>
                      The correct answer is <span className="mono">{question.answer}</span>.
                    </>
                  )}
                </p>
                <p className="practice-feedback-explanation">{question.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
