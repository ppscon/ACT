"use client";
import { useState } from "react";
import {
  Shield,
  Brain,
  Calculator,
  ScanLine,
  Compass,
  Timer,
  Target,
  Volume2,
  VolumeX,
  ChevronRight,
  Check,
  Layers,
  Dumbbell,
  Settings2,
  Lightbulb,
} from "lucide-react";
import {
  TrainingProvider,
  useTraining,
  accuracy,
} from "../lib/training-context";
import { names } from "../lib/questions";
import { Arena } from "../components/arena";
import { Results, Performance } from "../components/results";
import { Guide } from "../components/guide";
const modules = [
  {
    id: "reasoning" as const,
    title: "Deductive reasoning",
    desc: "Connect the clues. Find the order.",
    icon: Brain,
    tag: "LOGIC & MEMORY",
    example: "RADAR > RADIO > DRONE",
  },
  {
    id: "numbers" as const,
    title: "Number fluency",
    desc: "Think quickly. Calculate accurately.",
    icon: Calculator,
    tag: "MENTAL ARITHMETIC",
    example: "25% of 80  =  ?",
  },
  {
    id: "errors" as const,
    title: "Error detection",
    desc: "Spot the difference. Trust your recall.",
    icon: ScanLine,
    tag: "ATTENTION TO DETAIL",
    example: "KX9#47B / KX9#77B",
  },
  {
    id: "spatial" as const,
    title: "Spatial orientation",
    desc: "Remember the rules. Find the fit.",
    icon: Compass,
    tag: "SPATIAL REASONING",
    example: "BLACK ABOVE WHITE",
  },
];
function Dashboard({
  showHelp,
  showGuide,
}: {
  showHelp: () => void;
  showGuide: () => void;
}) {
  const { settings, update, dispatch, beep, history, storageAvailable } =
    useTraining();
  const { selection: selected, mode } = settings;
  return (
    <main className="dashboard">
      <div className="page-heading">
        <div>
          <div className="eyebrow">COGNITIVE TEST PREPARATION</div>
          <h1>Your next step starts here.</h1>
          <p>Build speed, sharpen recall, and practise under pressure.</p>
        </div>
        <span className="independent">
          <Shield size={15} /> Independent practice tool
        </span>
      </div>
      <div className="workspace">
        <section className="module-section">
          <div className="section-heading">
            <h2>Choose your training</h2>
            <span>04 MODULES</span>
          </div>
          <button
            className={"mixed-card " + (selected === "mixed" ? "selected" : "")}
            aria-pressed={selected === "mixed"}
            onClick={() => {
              update({ selection: "mixed" });
              beep();
            }}
          >
            <span className="icon-tile">
              <Layers size={23} />
            </span>
            <span>
              <b>All-round training</b>
              <small>A balanced mix of all four cognitive skills.</small>
            </span>
            <span className="radio">
              {selected === "mixed" && <Check size={13} />}
            </span>
          </button>
          <div className="module-grid">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  update({ selection: m.id });
                  beep();
                }}
                aria-pressed={selected === m.id}
                className={
                  "module-card " + (selected === m.id ? "selected" : "")
                }
              >
                <div className="module-top">
                  <span className={"icon-tile " + m.id}>
                    <m.icon size={24} />
                  </span>
                  <span className="radio">
                    {selected === m.id && <Check size={13} />}
                  </span>
                </div>
                <span className="card-tag">{m.tag}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <div className="module-example">{m.example}</div>
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <div className="recent-session">
              <span>LAST SESSION</span>
              <b>{accuracy(history[0].responses)}% accuracy</b>
              <small>
                {history[0].responses.length}{" "}
                {history[0].responses.length === 1 ? "question" : "questions"} ·{" "}
                {new Date(history[0].date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </small>
            </div>
          )}
        </section>
        <aside className="session-panel">
          <div className="section-heading">
            <h2>Your session</h2>
            <Timer size={20} />
          </div>
          <div className="mode-control">
            <button
              className={mode === "exam" ? "active" : ""}
              aria-pressed={mode === "exam"}
              onClick={() => update({ mode: "exam" })}
            >
              Timed exam
            </button>
            <button
              className={mode === "practice" ? "active" : ""}
              aria-pressed={mode === "practice"}
              onClick={() => update({ mode: "practice" })}
            >
              Practice drill
            </button>
          </div>
          <div className="session-mode-icon">
            <Target size={30} />
          </div>
          <h3>
            {mode === "exam"
              ? "Test yourself under pressure."
              : "Make every question count."}
          </h3>
          <p>
            {mode === "exam"
              ? "20 questions. Two stages. One focused session. Get your full breakdown at the end."
              : "Endless questions with explanations. Build your understanding, then pick up the pace."}
          </p>
          <dl className="session-facts">
            <div>
              <dt>Training</dt>
              <dd>
                {selected === "mixed" ? "All four modules" : names[selected]}
              </dd>
            </div>
            <div>
              <dt>Questions</dt>
              <dd>{mode === "exam" ? "20" : "Endless"}</dd>
            </div>
            <div>
              <dt>Memorise</dt>
              <dd>
                {settings.memorise
                  ? `${settings.memorise} seconds`
                  : "4–7 seconds*"}
              </dd>
            </div>
            <div>
              <dt>Answer</dt>
              <dd>{settings.answer} seconds</dd>
            </div>
          </dl>
          <details className="settings">
            <summary>
              <Settings2 size={15} />
              Session settings
            </summary>
            <div>
              <label>
                Memorisation time
                <select
                  value={settings.memorise}
                  onChange={(e) => update({ memorise: Number(e.target.value) })}
                >
                  <option value={0}>Module default</option>
                  {[5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} seconds
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Answer time
                <select
                  value={settings.answer}
                  onChange={(e) => update({ answer: Number(e.target.value) })}
                >
                  {[4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} seconds
                    </option>
                  ))}
                </select>
              </label>
              {mode === "practice" && (
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={settings.feedback}
                    onChange={(e) => update({ feedback: e.target.checked })}
                  />
                  Instant feedback & explanations
                </label>
              )}
              <p>
                *Standard: 7s. Error detection: 6s. Magnitude comparison: 4s.
              </p>
            </div>
          </details>
          <button
            className="primary start-button"
            onClick={() => {
              beep();
              dispatch({ type: "start", settings });
            }}
          >
            {mode === "exam" ? "Start timed exam" : "Start practice drill"}
            <Dumbbell size={18} />
          </button>
          <div className="quiet-note">
            <Shield size={14} />
            {storageAvailable
              ? "Your progress stays on this device."
              : "Storage unavailable. Progress lasts this visit."}
          </div>
        </aside>
      </div>
      <section className="bottom-strip">
        <div>
          <span className="small-icon">
            <Timer size={21} />
          </span>
          <div>
            <b>Memorise. Recall. Respond.</b>
            <p>
              The information disappears before you answer. Train the skill that
              matters.
            </p>
          </div>
        </div>
        <div className="strip-actions">
          <button onClick={showGuide}>
            <Lightbulb size={17} />
            Tips & examples
          </button>
          <button onClick={showHelp}>
            How the test works
            <ChevronRight size={17} />
          </button>
        </div>
      </section>
      <footer>
        <span>Independent preparation. No British Army affiliation.</span>
        <span>REME · Royal Engineers · Royal Signals</span>
      </footer>
    </main>
  );
}
function Help({
  onStart,
  onGuide,
}: {
  onStart: () => void;
  onGuide: () => void;
}) {
  return (
    <main className="dashboard help-page">
      <div className="eyebrow">BEFORE YOU BEGIN</div>
      <h1>Two stages. One focused mind.</h1>
      <p>
        Practise retaining information and responding accurately under time
        pressure.
      </p>
      <div className="help-grid">
        <section className="white-panel">
          <span className="help-number">01</span>
          <h2>Memorise the stimulus</h2>
          <p>
            Read the statements, solve the calculation, compare the strings, or
            remember the arrow rules. You have 4–7 seconds with standard pacing.
          </p>
          <div className="help-example">
            Radar is faster than Radio.
            <br />
            Drone is slower than Radio.
          </div>
          <p>
            Select <b>Ready / Proceed</b> to continue early, or wait for the
            timer.
          </p>
        </section>
        <section className="white-panel">
          <span className="help-number">02</span>
          <h2>Recall and answer</h2>
          <p>
            The stimulus disappears completely. Answer using your memory before
            the second timer runs out.
          </p>
          <div className="help-example">
            Which entity is the fastest?
            <br />
            <b>Radar</b> · Radio · Drone
          </div>
          <p>
            Use the buttons or keyboard shortcuts <b>1–5</b>. A timeout counts
            as an unanswered question.
          </p>
        </section>
      </div>
      <section className="white-panel">
        <h2>Choose the right session</h2>
        <div className="help-grid">
          <div>
            <h3>Timed exam</h3>
            <p>
              Complete 20 questions. All-round training includes five questions
              from each module. Answers advance immediately, and your score and
              explanations appear at the end.
            </p>
          </div>
          <div>
            <h3>Practice drill</h3>
            <p>
              Continue for as many questions as you like. Instant feedback shows
              your answer, the correct answer, and the explanation. Turn it off
              in session settings to practise continuous recall.
            </p>
          </div>
        </div>
      </section>
      <section className="white-panel">
        <h2>A few useful details</h2>
        <p>
          Timers continue when you switch tabs or open the end-session dialogue.
          Press Enter or Space to finish memorising early, and Enter to move on
          from practice feedback. Sound is optional. Your settings and the last
          50 sessions stay in this browser.
        </p>
        <p className="estimate-note">
          This is an independent ACT-style practice tool. The practice bands use
          60% and 80% accuracy thresholds; they do not predict official scores
          or eligibility for REME, Royal Engineers, or Royal Signals.
        </p>
      </section>
      <div className="result-actions">
        <button className="primary" onClick={onStart}>
          Choose your training
        </button>
        <button className="secondary" onClick={onGuide}>
          Tips & worked examples
        </button>
      </div>
    </main>
  );
}
function App() {
  const [tab, setTab] = useState<"training" | "guide" | "performance" | "help">(
    "training",
  );
  const { settings, update, session, dispatch, beep } = useTraining();
  const active = session && session.stage !== "done";
  const home = () => {
    dispatch({ type: "reset" });
    setTab("training");
  };
  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brandmark">
            <Shield size={23} />
          </span>
          <b>
            ACT<span> / TRAINING</span>
          </b>
        </div>
        {active ? (
          <span className="session-header">FOCUS ON YOUR NEXT ANSWER</span>
        ) : (
          <nav>
            {(["training", "guide", "performance", "help"] as const).map((t) => (
              <button
                key={t}
                className={tab === t ? "nav-active" : ""}
                onClick={() => {
                  dispatch({ type: "reset" });
                  setTab(t);
                }}
              >
                {
                  {
                    training: "Training",
                    guide: "Tips & examples",
                    performance: "Performance",
                    help: "How it works",
                  }[t]
                }
              </button>
            ))}
          </nav>
        )}
        <button
          className="sound-button"
          aria-label={settings.sound ? "Mute sound" : "Enable sound"}
          aria-pressed={settings.sound}
          onClick={() => {
            update({ sound: !settings.sound });
            if (!settings.sound) beep();
          }}
        >
          {settings.sound ? <Volume2 size={19} /> : <VolumeX size={19} />}
          <span>Sound {settings.sound ? "on" : "off"}</span>
        </button>
      </header>
      {active ? (
        <Arena />
      ) : session?.stage === "done" ? (
        <Results onHome={home} />
      ) : tab === "performance" ? (
        <Performance />
      ) : tab === "help" ? (
        <Help
          onStart={() => setTab("training")}
          onGuide={() => setTab("guide")}
        />
      ) : tab === "guide" ? (
        <Guide />
      ) : (
        <Dashboard
          showHelp={() => setTab("help")}
          showGuide={() => setTab("guide")}
        />
      )}
    </>
  );
}
export default function Home() {
  return (
    <TrainingProvider>
      <App />
    </TrainingProvider>
  );
}
