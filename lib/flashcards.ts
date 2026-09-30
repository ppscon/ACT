export type FlashKind = "add" | "sub" | "pct";
export type FlashMode = "mixed" | FlashKind;
export type Method = { title: string; lines: string[] };
export type FlashCard = {
  id: string;
  kind: FlashKind;
  /** Front of the card: left, operator, right, e.g. "25%", "of", "48". */
  left: string;
  op: string;
  right: string;
  answer: number;
  methods: Method[];
};

const int = (lo: number, hi: number) =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo;
const pick = <T,>(xs: T[]) => xs[int(0, xs.length - 1)];
let serial = 0;

import { PERCENTS, percentBase, type Percent } from "./questions";

export function makeFlashCard(mode: FlashMode = "mixed"): FlashCard {
  const kind: FlashKind = mode === "mixed" ? pick(["add", "sub", "pct"]) : mode;
  const id = `f-${++serial}`;
  if (kind === "pct") {
    const p = pick([...PERCENTS]);
    return { id, ...explainPercent(p, percentBase(p)) };
  }
  if (kind === "add") return { id, ...explain(int(11, 99), int(11, 99), "+") };
  const a = int(30, 99);
  return { id, ...explain(a, int(11, a - 1), "−") };
}

export function explainPercent(p: Percent, base: number) {
  const answer = (base * p) / 100;
  const half = base / 2;
  const quarter = base / 4;
  const tenth = base / 10;
  let methods: Method[];
  if (p === 10)
    methods = [
      { title: "Divide by 10", lines: [`${base} ÷ 10 = ${answer}`] },
      {
        title: "Shift the digits",
        lines: [
          `Move every digit one place right: ${base} becomes ${answer}`,
          `Check: ${answer} × 10 = ${base}`,
        ],
      },
    ];
  else if (p === 20)
    methods = [
      { title: "Divide by 5", lines: [`20% is one fifth: ${base} ÷ 5 = ${answer}`] },
      base % 10 === 0
        ? {
            title: "10%, then double",
            lines: [`10%: ${base} ÷ 10 = ${tenth}`, `Double: ${tenth} × 2 = ${answer}`],
          }
        : {
            title: "Double, then ÷ 10",
            lines: [`Double: ${base} × 2 = ${base * 2}`, `÷ 10: ${base * 2} ÷ 10 = ${answer}`],
          },
    ];
  else if (p === 25)
    methods = [
      {
        title: "Half, then half again",
        lines: [`Half: ${base} ÷ 2 = ${half}`, `Half again: ${half} ÷ 2 = ${answer}`],
      },
      { title: "Divide by 4", lines: [`25% is one quarter: ${base} ÷ 4 = ${answer}`] },
    ];
  else if (p === 50) {
    const units = base % 10;
    const tens = base - units;
    methods = [
      { title: "Halve it", lines: [`50% is one half: ${base} ÷ 2 = ${answer}`] },
      {
        title: "Split, then halve",
        lines:
          units === 0
            ? [`${base} ÷ 2 = ${answer}`]
            : [
                `Halve the tens: ${tens} ÷ 2 = ${tens / 2}`,
                `Halve the units: ${units} ÷ 2 = ${units / 2}`,
                `Add: ${tens / 2} + ${units / 2} = ${answer}`,
              ],
      },
    ];
  } else
    methods = [
      {
        title: "50% + 25%",
        lines: [
          `50%: ${base} ÷ 2 = ${half}`,
          `25%: ${half} ÷ 2 = ${quarter}`,
          `Add: ${half} + ${quarter} = ${answer}`,
        ],
      },
      {
        title: "Take off a quarter",
        lines: [
          `25%: ${base} ÷ 4 = ${quarter}`,
          `100% − 25%: ${base} − ${quarter} = ${answer}`,
        ],
      },
    ];
  return {
    kind: "pct" as const,
    left: `${p}%`,
    op: "of",
    right: String(base),
    answer,
    methods,
  };
}

export function explain(a: number, b: number, op: "+" | "−") {
  const answer = op === "+" ? a + b : a - b;
  const bt = Math.floor(b / 10) * 10;
  const bu = b % 10;
  let r = Math.round(b / 10) * 10; // nearest ten
  // For subtraction, never round past a (96 − 95 must not become 96 − 100).
  if (op === "−" && r > a) r = bt;
  const d = r - b; // how far we rounded (+ up, − down)
  let round: string[];
  let split: string[];
  if (op === "+") {
    const x = a + r;
    round =
      d === 0
        ? [`${b} is already a round number: ${a} + ${b} = ${answer}`]
        : [
            `Round ${b} to ${r}: ${a} + ${r} = ${x}`,
            d > 0
              ? `You added ${d} too many, so take off ${d}: ${x} − ${d} = ${answer}`
              : `You added ${-d} too few, so add ${-d}: ${x} + ${-d} = ${answer}`,
          ];
    const at = Math.floor(a / 10) * 10;
    const au = a % 10;
    split = [
      `Tens: ${at} + ${bt} = ${at + bt}`,
      `Units: ${au} + ${bu} = ${au + bu}`,
      `Total: ${at + bt} + ${au + bu} = ${answer}`,
    ];
  } else {
    const x = a - r;
    round =
      d === 0
        ? [`${b} is already a round number: ${a} − ${b} = ${answer}`]
        : [
            `Round ${b} to ${r}: ${a} − ${r} = ${x}`,
            d > 0
              ? `You took off ${d} too many, so give back ${d}: ${x} + ${d} = ${answer}`
              : `You took off ${-d} too few, so take off ${-d} more: ${x} − ${-d} = ${answer}`,
          ];
    split =
      bu === 0
        ? [`Take off the tens: ${a} − ${bt} = ${answer}`]
        : [
            `Take off the tens: ${a} − ${bt} = ${a - bt}`,
            `Take off the units: ${a - bt} − ${bu} = ${answer}`,
          ];
  }
  return {
    kind: (op === "+" ? "add" : "sub") as FlashKind,
    left: String(a),
    op,
    right: String(b),
    answer,
    methods: [
      { title: "Round and adjust", lines: round },
      { title: "Split tens and units", lines: split },
    ],
  };
}
