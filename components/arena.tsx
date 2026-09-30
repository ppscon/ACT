"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Brain, Timer, Check, X, LogOut, Shield, Keyboard } from "lucide-react";
import { useTraining } from "../lib/training-context";
import { names, type ArrowCard } from "../lib/questions";
export function ArrowPair({ card }: { card: ArrowCard }) {
  return (
    <div className="arrow-pair" aria-hidden="true">
      {[0, 1].map((i) => (
        <svg
          key={i}
          viewBox="0 0 120 48"
          className="arrow-symbol"
          style={{
            transform: (i === 0 ? card.leftTop : !card.leftTop)
              ? "rotate(180deg)"
              : "none",
          }}
        >
          <path
            d="M12 13H70V4L107 24 70 44V35H12Z"
            fill={
              (i === 0 ? card.blackTop : !card.blackTop) ? "#26312c" : "#ffffff"
            }
            stroke="#26312c"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}
export function Arena() {
  const { session, dispatch, beep } = useTraining();
  const s = session!;
  const q = s.questions[s.index];
  const duration =
    s.stage === "stimulus"
      ? s.settings.memorise || q.memorise
      : s.settings.answer;
  const [remaining, setRemaining] = useState(duration);
  const [exit, setExit] = useState(false);
  // Set by the timer effect at the start of each stage.
  const started = useRef(0);
  const deadline = useRef(0);
  const latest = useRef({ dispatch, beep, duration });
  useLayoutEffect(() => {
    latest.current = { dispatch, beep, duration };
  });
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
    if (s.stage === "feedback") return;
    const d = latest.current.duration;
    started.current = performance.now();
    deadline.current = started.current + d * 1000;
    setRemaining(d);
    let last = 0;
    const tick = () => {
      const t = Math.max(0, (deadline.current - performance.now()) / 1000);
      setRemaining(t);
      const rounded = Math.ceil(t);
      if (rounded > 0 && rounded <= 3 && rounded !== last) {
        latest.current.beep(rounded === 1 ? 850 : 600);
        last = rounded;
      }
      if (t <= 0) {
        clearInterval(interval);
        if (s.stage === "stimulus") latest.current.dispatch({ type: "ready" });
        else
          latest.current.dispatch({
            type: "answer",
            choice: null,
            latency: d * 1000,
          });
      }
    };
    const interval = setInterval(tick, 35);
    return () => clearInterval(interval);
  }, [q.id, s.stage]);
  function answer(choice: number) {
    if (s.stage !== "answer") return;
    const latency = Math.max(
      0,
      Math.min(duration * 1000, performance.now() - started.current),
    );
    if (performance.now() >= deadline.current) {
      dispatch({ type: "answer", choice: null, latency: duration * 1000 });
      return;
    }
    beep(450);
    dispatch({ type: "answer", choice, latency });
  }
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.repeat || exit) return;
      if (s.stage === "stimulus" && (e.code === "Space" || e.key === "Enter")) {
        e.preventDefault();
        beep();
        dispatch({ type: "ready" });
      } else if (s.stage === "answer" && /^[1-5]$/.test(e.key)) {
        const n = Number(e.key) - 1;
        if (n < q.choices.length) {
          e.preventDefault();
          answer(n);
        }
      } else if (s.stage === "feedback" && e.key === "Enter") {
        e.preventDefault();
        dispatch({ type: "next" });
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [s.stage, q.id, exit, beep, dispatch]);
  const response = s.responses.at(-1);
  const correct = response?.choice === q.correct;
  return (
    <main className="arena">
      <div className="arena-top">
        <button className="text-button" onClick={() => setExit(true)}>
          <LogOut size={17} />
          End session
        </button>
        <span>
          {s.settings.mode === "exam" ? "TIMED EXAM" : "PRACTICE DRILL"}
        </span>
        <b>
          Question {s.index + 1}
          {s.settings.mode === "exam" ? " / 20" : ""}
        </b>
      </div>
      <div className="arena-heading">
        <div className="eyebrow">{names[q.category].toUpperCase()}</div>
        <div className="stage-chips">
          <span className={s.stage === "stimulus" ? "current" : ""}>
            01 Memorise
          </span>
          <span className={s.stage !== "stimulus" ? "current" : ""}>
            02 Answer
          </span>
        </div>
      </div>
      <section className="test-card">
        <div className="test-meta">
          <span>
            <Brain size={18} />
            {s.stage === "stimulus"
              ? "MEMORISE"
              : s.stage === "answer"
                ? "RECALL & RESPOND"
                : "FEEDBACK"}
          </span>
          {s.stage === "feedback" ? (
            <span>Practice review</span>
          ) : (
            <span className={remaining <= 3 ? "urgent" : ""}>
              <Timer size={18} />
              {Math.ceil(remaining)}s
            </span>
          )}
        </div>
        {s.stage !== "feedback" && (
          <div
            className="timer-track"
            role="progressbar"
            aria-label={
              s.stage === "stimulus"
                ? "Memorisation time remaining"
                : "Answer time remaining"
            }
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={Math.ceil(remaining)}
          >
            <div
              className={remaining <= 3 ? "urgent-fill" : ""}
              style={{
                width: `${Math.min(100, (remaining / duration) * 100)}%`,
              }}
            />
          </div>
        )}
        {s.stage === "stimulus" ? (
          <div className="stimulus-stage" key={`stimulus-${q.id}`}>
            <h1 tabIndex={-1} ref={heading}>
              {q.category === "numbers"
                ? "Calculate and remember."
                : q.category === "errors"
                  ? "Compare and remember."
                  : "Read and remember."}
            </h1>
            <p>The information will disappear before you answer.</p>
            <div className={"stimulus " + q.category}>
              {q.stimulus.map((line, i) => (
                <div key={i}>
                  {(q.category === "reasoning" || q.category === "spatial") && (
                    <span className="premise-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span>{line}</span>
                </div>
              ))}
            </div>
            <button
              className="primary"
              onClick={() => {
                beep();
                dispatch({ type: "ready" });
              }}
            >
              Ready / Proceed
              <Check size={17} />
            </button>
            <small className="keyboard-hint">
              Press Enter or Space when you’re ready
            </small>
          </div>
        ) : s.stage === "answer" ? (
          <div className="answer-stage" key={`answer-${q.id}`}>
            <h1 tabIndex={-1} ref={heading}>
              {q.prompt}
            </h1>
            <p>Use what you remember. Select one answer.</p>
            <div className={"choices " + (q.arrows ? "visual-choices" : "")}>
              {q.choices.map((choice, i) => (
                <button
                  key={i}
                  className="choice"
                  onClick={() => answer(i)}
                  aria-label={
                    q.arrows
                      ? `${choice}: top ${q.arrows[i].blackTop ? "black" : "white"} arrow points ${q.arrows[i].leftTop ? "left" : "right"}; bottom ${q.arrows[i].blackTop ? "white" : "black"} arrow points ${q.arrows[i].leftTop ? "right" : "left"}`
                      : choice
                  }
                >
                  {q.arrows && <ArrowPair card={q.arrows[i]} />}
                  <span className="choice-caption">
                    <kbd>{i + 1}</kbd>
                    <b>{choice}</b>
                  </span>
                </button>
              ))}
            </div>
            <small className="keyboard-hint">
              <Keyboard size={15} />
              Press 1–{q.choices.length} to answer
            </small>
          </div>
        ) : (
          <div
            className={"feedback-stage " + (correct ? "correct" : "incorrect")}
          >
            <span className="feedback-icon">
              {correct ? <Check size={28} /> : <X size={28} />}
            </span>
            <h1 tabIndex={-1} ref={heading}>
              {correct
                ? "Correct. Keep it going."
                : response?.choice === null
                  ? "Time’s up."
                  : "Let’s work through it."}
            </h1>
            <div className="feedback-answer">
              Correct answer: <b>{q.choices[q.correct]}</b>
            </div>
            <p>{q.explanation}</p>
            {q.arrows && <ArrowPair card={q.arrows[q.correct]} />}
            <small>
              {response?.choice === null
                ? "No answer recorded"
                : `Your answer: ${q.choices[response!.choice!]}`}{" "}
              · {((response?.latency || 0) / 1000).toFixed(2)}s
            </small>
            <button
              className="primary"
              onClick={() => dispatch({ type: "next" })}
            >
              Next question
            </button>
            <small className="keyboard-hint">Press Enter to continue</small>
          </div>
        )}
      </section>
      <div className="arena-footer">
        <span>
          <Shield size={15} />
          Keep focused. Every second counts.
        </span>
        <span>
          {s.settings.mode === "exam"
            ? "Answers are reviewed after the session."
            : `${s.responses.filter((r) => r.choice === r.question.correct).length} correct / ${s.responses.length} answered`}
        </span>
      </div>
      {exit && (
        <div className="modal-backdrop">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-title"
          >
            <h2 id="exit-title">End this session?</h2>
            <p>
              {s.responses.length
                ? "Your completed answers will be saved and reviewed."
                : "You haven’t answered a question yet."}{" "}
              The timers continue while this message is open.
            </p>
            <div className="modal-actions">
              <button
                className="secondary"
                autoFocus
                onClick={() => setExit(false)}
              >
                Keep training
              </button>
              <button
                className="primary"
                onClick={() => dispatch({ type: "finish" })}
              >
                End session
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
