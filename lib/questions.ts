export type Category = "reasoning" | "numbers" | "errors" | "spatial";
export type Selection = Category | "mixed";
export type ArrowCard = { blackTop: boolean; leftTop: boolean };
export type Question = {
  id: string;
  category: Category;
  stimulus: string[];
  prompt: string;
  choices: string[];
  correct: number;
  explanation: string;
  arrows?: ArrowCard[];
  memorise: number;
};
export const categories: Category[] = [
  "reasoning",
  "numbers",
  "errors",
  "spatial",
];
export const names: Record<Category, string> = {
  reasoning: "Deductive reasoning",
  numbers: "Number fluency",
  errors: "Error detection",
  spatial: "Spatial orientation",
};
const int = (a: number, b: number) =>
  Math.floor(Math.random() * (b - a + 1)) + a;
export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = int(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
let serial = 0;
// Distractors are drawn from both sides of the answer so its rank among the
// sorted options varies. Previously the answer was always the second-lowest
// option, which made the module guessable without doing the arithmetic.
function numericChoices(answer: number) {
  const offsets = shuffle([
    -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12,
  ]).filter((o) => answer + o > 0);
  return shuffle([answer, ...offsets.slice(0, 3).map((o) => answer + o)]).map(
    String,
  );
}
function numeric(
  q: Omit<Question, "id" | "category" | "choices" | "correct">,
  answer: number,
): Question {
  const choices = numericChoices(answer);
  while (choices.length < 4) {
    const v = String(answer + choices.length + 14);
    if (!choices.includes(v)) choices.push(v);
  }
  return {
    ...q,
    id: `q-${++serial}`,
    category: "numbers",
    choices,
    correct: choices.indexOf(String(answer)),
  };
}
export function generateQuestion(category: Category): Question {
  const id = `q-${++serial}`;
  if (category === "reasoning") {
    const entities = shuffle([
      "Tank",
      "Radar",
      "Radio",
      "Drone",
      "Land Rover",
      "Generator",
    ]).slice(0, int(3, 4));
    const attr = shuffle([
      ["faster", "slower", "fastest", "slowest"],
      ["newer", "older", "newest", "oldest"],
      ["heavier", "lighter", "heaviest", "lightest"],
      ["taller", "shorter", "tallest", "shortest"],
    ])[0];
    const stimulus = shuffle(
      entities
        .slice(0, -1)
        .map((v, i) =>
          Math.random() < 0.5
            ? `${v} is ${attr[0]} than ${entities[i + 1]}.`
            : `${entities[i + 1]} is ${attr[1]} than ${v}.`,
        ),
    );
    const target = int(0, entities.length === 3 ? 2 : 1);
    const entity =
      target === 0
        ? entities[0]
        : target === 1
          ? entities.at(-1)!
          : entities[1];
    const choices = shuffle(entities);
    return {
      id,
      category,
      stimulus,
      prompt:
        target === 2
          ? "Which entity is in the middle?"
          : `Which entity is the ${attr[target === 0 ? 2 : 3]}?`,
      choices,
      correct: choices.indexOf(entity),
      explanation: `From ${attr[2]} to ${attr[3]}: ${entities.join(" → ")}. ${entity} is the answer.`,
      memorise: 7,
    };
  }
  if (category === "numbers") {
    const type = int(0, 2);
    if (type === 0) {
      const percentage = shuffle([10, 20, 25, 50, 75])[0];
      const base = int(2, 25) * 20;
      const answer = (base * percentage) / 100;
      return numeric(
        {
          stimulus: [`${percentage}% of ${base}`],
          prompt: "What was the answer?",
          explanation: `${percentage}% of ${base} = ${base} × ${percentage} ÷ 100 = ${answer}.`,
          memorise: 7,
        },
        answer,
      );
    }
    if (type === 1) {
      const base = int(2, 20) * 20;
      const percentage = shuffle([10, 20, 25, 50, 75])[0];
      const a = (base * percentage) / 100;
      const delta = shuffle([-int(1, Math.min(8, a - 2)), 0, int(1, 8)])[0];
      const b = a + delta;
      const add = int(1, b - 1);
      const choices = ["Larger", "Smaller", "Equal"];
      return {
        id,
        category,
        stimulus: [`Expression A: ${percentage}% of ${base}`],
        prompt: `Expression B: ${add} + ${b - add}\nIs B larger, smaller, or equal to A?`,
        choices,
        correct: delta > 0 ? 0 : delta < 0 ? 1 : 2,
        explanation: `A = ${a}. B = ${add} + ${b - add} = ${b}. B is ${delta > 0 ? "larger than" : delta < 0 ? "smaller than" : "equal to"} A.`,
        memorise: 4,
      };
    }
    const a = int(30, 99),
      b = int(11, Math.min(a - 1, 89));
    const plus = Math.random() < 0.5;
    const answer = plus ? a + b : a - b;
    return numeric(
      {
        stimulus: [`${a} ${plus ? "+" : "−"} ${b}`],
        prompt: "What was the answer?",
        explanation: `${a} ${plus ? "+" : "−"} ${b} = ${answer}.`,
        memorise: 7,
      },
      answer,
    );
  }
  if (category === "errors") {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789#@%";
    const length = int(6, 9);
    const first = Array.from(
      { length },
      () => alphabet[int(0, alphabet.length - 1)],
    );
    const second = [...first];
    const count = int(0, 4);
    const positions = shuffle(Array.from({ length }, (_, i) => i))
      .slice(0, count)
      .sort((a, b) => a - b);
    positions.forEach((i) => {
      const options = [...alphabet].filter((c) => c !== first[i]);
      second[i] = options[int(0, options.length - 1)];
    });
    return {
      id,
      category,
      stimulus: [first.join(""), second.join("")],
      prompt: "How many characters were different?",
      choices: ["0", "1", "2", "3", "4"],
      correct: count,
      explanation: count
        ? `${count} ${count === 1 ? "difference" : "differences"} at ${count === 1 ? "position" : "positions"} ${positions.map((p) => p + 1).join(", ")}. ${first.join("")} / ${second.join("")}`
        : `Both strings were identical: ${first.join("")}.`,
      memorise: 6,
    };
  }
  const blackTop = Math.random() < 0.5,
    leftTop = Math.random() < 0.5;
  const arrows = shuffle([
    { blackTop: true, leftTop: true },
    { blackTop: true, leftTop: false },
    { blackTop: false, leftTop: true },
    { blackTop: false, leftTop: false },
  ]);
  return {
    id,
    category,
    stimulus: [
      `Black arrow is ${blackTop ? "ABOVE" : "BELOW"} white arrow.`,
      `Pointing LEFT is ${leftTop ? "ABOVE" : "BELOW"} pointing RIGHT.`,
    ],
    prompt: "Which card follows both rules?",
    choices: ["Card A", "Card B", "Card C", "Card D"],
    arrows,
    correct: arrows.findIndex(
      (c) => c.blackTop === blackTop && c.leftTop === leftTop,
    ),
    explanation: `The top arrow must be ${blackTop ? "black" : "white"} and point ${leftTop ? "left" : "right"}. The bottom arrow must be ${blackTop ? "white" : "black"} and point ${leftTop ? "right" : "left"}.`,
    memorise: 7,
  };
}
export function makeBlock(selection: Selection): Question[] {
  return shuffle(
    selection === "mixed"
      ? categories.flatMap((c) =>
          Array.from({ length: 5 }, () => generateQuestion(c)),
        )
      : Array.from({ length: 20 }, () => generateQuestion(selection)),
  );
}
