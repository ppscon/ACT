"use client";
import { useState } from "react";
import {
  Brain,
  Calculator,
  ScanLine,
  Compass,
  Lightbulb,
  TriangleAlert,
  Eye,
  Dumbbell,
  ChevronDown,
} from "lucide-react";
import { guides, generalTips, type Example } from "../lib/guide";
import type { ArrowCard, Category } from "../lib/questions";
import { useTraining } from "../lib/training-context";
import { ArrowPair } from "./arena";

const icons: Record<Category, typeof Brain> = {
  reasoning: Brain,
  numbers: Calculator,
  errors: ScanLine,
  spatial: Compass,
};

function Cards({ cards, answer }: { cards: ArrowCard[]; answer?: string }) {
  return (
    <div className="guide-cards">
      {cards.map((c, i) => {
        const label = `Card ${"ABCD"[i]}`;
        return (
          <div
            key={label}
            className={"guide-card " + (answer === label ? "is-answer" : "")}
          >
            <ArrowPair card={c} />
            <b>{label}</b>
          </div>
        );
      })}
    </div>
  );
}

function Stimulus({ lines, mono }: { lines: string[]; mono: boolean }) {
  return (
    <div className={"help-example guide-stimulus " + (mono ? "mono" : "")}>
      {lines.map((l, i) => (
        <div key={i}>
          {lines.length > 1 && !mono && (
            <span className="guide-label">Statement {i + 1}: </span>
          )}
          {l}
        </div>
      ))}
    </div>
  );
}

function PracticeExample({
  ex,
  n,
  mono,
}: {
  ex: Example;
  n: number;
  mono: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="guide-example">
      <div className="guide-example-head">
        <span className="help-number">{String(n).padStart(2, "0")}</span>
        <small>Cover the statements after reading, then answer.</small>
      </div>
      <Stimulus lines={ex.stimulus} mono={mono} />
      <p className="guide-question">{ex.question}</p>
      {ex.cards ? (
        <Cards cards={ex.cards} answer={open ? ex.answer : undefined} />
      ) : (
        <div className="guide-options">
          {ex.options.map((o) => (
            <span
              key={o}
              className={open && o === ex.answer ? "is-answer" : ""}
            >
              {o}
            </span>
          ))}
        </div>
      )}
      <button
        className="secondary guide-reveal"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Eye size={16} />
        {open ? "Hide answer" : "Show answer"}
      </button>
      {open && (
        <div className="guide-answer">
          <b>Answer: {ex.answer}.</b> {ex.working}
        </div>
      )}
    </div>
  );
}

export function Guide() {
  const { settings, dispatch, beep } = useTraining();
  const [active, setActive] = useState<Category>("reasoning");
  const g = guides.find((x) => x.id === active)!;
  const mono = g.id === "errors" || g.id === "numbers";
  const Icon = icons[g.id];
  return (
    <main className="dashboard guide-page">
      <div className="eyebrow">TIPS & EXAMPLES</div>
      <h1>Know the method before the clock starts.</h1>
      <p>
        Each module has a technique that makes it far easier. Learn it here,
        try the examples, then drill it under time pressure.
      </p>

      <div className="guide-tabs" role="tablist" aria-label="Modules">
        {guides.map((x) => {
          const I = icons[x.id];
          return (
            <button
              key={x.id}
              role="tab"
              aria-selected={x.id === active}
              className={x.id === active ? "active" : ""}
              onClick={() => setActive(x.id)}
            >
              <I size={17} />
              {x.title}
            </button>
          );
        })}
      </div>

      <section className="white-panel guide-intro">
        <span className={"icon-tile " + g.id}>
          <Icon size={24} />
        </span>
        <div>
          <span className="card-tag">{g.tag}</span>
          <h2>{g.title}</h2>
          <p>{g.summary}</p>
        </div>
      </section>

      <section className="white-panel">
        <h2>How the screen actually works</h2>
        <div className="help-grid">
          <div>
            <span className="help-number">01</span>
            <h3>Screen 1: the information</h3>
            <p>{g.screenOne}</p>
          </div>
          <div>
            <span className="help-number">02</span>
            <h3>Screen 2: the question</h3>
            <p>{g.screenTwo}</p>
          </div>
        </div>
      </section>

      <section className="white-panel">
        <h2>A step-by-step example</h2>
        <h3>Step 1: what appears on Screen 1</h3>
        <Stimulus lines={g.worked.stimulus} mono={mono} />
        <h3>Step 2: the technique</h3>
        <p>{g.worked.mappingIntro}</p>
        <ol className="guide-steps">
          {g.worked.steps.map((s, i) => (
            <li key={i}>
              {s.text} {s.code && <code>{s.code}</code>}
            </li>
          ))}
        </ol>
        {g.worked.chain && <div className="guide-chain">{g.worked.chain}</div>}
        <h3>Step 3: what appears on Screen 2</h3>
        <p className="guide-question">{g.worked.question}</p>
        {g.worked.cards ? (
          <Cards cards={g.worked.cards} answer={g.worked.answer} />
        ) : (
          <div className="guide-options">
            {g.worked.options.map((o) => (
              <span
                key={o}
                className={o === g.worked.answer ? "is-answer" : ""}
              >
                {o}
              </span>
            ))}
          </div>
        )}
        <div className="guide-answer">
          <b>Answer: {g.worked.answer}.</b> {g.worked.why}
        </div>
      </section>

      <div className="help-grid">
        <section className="white-panel">
          <h2>
            <Lightbulb size={19} /> Techniques that work
          </h2>
          <ul className="guide-list">
            {g.techniques.map((t) => (
              <li key={t.title}>
                <b>{t.title}</b>
                <p>{t.text}</p>
                {t.example && <p className="guide-eg">{t.example}</p>}
              </li>
            ))}
          </ul>
        </section>
        <section className="white-panel">
          <h2>
            <TriangleAlert size={19} /> Common traps
          </h2>
          <ul className="guide-list traps">
            {g.traps.map((t) => (
              <li key={t.title}>
                <b>{t.title}</b>
                <p>{t.text}</p>
                {t.example && <p className="guide-eg">{t.example}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="white-panel">
        <h2>Practice examples</h2>
        <p>
          Read each example as if it were Screen 1, cover it with your hand,
          then choose. Reveal the answer to see the working.
        </p>
        <div className="guide-examples">
          {g.examples.map((ex, i) => (
            <PracticeExample key={g.id + i} ex={ex} n={i + 1} mono={mono} />
          ))}
        </div>
        <button
          className="primary guide-drill"
          onClick={() => {
            beep();
            dispatch({
              type: "start",
              settings: {
                ...settings,
                mode: "practice",
                selection: g.id,
                feedback: true,
              },
            });
          }}
        >
          Practise {g.title.toLowerCase()} now
          <Dumbbell size={18} />
        </button>
      </section>

      <details className="white-panel guide-general" open>
        <summary>
          <h2>General tips for every module</h2>
          <ChevronDown size={18} />
        </summary>
        <ul className="guide-list two-col">
          {generalTips.map((t) => (
            <li key={t.title}>
              <b>{t.title}</b>
              <p>{t.text}</p>
            </li>
          ))}
        </ul>
      </details>

      <p className="estimate-note">
        These techniques are general study advice for ACT-style questions. The
        real test format and timings may differ; follow the instructions on the
        day.
      </p>
    </main>
  );
}
