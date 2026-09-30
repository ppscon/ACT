export type FlashOp = "+" | "−";
export type FlashMode = "mixed" | "add" | "sub";
export type FlashCard = {
  id: string;
  a: number;
  b: number;
  op: FlashOp;
  answer: number;
  /** Round-and-adjust method, one line per step. */
  round: string[];
  /** Split tens and units method, one line per step. */
  split: string[];
};

const int = (lo: number, hi: number) =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo;
let serial = 0;

/** Two-digit addition or subtraction, matching the ACT number fluency range. */
export function makeFlashCard(mode: FlashMode = "mixed"): FlashCard {
  const op: FlashOp =
    mode === "add" ? "+" : mode === "sub" ? "−" : Math.random() < 0.5 ? "+" : "−";
  let a: number, b: number;
  if (op === "+") {
    a = int(11, 99);
    b = int(11, 99);
  } else {
    a = int(30, 99);
    b = int(11, a - 1);
  }
  return { id: `f-${++serial}`, ...explain(a, b, op) };
}

export function explain(a: number, b: number, op: FlashOp) {
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
  return { a, b, op, answer, round, split };
}
