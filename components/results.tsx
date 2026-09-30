"use client";
import { Target, Timer, Trophy, Check, X, RotateCcw } from "lucide-react";
import { categories, names } from "../lib/questions";
import {
  accuracy,
  average,
  useTraining,
  type Report,
  type Response,
} from "../lib/training-context";
function Breakdown({ responses }: { responses: Response[] }) {
  return (
    <div className="breakdown">
      {categories.map((c) => {
        const r = responses.filter((x) => x.question.category === c);
        const a = accuracy(r);
        return (
          <div key={c}>
            <div>
              <b>{names[c]}</b>
              <span>
                {r.length
                  ? `${r.filter((x) => x.choice === x.question.correct).length} / ${r.length} · ${a}%`
                  : "Not attempted"}
              </span>
            </div>
            <div className="bar">
              <i style={{ width: `${a}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
export function Results({ onHome }: { onHome: () => void }) {
  const { session, dispatch } = useTraining();
  const s = session!;
  const responses = s.responses;
  const acc = accuracy(responses);
  const band =
    acc >= 80
      ? "Technical/Engineering Trade Qualified"
      : acc >= 60
        ? "Standard Pass"
        : "Below Threshold";
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
      <div className="stat-grid">
        <div className="stat-card">
          <Target size={21} />
          <span>Overall accuracy</span>
          <b>{acc}%</b>
          <small>
            {responses.filter((x) => x.choice === x.question.correct).length} /{" "}
            {responses.length} correct
          </small>
        </div>
        <div className="stat-card">
          <Timer size={21} />
          <span>Average response</span>
          <b>
            {(average(responses) / 1000).toFixed(2)}
            <em>s</em>
          </b>
          <small>
            {average(responses)} ms per question, including timeouts
          </small>
        </div>
        <div className="stat-card grade">
          <Trophy size={21} />
          <span>Estimated practice band</span>
          <b>{band}</b>
          <small>Practice thresholds: 60% standard, 80% technical</small>
        </div>
      </div>
      <div className="estimate-note">
        These are training estimates, not official ACT grades or confirmation of
        trade eligibility. Actual selection requirements vary.
      </div>
      <section className="white-panel">
        <h2>Performance by module</h2>
        <Breakdown responses={responses} />
      </section>
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
      <section className="white-panel">
        <h2>Answer review</h2>
        <div className="review-list">
          {responses.map((r, i) => (
            <details key={r.question.id}>
              <summary>
                <span
                  className={
                    "review-status " +
                    (r.choice === r.question.correct ? "good" : "bad")
                  }
                >
                  {r.choice === r.question.correct ? (
                    <Check size={16} />
                  ) : (
                    <X size={16} />
                  )}
                </span>
                <span>
                  <b>
                    {String(i + 1).padStart(2, "0")} ·{" "}
                    {names[r.question.category]}
                  </b>
                  <small>
                    {r.choice === null
                      ? "Timed out"
                      : r.choice === r.question.correct
                        ? "Correct"
                        : "Incorrect"}{" "}
                    · {(r.latency / 1000).toFixed(2)}s
                  </small>
                </span>
                <span className="review-open">Review</span>
              </summary>
              <div className="review-content">
                {r.question.stimulus.map((t, n) => (
                  <p className="review-premise" key={n}>
                    {t}
                  </p>
                ))}
                <b>{r.question.prompt}</b>
                <p>
                  Your answer:{" "}
                  {r.choice === null
                    ? "No answer"
                    : r.question.choices[r.choice]}
                </p>
                <p>
                  Correct answer:{" "}
                  <b>{r.question.choices[r.question.correct]}</b>
                </p>
                <p>{r.question.explanation}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
export function Performance() {
  const { history } = useTraining();
  const all = history.flatMap((r) => r.responses);
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
              <b>{accuracy(all)}%</b>
              <small>Across your saved sessions</small>
            </div>
            <div className="stat-card">
              <span>Best timed exam</span>
              <b>
                {history.some(
                  (r) => r.mode === "exam" && r.responses.length === 20,
                )
                  ? `${Math.max(...history.filter((r) => r.mode === "exam" && r.responses.length === 20).map((r) => accuracy(r.responses)))}%`
                  : "—"}
              </b>
              <small>Completed 20-question blocks only</small>
            </div>
          </div>
          <section className="white-panel">
            <h2>Performance by module</h2>
            <Breakdown responses={all} />
          </section>
          <section className="white-panel">
            <h2>Session history</h2>
            <div className="history-list">
              {history.map((r: Report) => (
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
                      <b>{accuracy(r.responses)}%</b>
                      <small>
                        {r.responses.length} questions ·{" "}
                        {(average(r.responses) / 1000).toFixed(2)}s
                      </small>
                    </span>
                  </summary>
                  <Breakdown responses={r.responses} />
                </details>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
