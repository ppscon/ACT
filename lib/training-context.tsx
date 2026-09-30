"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import {
  generateQuestion,
  makeBlock,
  categories,
  type Question,
  type Selection,
} from "./questions";
export type Mode = "exam" | "practice";
export type Settings = {
  selection: Selection;
  mode: Mode;
  memorise: number;
  answer: number;
  sound: boolean;
  feedback: boolean;
};
export type Response = {
  question: Question;
  choice: number | null;
  latency: number;
};
export type Report = {
  id: string;
  date: string;
  mode: Mode;
  selection: Selection;
  responses: Response[];
};
export type Session = {
  id: string;
  questions: Question[];
  index: number;
  stage: "stimulus" | "answer" | "feedback" | "done";
  responses: Response[];
  settings: Settings;
  started: number;
};
type Action =
  | { type: "start"; settings: Settings }
  | { type: "ready" }
  | { type: "answer"; choice: number | null; latency: number }
  | { type: "next" }
  | { type: "finish" }
  | { type: "reset" };
function next(s: Session): Session {
  if (s.settings.mode === "exam" && s.index === 19)
    return { ...s, stage: "done" };
  const questions =
    s.settings.mode === "practice"
      ? [
          ...s.questions,
          generateQuestion(
            s.settings.selection === "mixed"
              ? categories[(s.index + 1) % 4]
              : s.settings.selection,
          ),
        ]
      : s.questions;
  return { ...s, questions, index: s.index + 1, stage: "stimulus" };
}
export function sessionReducer(s: Session | null, a: Action): Session | null {
  if (a.type === "start")
    return {
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      questions:
        a.settings.mode === "exam"
          ? makeBlock(a.settings.selection)
          : [
              generateQuestion(
                a.settings.selection === "mixed"
                  ? categories[0]
                  : a.settings.selection,
              ),
            ],
      index: 0,
      stage: "stimulus",
      responses: [],
      settings: { ...a.settings },
      started: Date.now(),
    };
  if (a.type === "reset") return null;
  if (!s) return s;
  if (a.type === "ready")
    return s.stage === "stimulus" ? { ...s, stage: "answer" } : s;
  if (a.type === "answer") {
    if (s.stage !== "answer") return s;
    const updated = {
      ...s,
      responses: [
        ...s.responses,
        {
          question: s.questions[s.index],
          choice: a.choice,
          latency: a.latency,
        },
      ],
    };
    return s.settings.mode === "practice" && s.settings.feedback
      ? { ...updated, stage: "feedback" }
      : next(updated);
  }
  if (a.type === "next") return s.stage === "feedback" ? next(s) : s;
  if (a.type === "finish")
    return s.responses.length ? { ...s, stage: "done" } : null;
  return s;
}
const defaults: Settings = {
  selection: "mixed",
  mode: "exam",
  memorise: 0,
  answer: 6,
  sound: true,
  feedback: true,
};
const Context = createContext<null | {
  settings: Settings;
  update: (v: Partial<Settings>) => void;
  session: Session | null;
  dispatch: React.Dispatch<Action>;
  history: Report[];
  storageAvailable: boolean;
  beep: (frequency?: number) => void;
}>(null);
export function TrainingProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaults);
  const [history, setHistory] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [session, dispatch] = useReducer(sessionReducer, null);
  const saved = useRef("");
  const audio = useRef<AudioContext | null>(null);
  // Hydrate from localStorage after mount. The page is statically prerendered,
  // so reading storage during render would cause a hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("act-training-v1");
      if (raw) {
        const d = JSON.parse(raw);
        if (Array.isArray(d.history))
          setHistory(
            d.history
              .filter(
                (r: Report) =>
                  Array.isArray(r.responses) && r.responses.length > 0,
              )
              .slice(0, 50),
          );
        if (d.settings && typeof d.settings === "object") {
          const x = d.settings;
          setSettings({
            ...defaults,
            selection: [...categories, "mixed"].includes(x.selection)
              ? x.selection
              : "mixed",
            mode: x.mode === "practice" ? "practice" : "exam",
            memorise:
              x.memorise === 0 || (x.memorise >= 5 && x.memorise <= 10)
                ? x.memorise
                : 0,
            answer: x.answer >= 4 && x.answer <= 8 ? x.answer : 6,
            sound: typeof x.sound === "boolean" ? x.sound : true,
            feedback: typeof x.feedback === "boolean" ? x.feedback : true,
          });
        }
      }
    } catch {
      setStorageAvailable(false);
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(
          "act-training-v1",
          JSON.stringify({ settings, history }),
        );
      } catch {
        setStorageAvailable(false);
      }
  }, [settings, history, loaded]);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (session?.stage === "done" && saved.current !== session.id) {
      saved.current = session.id;
      setHistory((h) =>
        [
          {
            id: session.id,
            date: new Date().toISOString(),
            mode: session.settings.mode,
            selection: session.settings.selection,
            responses: session.responses,
          },
          ...h,
        ].slice(0, 50),
      );
    }
  }, [session]);
  const update = useCallback(
    (v: Partial<Settings>) => setSettings((s) => ({ ...s, ...v })),
    [],
  );
  const beep = useCallback(
    (frequency = 600) => {
      if (!settings.sound) return;
      try {
        audio.current ??= new AudioContext();
        void audio.current.resume();
        const o = audio.current.createOscillator(),
          g = audio.current.createGain();
        o.frequency.value = frequency;
        g.gain.setValueAtTime(0.045, audio.current.currentTime);
        g.gain.exponentialRampToValueAtTime(
          0.001,
          audio.current.currentTime + 0.09,
        );
        o.connect(g);
        g.connect(audio.current.destination);
        o.start();
        o.stop(audio.current.currentTime + 0.1);
      } catch {}
    },
    [settings.sound],
  );
  return (
    <Context.Provider
      value={{
        settings,
        update,
        session,
        dispatch,
        history,
        storageAvailable,
        beep,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useTraining() {
  const c = useContext(Context);
  if (!c) throw Error("Training provider missing");
  return c;
}
export const accuracy = (r: Response[]) =>
  r.length
    ? Math.round(
        (100 * r.filter((x) => x.choice === x.question.correct).length) /
          r.length,
      )
    : 0;
export const average = (r: Response[]) =>
  r.length ? Math.round(r.reduce((a, b) => a + b.latency, 0) / r.length) : 0;
