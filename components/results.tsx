"use client";
import {
  Target,
  Timer,
  Trophy,
  Check,
  X,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Clock,
  Dumbbell,
} from "lucide-react";
import { categories, names, type Category } from "../lib/questions";
import { guideFor } from "../lib/guide";
import {
  average,
  useTraining,
  type Report,
  type Response,
} from "../lib/training-context";
import { ArrowPair } from "./arena";

export const TARGET = 90;

const isRight = (r: Response) => r.choice === r.question.correct;

/** Unrounded accuracy, 0 to 100. */
export const exactAccuracy = (r: Response[]) =>
  r.length ? (100 * r.filter(isRight).length) / r.length : 0;

/** 85% stays "85%"; 83.333% becomes "83.3%". */
export const fmtPct = (n: number) =>
  Number.isInteger(Math.round(n * 10) / 10) ? `${Math.round(n)}%` : `${n.toFixed(1)}%`;

export const band = (pct: number) =>
  pct >= 80
    ? "Technical/Engineering Trade Qualified"
    : pct >= 60
      ? "Standard Pass"
      : "Below Threshold";

type ModuleStat = {
  category: Category;
  correct: number;
  total: number;
  pct: number;
  timeouts: number;
};

export function moduleStats(responses: Response[]): ModuleStat[] {
  return categories
    .map((c) => {
      const r = responses.filter((x) => x.question.category === c);
      return {
        category: c,
        correct: r.filter(isRight).length,
        total: r.length,
        pct: exactAccuracy(r),
        timeouts: r.filter((x) => x.choice === null).length,
      };
    })
    .filter((s) => s.total > 0);
}

function Breakdown({ responses }: { responses: Response[] }) {
  return (
    <div className="breakdown">
      {categories.map((c) => {
        const r = responses.filter((x) => x.question.category === c);
        const pct = exactAccuracy(r);
        return (
          <div key={c}>
            <div>
              <b>{names[c]}</b>
              <span>
                {r.length
                  ? `${r.filter(isRight).length} / ${r.length} · ${fmtPct(pct)}`
                  : "Not attempted"}
              </span>
            </div>
            <div className="bar target-bar">
              <i
                className={pct >= TARGET ? "met" : ""}
                style={{ width: `${pct}%` }}
              />
              <s style={{ left: `${TARGET}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreHero({ responses }: { responses: Response[] }) {
  const pct = exactAccuracy(responses);
  const correct = responses.filter(isRight).length;
  const timeouts = responses.filter((r) => r.choice === null).length;
  const wrong = responses.length - correct - timeouts;
  const met = pct >= TARGET;
  const toGo = Math.max(0, Math.ceil((TARGET / 100) * responses.length) - correct);
  return (
    <section className={"score-hero " + (met ? "met" : "")}>
      <div className="score-main">
        <span>Your score</span>
        <b>{fmtPct(pct)}</b>
        <small>
          {correct} of {responses.length} correct
        </small>
      </div>
      <div className="score-side">
        <div className="score-gauge" aria-hidden="true">
          <i style={{ width: `${pct}%` }} />
          <s style={{ left: "60%" }} />
          <s style={{ left: "80%" }} />
          <s className="goal" style={{ left: `${TARGET}%` }} />
        </div>
        <div className="gauge-labels" aria-hidden="true">
          <span style={{ left: "60%" }}>60</span>
          <span style={{ left: "80%" }}>80</span>
          <span className="goal" style={{ left: `${TARGET}%` }}>
            {TARGET}
          </span>
        </div>
        <div className={"target-status " + (met ? "met" : "")}>
          <Target size={17} />
          {met
            ? `Target of ${TARGET}% reached. Well done.`
            : `Target ${TARGET}%: ${fmtPct(TARGET - pct)} to go (${toGo} more correct ${toGo === 1 ? "answer" : "answers"} out of ${responses.length}).`}
        </div>
        <div className="score-counts">
          <span className="c-good">
            <Check size={14} /> {correct} correct
          </span>
          <span className="c-bad">
            <X size={14} /> {wrong} wrong
          </span>
          <span className="c-time">
            <Clock size={14} /> {timeouts} timed out
          </span>
          <span>
            <Timer size={14} /> {(average(responses) / 1000).toFixed(2)}s average
          </span>
        </div>
        <div className="band-line">
          Practice band: <b>{band(pct)}</b>
        </div>
      </div>
    </section>
  );
}

function StrengthsWeaknesses({
  responses,
  onPractise,
}: {
  responses: Response[];
  onPractise?: (c: Category) => void;
}) {
  const stats = moduleStats(responses);
  if (stats.length < 2) return null;
  // Highest accuracy first; with ties, the module with more questions is the
  // more reliable signal.
  const sorted = [...stats].sort((a, b) => b.pct - a.pct || b.total - a.total);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  if (best.pct === worst.pct)
    return (
      <section className="white-panel">
        <h2>Strongest and weakest</h2>
        <p>
          Even performance: every module scored {fmtPct(best.pct)}. No single
          area is holding you back.
        </p>
      </section>
    );
  return (
    <div className="sw-grid">
      <section className="sw-card strong">
        <span className="sw-label">
          <TrendingUp size={17} /> STRONGEST
        </span>
        <h3>{names[best.category]}</h3>
        <b>{fmtPct(best.pct)}</b>
        <small>
          {best.correct} of {best.total} correct
        </small>
      </section>
      <section className="sw-card weak">
        <span className="sw-label">
          <TrendingDown size={17} /> NEEDS MOST WORK
        </span>
        <h3>{names[worst.category]}</h3>
        <b>{fmtPct(worst.pct)}</b>
        <small>
          {worst.correct} of {worst.total} correct
          {worst.timeouts
            ? ` · ${worst.timeouts} timed out`
            : ""}
        </small>
        <p className="sw-tip">
          <b>Tip:</b> {guideFor(worst.category).quickTip}
        </p>
        {onPractise && (
          <button className="secondary" onClick={() => onPractise(worst.category)}>
            <Dumbbell size={16} />
            Practise {names[worst.category].toLowerCase()}
          </button>
        )}
      </section>
    </div>
  );
}

function QuestionReview({ r, n }: { r: Response; n: number }) {
  const q = r.question;
  const right = isRight(r);
  return (
    <div className={"mistake " + (right ? "right" : "")}>
      <div className="mistake-head">
        <span className={"review-status " + (right ? "good" : "bad")}>
          {right ? <Check size={16} /> : <X size={16} />}
        </span>
        <b>
          Question {n} · {names[q.category]}
        </b>
        <small>
          {r.choice === null ? "Timed out" : right ? "Correct" : "Incorrect"} ·{" "}
          {(r.latency / 1000).toFixed(2)}s
        </small>
      </div>
      <div className="mistake-body">
        <div className="mistake-stimulus">
          <span>WHAT YOU SAW</span>
          {q.stimulus.map((t, i) => (
            <p key={i} className={q.category === "errors" ? "mono" : ""}>
              {t}
            </p>
          ))}
        </div>
        <p className="mistake-q">{q.prompt}</p>
        {q.arrows ? (
          <div className="mistake-cards">
            {r.choice !== null && !right && (
              <div className="yours">
                <ArrowPair card={q.arrows[r.choice]} />
                <small>Your answer: {q.choices[r.choice]}</small>
              </div>
            )}
            <div className="correct">
              <ArrowPair card={q.arrows[q.correct]} />
              <small>Correct: {q.choices[q.correct]}</small>
            </div>
          </div>
        ) : (
          <div className="mistake-answers">
            <span className={right ? "good" : "bad"}>
              Your answer:{" "}
              <b>{r.choice === null ? "No answer" : q.choices[r.choice]}</b>
            </span>
            {!right && (
              <span className="good">
                Correct answer: <b>{q.choices[q.correct]}</b>
              </span>
            )}
          </div>
        )}
        <p className="mistake-why">{q.explanation}</p>
      </div>
    </div>
  );
}

function Mistakes({ responses }: { responses: Response[] }) {
  const wrong = responses
    .map((r, i) => ({ r, n: i + 1 }))
    .filter((x) => !isRight(x.r));
  return (
    <section className="white-panel">
      <h2>
        Questions you got wrong{" "}
        <span className="count-badge">{wrong.length}</span>
      </h2>
      {wrong.length === 0 ? (
        <p>Nothing to review. Every answer was correct.</p>
      ) : (
        <>
          <p className="muted-intro">
            Go through each one: what you saw, what you chose, and why the
            correct answer is right.
          </p>
          <div className="mistake-list">
            {wrong.map(({ r, n }) => (
              <QuestionReview key={r.question.id} r={r} n={n} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export function Results({ onHome }: { onHome: () => void }) {
  const { session, dispatch } = useTraining();
  const s = session!;
  const responses = s.responses;
  const practise = (c: Category) =>
    dispatch({
      type: "start",
      settings: { ...s.settings, mode: "practice", selection: c, feedback: true },
    });
  return (
    <main className="dashboard results-page">
      <div className="eyebrow">SESSION COMPLETE</div>
      <h1>Every session is a step forward.</h1>
      <p>
        {s.settings.mode === "exam" && responses.length < 20
          ? "Partial timed exam"
          : s.settings.mode === "exam"
            ? "Timed exam"
            : "Practice drill"}{" "}
        · {responses.length} {responses.length === 1 ? "question" : "questions"}{" "}
        answered
      </p>
      <ScoreHero responses={responses} />
      <StrengthsWeaknesses responses={responses} onPractise={practise} />
      <section className="white-panel">
        <h2>Performance by module</h2>
        <Breakdown responses={responses} />
      </section>
      <Mistakes responses={responses} />
      <div className="result-actions">
        <button
          className="primary"
          onClick={() => dispatch({ type: "start", settings: s.settings })}
        >
          <RotateCcw size={17} />
          Train again
        </button>
        <button className="secondary" onClick={onHome}>
          Back to training
        </button>
      </div>
      <details className="white-panel all-answers">
        <summary>
          <h2>All answers ({responses.length})</h2>
          <span>Show</span>
        </summary>
        <div className="mistake-list">
          {responses.map((r, i) => (
            <QuestionReview key={r.question.id} r={r} n={i + 1} />
          ))}
        </div>
      </details>
      <div className="estimate-note">
        Practice bands and the {TARGET}% target are training measures, not
        official ACT grades or confirmation of trade eligibility.
      </div>
    </main>
  );
}

export function Performance() {
  const { history, dispatch, settings } = useTraining();
  const all = history.flatMap((r) => r.responses);
  const fullExams = history.filter(
    (r) => r.mode === "exam" && r.responses.length === 20,
  );
  const practise = (c: Category) =>
    dispatch({
      type: "start",
      settings: { ...settings, mode: "practice", selection: c, feedback: true },
    });
  return (
    <main className="dashboard">
      <div className="eyebrow">YOUR PERFORMANCE</div>
      <h1>See your progress.</h1>
      <p>Your last 50 sessions are saved on this device.</p>
      {!history.length ? (
        <div className="empty-state">
          <Trophy size={36} />
          <h2>Your first session is the starting line.</h2>
          <p>
            Finish an exam or practice drill to see your accuracy and response
            times here.
          </p>
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span>Sessions completed</span>
              <b>{history.length}</b>
              <small>{all.length} total questions</small>
            </div>
            <div className="stat-card">
              <span>Overall accuracy</span>
              <b>{fmtPct(exactAccuracy(all))}</b>
              <small>
                {all.filter(isRight).length} of {all.length} correct
              </small>
            </div>
            <div className="stat-card grade">
              <span>Timed exams at {TARGET}% or more</span>
              <b>
                {fullExams.length
                  ? `${fullExams.filter((r) => exactAccuracy(r.responses) >= TARGET).length} / ${fullExams.length}`
                  : "No full exams yet"}
              </b>
              <small>
                {fullExams.length
                  ? `Best: ${fmtPct(Math.max(...fullExams.map((r) => exactAccuracy(r.responses))))}`
                  : "Complete a 20-question timed exam"}
              </small>
            </div>
          </div>
          <StrengthsWeaknesses responses={all} onPractise={practise} />
          <section className="white-panel">
            <h2>Performance by module</h2>
            <Breakdown responses={all} />
          </section>
          <section className="white-panel">
            <h2>Session history</h2>
            <div className="history-list">
              {history.map((r: Report) => {
                const pct = exactAccuracy(r.responses);
                const wrong = r.responses.filter((x) => !isRight(x));
                return (
                  <details key={r.id}>
                    <summary>
                      <span>
                        <b>
                          {r.mode === "exam" ? "Timed exam" : "Practice drill"}
                          {r.mode === "exam" && r.responses.length < 20
                            ? " (partial)"
                            : ""}
                        </b>
                        <small>
                          {new Date(r.date).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          ·{" "}
                          {r.selection === "mixed"
                            ? "All four modules"
                            : names[r.selection]}
                        </small>
                      </span>
                      <span>
                        <b className={pct >= TARGET ? "hit" : ""}>
                          {fmtPct(pct)}
                        </b>
                        <small>
                          {r.responses.filter(isRight).length}/
                          {r.responses.length} ·{" "}
                          {(average(r.responses) / 1000).toFixed(2)}s
                        </small>
                      </span>
                    </summary>
                    <div className="history-detail">
                      <Breakdown responses={r.responses} />
                      {wrong.length > 0 && (
                        <>
                          <h3>Questions got wrong ({wrong.length})</h3>
                          <div className="mistake-list">
                            {r.responses.map((x, i) =>
                              isRight(x) ? null : (
                                <QuestionReview
                                  key={x.question.id + i}
                                  r={x}
                                  n={i + 1}
                                />
                              ),
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
