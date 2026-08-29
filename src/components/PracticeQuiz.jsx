import { useState } from "react";
import {
  checkAnswer,
  generateQuestionSession,
  QUESTIONS_PER_SESSION,
} from "../utils/subnetCalculator";
import BitRuler from "./BitRuler";
import "./PracticeQuiz.css";

export default function PracticeQuiz() {
  // A "session" is a randomized, deduplicated slice of a freshly generated
  // question bank (see generateQuestionSession). Building it inside
  // useState's initializer means a plain page refresh already produces a
  // new randomized session, with no extra effect needed.
  const [session, setSession] = useState(() => generateQuestionSession());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = session[currentIndex];
  const isLastQuestion = currentIndex === session.length - 1;

  function handleSubmit(e) {
    e.preventDefault();
    if (submitted) return;
    const correct = checkAnswer(userAnswer, question.answer);
    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) setCorrectCount((c) => c + 1);
  }

  function handleNext() {
    if (isLastQuestion) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
  }

  function handlePlayAgain() {
    // Fresh session: new randomized question set (not the same order
    // reused), plus a full reset of score and progress.
    setSession(generateQuestionSession());
    setCurrentIndex(0);
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setFinished(false);
  }

  return (
    <section id="practice" className="section practice-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Practice</span>
          <h2>Test yourself against random subnets</h2>
          <p>
            Each session pulls {QUESTIONS_PER_SESSION} questions from a
            freshly generated, shuffled set — same math the calculator
            uses, just checking whether you can do it in your head first.
          </p>
        </div>

        <div className="practice-layout">
          {finished ? (
            <div className="practice-card practice-results card">
              <span className="eyebrow">Session complete</span>
              <p className="practice-results-score">
                {correctCount} / {session.length}
              </p>
              <p className="practice-results-note">
                Click below for a new set of questions in a new order.
              </p>
              <button type="button" className="btn btn-primary" onClick={handlePlayAgain}>
                Play again
              </button>
            </div>
          ) : (
            <div className="practice-card card">
              <div className="practice-scoreboard">
                <span>
                  Score: <strong>{correctCount}</strong> / {session.length}
                </span>
                <span className="practice-question-type">{question.label}</span>
              </div>

              <div className="practice-progress" aria-hidden="true">
                <div
                  className="practice-progress-fill"
                  style={{ width: `${((currentIndex + 1) / session.length) * 100}%` }}
                />
              </div>
              <p className="practice-progress-label">
                Question {currentIndex + 1} of {session.length}
              </p>

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
                    {isLastQuestion ? "See results" : "Next question"}
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
          )}
        </div>
      </div>
    </section>
  );
}
