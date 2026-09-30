"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X, SkipForward, RotateCw, Flame, Timer } from "lucide-react";
import { makeFlashCard, type FlashMode } from "../lib/flashcards";
import { fmtPct, TARGET } from "./results";
import { useTraining } from "../lib/training-context";

type Mark = { correct: boolean; seconds: number };

const modes: { id: FlashMode; label: string }[] = [
  { id: "mixed", label: "Mixed" },
  { id: "add", label: "Addition" },
  { id: "sub", label: "Subtraction" },
  { id: "pct", label: "Percentages" },
];
const tags = { add: "ADDITION", sub: "SUBTRACTION", pct: "PERCENTAGES" };

export function Flashcards() {
  const { beep } = useTraining();
  const [mode, setMode] = useState<FlashMode>("mixed");
  const [card, setCard] = useState(() => makeFlashCard("mixed"));
  const [flipped, setFlipped] = useState(false);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const shownAt = useRef(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    shownAt.current = performance.now();
  }, [card.id]);

  const next = useCallback(
    (m: FlashMode = mode) => {
      setFlipped(false);
      setSeconds(null);
      setCard(makeFlashCard(m));
    },
    [mode],
  );

  const flip = useCallback(() => {
    if (!flipped && seconds === null)
      setSeconds((performance.now() - shownAt.current) / 1000);
    setFlipped((f) => !f);
    beep(flipped ? 500 : 700);
  }, [flipped, seconds, beep]);

  const mark = useCallback(
    (correct: boolean) => {
      setMarks((m) => [...m, { correct, seconds: seconds ?? 0 }]);
      beep(correct ? 850 : 350);
      next();
    },
    [seconds, beep, next],
  );

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        flip();
      } else if (e.key === "ArrowRight") next();
      else if (flipped && e.key === "1") mark(false);
      else if (flipped && e.key === "2") mark(true);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [flip, next, mark, flipped]);

  const got = marks.filter((m) => m.correct).length;
  const pct = marks.length ? (100 * got / marks.length) : 0;
  let streak = 0;
  for (let i = marks.length - 1; i >= 0 && marks[i].correct; i--) streak++;
  const avg = marks.length
    ? marks.reduce((s, m) => s + m.seconds, 0) / marks.length
    : 0;
  const sum = `${card.left} ${card.op} ${card.right}`;

  return (
    <main className="dashboard flash-page">
      <div className="eyebrow">FLASHCARDS</div>
      <h1>Quick-fire mental maths.</h1>
      <p>
        Addition, subtraction and clean percentages (10%, 20%, 25%, 50%, 75%).
        Work it out in your head, then tap the card to check your answer.
      </p>

      <div className="flash-controls">
        <div className="guide-tabs" role="tablist" aria-label="Question type">
          {modes.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              className={mode === m.id ? "active" : ""}
              onClick={() => {
                setMode(m.id);
                next(m.id);
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flash-score" aria-live="polite">
          <span>
            <b className={marks.length && pct >= TARGET ? "hit" : ""}>
              {marks.length ? fmtPct(pct) : "–"}
            </b>
            {got} / {marks.length} correct
          </span>
          <span>
            <Flame size={16} /> Streak {streak}
          </span>
          <span>
            <Timer size={16} /> {marks.length ? `${avg.toFixed(1)}s avg` : "–"}
          </span>
          {marks.length > 0 && (
            <button className="text-button" onClick={() => setMarks([])}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flip-scene">
        <div
          key={card.id}
          className={"flip-card deal-in " + (flipped ? "flipped" : "")}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={
            flipped
              ? `Answer: ${sum} = ${card.answer}. Tap to flip back.`
              : `${sum}. Tap to reveal the answer.`
          }
          onClick={flip}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const start = touchX.current;
            touchX.current = null;
            if (start !== null && start - e.changedTouches[0].clientX > 70)
              next();
          }}
        >
          <div className="flip-inner">
            <div className="flip-face front">
              <span className="flip-tag">
                {tags[card.kind]}
              </span>
              <div className={"flip-sum " + card.kind}>
                {card.left}
                <span className="op">{card.op}</span>
                {card.right}
              </div>
              <div className="flip-q">= ?</div>
              <small className="flip-hint">
                <RotateCw size={15} /> Tap to turn over
              </small>
            </div>
            <div className="flip-face back">
              <span className="flip-tag">ANSWER</span>
              <div className="flip-sum small">{sum} =</div>
              <div className="flip-answer">{card.answer}</div>
              {seconds !== null && (
                <small className="flip-time">
                  You took {seconds.toFixed(1)}s
                </small>
              )}
              <div className="flip-methods">
                {card.methods.map((m) => (
                  <div key={m.title}>
                    <b>{m.title}</b>
                    {m.lines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flash-actions">
        {flipped ? (
          <>
            <button className="flash-btn miss" onClick={() => mark(false)}>
              <X size={18} /> Missed it
            </button>
            <button className="flash-btn got" onClick={() => mark(true)}>
              <Check size={18} /> Got it
            </button>
          </>
        ) : (
          <button className="secondary flash-skip" onClick={() => next()}>
            <SkipForward size={16} /> Skip
          </button>
        )}
      </div>
      <p className="flash-keys">
        Tap the card or press Space to turn it. Swipe left or press → to skip.
        After turning: 1 = missed, 2 = got it.
      </p>
    </main>
  );
}
