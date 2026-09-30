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
const subTests: {
  name: string;
  measures: string;
  how: string;
  module: string | null;
}[] = [
  {
    name: "Error Detection",
    measures: "Attention to detail and visual speed",
    how: "Two strings of letters, digits and symbols appear. Count how many characters differ (0 to 4) before they vanish, then submit the count.",
    module: "Error detection",
  },
  {
    name: "Orientation",
    measures: "Spatial awareness and rule-following",
    how: "Two rules about arrows, such as \u201cBlack ABOVE White\u201d and \u201cFacing Left BELOW Facing Right\u201d. Memorise them, move on, then pick the matching diagram.",
    module: "Spatial orientation",
  },
  {
    name: "Number Fluency",
    measures: "Mental arithmetic and memory",
    how: "A basic sum (such as 34 + 48) appears and disappears, followed by a second. Say whether the second is larger, smaller or equal to the first.",
    module: "Number fluency",
  },
  {
    name: "Word Rules",
    measures: "Verbal working memory and categorisation",
    how: "Three categories are shown in order (such as Fruit, Tool, Animal), then replaced by three words. State how many words match the category in their slot.",
    module: null,
  },
  {
    name: "Deductive Reasoning",
    measures: "Logic under pressure",
    how: "Two statements such as \u201cThe radio is newer than the radar\u201d. They disappear, then you say which item is newest, oldest or in the middle.",
    module: "Deductive reasoning",
  },
];
function Help({
  onStart,
  onGuide,
}: {
  onStart: () => void;
  onGuide: () => void;
}) {
  return (
    <main className="dashboard help-page">
      <div className="eyebrow">ABOUT THE TEST</div>
      <h1>The Army Cognitive Test (ACT).</h1>
      <p>
        The computer-based cognitive assessment used by the British Army is the{" "}
        <b>Army Cognitive Test (ACT)</b>, which replaced the old BARB (British
        Army Recruit Battery) test. Yes, you can practise for it, and you
        definitely should.
      </p>

      <div className="help-grid">
        <section className="white-panel">
          <span className="help-number">GTI</span>
          <h2>Why your score matters</h2>
          <p>
            Your results produce a <b>General Trainability Index (GTI)</b>,
            calculated from both accuracy and speed across all five sections.
            Each Army role has a minimum GTI; the overall minimum to progress is
            26.
          </p>
          <p>
            For technical roles such as an electrician or electronics technician
            in the <b>Royal Engineers or REME</b>, scoring well is critical:
            engineering trades demand some of the highest cut-offs in the Army.
            Exact figures change with recruitment needs, so confirm yours with
            your recruiter.
          </p>
        </section>
        <section className="white-panel">
          <span className="help-number">45</span>
          <h2>What the test looks like</h2>
          <p>
            The ACT takes about <b>45 minutes</b> and has around{" "}
            <b>200 rapid-fire questions</b> across <b>five sub-tests</b>. It is
            taken on a touchscreen at the assessment centre.
          </p>
          <p>
            The challenge is rarely the difficulty of the material. It is the{" "}
            <b>strict time pressure</b> and the reliance on{" "}
            <b>short-term working memory</b>: the information disappears before
            you answer.
          </p>
        </section>
      </div>

      <section className="white-panel">
        <h2>The five sub-tests</h2>
        <div className="act-table-wrap">
          <table className="act-table">
            <thead>
              <tr>
                <th>Sub-test</th>
                <th>What it measures</th>
                <th>How it works</th>
                <th>In this trainer</th>
              </tr>
            </thead>
            <tbody>
              {subTests.map((t) => (
                <tr key={t.name}>
                  <td>
                    <b>{t.name}</b>
                  </td>
                  <td>{t.measures}</td>
                  <td>{t.how}</td>
                  <td>
                    {t.module ? (
                      <span className="pill ok">{t.module}</span>
                    ) : (
                      <span className="pill todo">Not yet covered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="estimate-note">
          Word Rules is not yet in this trainer; use the official Mindmill
          practice site below for that section. Timings and question counts are
          typical figures reported by preparation providers; the Army does not
          publish exact details.
        </p>
        <div className="callout">
          <b>Technical Selection Test (TST).</b> Candidates for technical trades
          in the Royal Engineers, Royal Signals and REME normally also sit a
          separate TST, covering GCSE-standard maths (including algebra and
          trigonometry) and basic electrical and mechanical physics. Ask the
          recruiter whether it applies to your chosen trade.
        </div>
      </section>

      <section className="white-panel">
        <h2>How to practise effectively</h2>
        <ol className="practice-steps">
          <li>
            <b>Official Mindmill practice.</b> Mindmill delivers the real ACT
            and runs an official practice site with all five sub-tests, which
            you can repeat as often as you like. Use it to get used to the
            real interface and pacing. Your recruiter may also send a link.{" "}
            <a
              href="https://practicequestions.mindmill.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the official practice site
            </a>
          </li>
          <li>
            <b>This trainer, daily.</b> Use the Tips & examples page to learn
            the method for each module, then drill with practice sessions and
            timed exams. Fifteen focused minutes a day beats one long session a
            week.
          </li>
          <li>
            <b>Third-party ACT simulators.</b> Paid platforms such as
            JobTestPrep and Army-Test offer full-length simulations of all five
            sub-tests, including Word Rules, with the same two-stage screens and
            timers.
          </li>
          <li>
            <b>Drill mental arithmetic.</b> Practise two-digit additions,
            subtractions and percentages in your head, without paper or a
            calculator, to build Number Fluency speed.
          </li>
          <li>
            <b>Master the screen switch.</b> Many candidates lose marks by
            rushing past the first screen before the rules or numbers are fixed
            in their head. Practise holding two or three pieces of information
            for five seconds before the options appear.
          </li>
          <li>
            <b>Speed and accuracy both count.</b> If a question seems too hard,
            make your best guess and move on rather than stalling.
          </li>
        </ol>
      </section>

      <div className="eyebrow help-divider">HOW THIS TRAINER WORKS</div>
      <h2 className="help-subtitle">Two stages. One focused mind.</h2>
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
