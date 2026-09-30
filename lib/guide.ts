import type { ArrowCard, Category } from "./questions";

export type Step = { text: string; code?: string };
export type Tip = { title: string; text: string; example?: string };
export type Example = {
  stimulus: string[];
  question: string;
  options: string[];
  answer: string;
  working: string;
  cards?: ArrowCard[];
};
export type Guide = {
  id: Category;
  title: string;
  tag: string;
  summary: string;
  screenOne: string;
  screenTwo: string;
  worked: {
    stimulus: string[];
    mappingIntro: string;
    steps: Step[];
    chain?: string;
    question: string;
    options: string[];
    answer: string;
    why: string;
    cards?: ArrowCard[];
  };
  techniques: Tip[];
  traps: Tip[];
  examples: Example[];
  quickTip: string;
};

// Fixed card layouts used by the spatial examples.
const A: ArrowCard = { blackTop: true, leftTop: true };
const B: ArrowCard = { blackTop: true, leftTop: false };
const C: ArrowCard = { blackTop: false, leftTop: true };
const D: ArrowCard = { blackTop: false, leftTop: false };

export const guides: Guide[] = [
  {
    id: "reasoning",
    title: "Deductive reasoning",
    tag: "LOGIC & MEMORY",
    summary:
      "A two-stage working memory puzzle. You read short comparisons, build an ordered sequence in your head, hold it for a few seconds, then answer without seeing the statements again.",
    screenOne:
      "Two or three comparative statements (speed, age, weight or height). A short timer runs, or you select Ready / Proceed once you have the order.",
    screenTwo:
      "The statements disappear completely. One question asks for an extreme (the fastest, the oldest) or the item in the middle, with a button for each item.",
    worked: {
      stimulus: [
        "The Radio is older than the Radar.",
        "The Generator is older than the Radio.",
      ],
      mappingIntro:
        "Do not memorise the sentences word for word; language memory fades quickly under pressure. Turn them into a single line instead:",
      steps: [
        { text: "Statement 1 gives", code: "Radio > Radar (Radio is older)" },
        { text: "Statement 2 gives", code: "Generator > Radio" },
        { text: "Join them on the shared item, Radio:" },
      ],
      chain: "Generator (oldest)  →  Radio (middle)  →  Radar (newest)",
      question: "Which item is the newest?",
      options: ["Radio", "Radar", "Generator"],
      answer: "Radar",
      why: "Radar sits at the newest end of your chain. Hold just three words: Generator, Radio, Radar.",
    },
    techniques: [
      {
        title: "Always write the chain in one direction",
        text: "Decide that the left end is always the 'most' (fastest, oldest, heaviest, tallest). When a statement uses the opposite word, flip it before placing it.",
        example: "\"The Drone is slower than the Tank\" becomes Tank > Drone.",
      },
      {
        title: "Find the link first",
        text: "One item appears in two statements. That is the middle of a three-item chain; place it first and hang the other two either side.",
      },
      {
        title: "Rehearse the order, not the words",
        text: "Say the chain silently two or three times, such as \"Tank, Radio, Drone\". A rhythm of three names is far easier to hold than two full sentences.",
      },
      {
        title: "Note which end is 'most'",
        text: "Keep the attribute with the chain: \"fastest first: Tank, Radio, Drone\". Then any question (fastest, slowest, middle) is a lookup.",
      },
      {
        title: "Four items: build as you read",
        text: "With three statements they may be out of order. Start with any statement, then add each item to the correct end as its link appears.",
      },
    ],
    traps: [
      {
        title: "The inversion trap",
        text: "Directions are mixed on purpose. One statement says 'older', the next says 'newer'.",
        example:
          "\"The Truck is faster than the Tank. The Jeep is slower than the Tank.\" Chain: Truck > Tank > Jeep. Slowest: Jeep.",
      },
      {
        title: "Reading the question carelessly",
        text: "Candidates build the correct chain, then pick the oldest when the question asked for the newest. Read the last word of the question before you click.",
      },
      {
        title: "The middle question",
        text: "Sometimes phrased as \"neither the oldest nor the newest\". If your chain is formed, the middle item is instantly visible.",
      },
      {
        title: "Recognising a name is not remembering its place",
        text: "Every option looks familiar because you just read it. Answer from your chain, never from which name 'feels' right.",
      },
    ],
    examples: [
      {
        stimulus: [
          "The Tank is heavier than the Drone.",
          "The Drone is heavier than the Radio.",
        ],
        question: "Which item is the lightest?",
        options: ["Tank", "Drone", "Radio"],
        answer: "Radio",
        working: "Heaviest first: Tank > Drone > Radio. Lightest is Radio.",
      },
      {
        stimulus: [
          "The Radar is newer than the Generator.",
          "The Land Rover is older than the Generator.",
        ],
        question: "Which item is the oldest?",
        options: ["Radar", "Generator", "Land Rover"],
        answer: "Land Rover",
        working:
          "Flip to one direction, oldest first: Land Rover > Generator > Radar. Oldest is Land Rover.",
      },
      {
        stimulus: [
          "The Drone is slower than the Radio.",
          "The Tank is faster than the Radio.",
        ],
        question: "Which item is the fastest?",
        options: ["Drone", "Radio", "Tank"],
        answer: "Tank",
        working:
          "Radio is the link. Fastest first: Tank > Radio > Drone. Fastest is Tank.",
      },
      {
        stimulus: [
          "The Generator is shorter than the Radar.",
          "The Tank is shorter than the Generator.",
        ],
        question: "Which item is in the middle?",
        options: ["Generator", "Radar", "Tank"],
        answer: "Generator",
        working:
          "Tallest first: Radar > Generator > Tank. The middle item is Generator.",
      },
      {
        stimulus: [
          "The Radio is lighter than the Drone.",
          "The Tank is heavier than the Generator.",
          "The Generator is heavier than the Drone.",
        ],
        question: "Which item is the heaviest?",
        options: ["Radio", "Drone", "Tank", "Generator"],
        answer: "Tank",
        working:
          "Build as you read: Drone > Radio, then Generator > Drone, then Tank > Generator. Heaviest first: Tank > Generator > Drone > Radio.",
      },
      {
        stimulus: [
          "The Land Rover is older than the Radar.",
          "The Drone is newer than the Radio.",
          "The Radar is older than the Radio.",
        ],
        question: "Which item is the newest?",
        options: ["Land Rover", "Radar", "Drone", "Radio"],
        answer: "Drone",
        working:
          "Oldest first: Land Rover > Radar > Radio > Drone. The newest is Drone.",
      },
      {
        stimulus: [
          "The Radar is taller than the Tank.",
          "The Tank is taller than the Radio.",
        ],
        question: "Which item is neither the tallest nor the shortest?",
        options: ["Radio", "Radar", "Tank"],
        answer: "Tank",
        working:
          "Tallest first: Radar > Tank > Radio. 'Neither tallest nor shortest' means the middle: Tank.",
      },
    ],
    quickTip:
      "Turn every statement into one direction (most on the left), join them on the shared item, and rehearse the three names.",
  },
  {
    id: "numbers",
    title: "Number fluency",
    tag: "MENTAL ARITHMETIC",
    summary:
      "Quick mental arithmetic with a memory twist. You work out the answer while the sum is on screen, then choose it from similar-looking options after the sum has gone.",
    screenOne:
      "A calculation such as 25% of 80 or 67 + 48. Work it out immediately; you are remembering the answer, not the sum.",
    screenTwo:
      "The sum disappears. Pick the answer from four close options, or (in comparison questions) decide whether a new expression B is larger, smaller or equal to A.",
    worked: {
      stimulus: ["75% of 240"],
      mappingIntro:
        "Never try to hold the sum and work it out later. Solve it on Screen 1 using simple building blocks:",
      steps: [
        { text: "Half of 240", code: "50% = 120" },
        { text: "Half again", code: "25% = 60" },
        { text: "Add the two", code: "75% = 120 + 60 = 180" },
      ],
      chain: "Hold one number: 180",
      question: "What was the answer?",
      options: ["174", "180", "186", "190"],
      answer: "180",
      why: "The options are deliberately close, so an estimate is not enough. Lock in the exact figure before Screen 2 appears.",
    },
    techniques: [
      {
        title: "Percentages from building blocks",
        text: "10% means divide by 10. 20% is double 10%. 50% is half, 25% is half of half, 75% is 50% + 25%.",
        example: "20% of 380: 10% is 38, doubled is 76.",
      },
      {
        title: "Round and adjust for addition",
        text: "Add to the nearest ten, then correct.",
        example: "67 + 48 → 67 + 50 = 117, minus 2 = 115.",
      },
      {
        title: "Compensate for subtraction",
        text: "Subtract a round number, then give back the difference.",
        example: "92 − 57 → 92 − 60 = 32, plus 3 = 35.",
      },
      {
        title: "Comparison questions: shrink A to one number",
        text: "Work out A on Screen 1 and keep only that number. When B appears, calculate it and compare. Read whether you are asked about B compared with A.",
      },
      {
        title: "Say the answer, then stop",
        text: "Once you have the answer, repeat it silently and select Ready / Proceed. Extra time on Screen 1 only lets the number fade.",
      },
    ],
    traps: [
      {
        title: "Near-miss options",
        text: "Wrong answers sit a few either side of the correct one, including ten out (a carrying error). Check the last digit as well as the size.",
        example: "For 67 + 48, 105 and 125 are classic carrying mistakes.",
      },
      {
        title: "Direction in comparisons",
        text: "\"Is B larger than A?\" is about B. If A = 70 and B = 67, the answer is Smaller.",
      },
      {
        title: "Equal is a real answer",
        text: "Comparisons are sometimes exactly equal. Do not assume there must be a difference.",
      },
      {
        title: "Minus signs",
        text: "Check whether the sum was + or − before you calculate. It is easy to add out of habit.",
      },
    ],
    examples: [
      {
        stimulus: ["25% of 160"],
        question: "What was the answer?",
        options: ["36", "40", "44", "32"],
        answer: "40",
        working: "25% is a quarter: 160 ÷ 4 = 40.",
      },
      {
        stimulus: ["20% of 380"],
        question: "What was the answer?",
        options: ["68", "72", "76", "86"],
        answer: "76",
        working: "10% is 38. Double it: 76.",
      },
      {
        stimulus: ["67 + 48"],
        question: "What was the answer?",
        options: ["105", "113", "115", "125"],
        answer: "115",
        working: "67 + 50 = 117, then take off 2: 115.",
      },
      {
        stimulus: ["92 − 57"],
        question: "What was the answer?",
        options: ["35", "45", "33", "25"],
        answer: "35",
        working: "92 − 60 = 32, then add back 3: 35.",
      },
      {
        stimulus: ["75% of 80"],
        question: "What was the answer?",
        options: ["55", "60", "65", "70"],
        answer: "60",
        working: "50% is 40, 25% is 20. Together: 60.",
      },
      {
        stimulus: ["Expression A: 50% of 140"],
        question: "Expression B: 38 + 29. Is B larger, smaller or equal to A?",
        options: ["Larger", "Smaller", "Equal"],
        answer: "Smaller",
        working: "A = 70. B = 38 + 29 = 67. 67 is smaller than 70.",
      },
      {
        stimulus: ["Expression A: 10% of 460"],
        question: "Expression B: 19 + 27. Is B larger, smaller or equal to A?",
        options: ["Larger", "Smaller", "Equal"],
        answer: "Equal",
        working: "A = 46. B = 19 + 27 = 46. They are equal.",
      },
      {
        stimulus: ["Expression A: 25% of 200"],
        question: "Expression B: 23 + 31. Is B larger, smaller or equal to A?",
        options: ["Larger", "Smaller", "Equal"],
        answer: "Larger",
        working: "A = 50. B = 54. B is larger.",
      },
    ],
    quickTip:
      "Solve on Screen 1 and hold one number. Use building blocks: 10%, half, quarter; round and adjust for + and −.",
  },
  {
    id: "errors",
    title: "Error detection",
    tag: "ATTENTION TO DETAIL",
    summary:
      "Two codes appear one above the other. You count how many characters differ, then give that count after the codes have gone. It rewards a steady, systematic scan.",
    screenOne:
      "Two strings of 6 to 9 letters, numbers and symbols, such as KX9#47B over KX9#77B. You have slightly less time here than in other modules.",
    screenTwo:
      "The codes disappear. Choose how many characters were different, from 0 to 4.",
    worked: {
      stimulus: ["PQ7@M2ZH", "PB7@N2ZH"],
      mappingIntro:
        "Do not try to remember the codes. Count the differences on Screen 1 using fixed chunks:",
      steps: [
        { text: "Chunk 1", code: "PQ7 / PB7  → 1 (Q vs B)" },
        { text: "Chunk 2", code: "@M2 / @N2  → 1 (M vs N)" },
        { text: "Chunk 3", code: "ZH / ZH    → 0" },
      ],
      chain: "Running total: 2",
      question: "How many characters were different?",
      options: ["0", "1", "2", "3", "4"],
      answer: "2",
      why: "Holding a single running number is far easier than holding two eight-character codes.",
    },
    techniques: [
      {
        title: "Chunk into threes",
        text: "Split each code into groups of three and compare group by group, left to right. KX9#47B becomes KX9 | #47 | B.",
      },
      {
        title: "Keep a running total",
        text: "Say the count silently as you go: \"one... one... two\". When you finish the last chunk, the number in your head is your answer.",
      },
      {
        title: "Same route every time",
        text: "Always scan left to right and never jump to a character that 'looks odd'. A fixed route stops you counting one position twice or skipping one.",
      },
      {
        title: "One pass, then a quick check",
        text: "If you have time left after one full pass, do a fast second pass. If the two counts disagree, trust the slower one.",
      },
    ],
    traps: [
      {
        title: "Lookalike characters",
        text: "The easiest differences to miss are shapes that resemble each other.",
        example: "8 and B, 5 and S, 2 and Z, 6 and G, M and N, U and V, W and V.",
      },
      {
        title: "Stopping after the first difference",
        text: "Finding one change makes the brain feel the job is done. Always finish the whole code.",
      },
      {
        title: "Zero is a valid answer",
        text: "Sometimes the codes are identical. If your careful scan finds nothing, answer 0 with confidence.",
      },
      {
        title: "Symbols count",
        text: "# @ and % are characters like any other. A # changed to @ is one difference.",
      },
    ],
    examples: [
      {
        stimulus: ["KX9#47B", "KX9#77B"],
        question: "How many characters were different?",
        options: ["0", "1", "2", "3", "4"],
        answer: "1",
        working: "KX9 | #47 | B vs KX9 | #77 | B. Only the 4 became 7.",
      },
      {
        stimulus: ["38SG%TW5", "3BS6%TW5"],
        question: "How many characters were different?",
        options: ["0", "1", "2", "3", "4"],
        answer: "2",
        working: "Lookalikes: 8 became B and G became 6. Everything else matches.",
      },
      {
        stimulus: ["HM4#UV9", "HM4#UV9"],
        question: "How many characters were different?",
        options: ["0", "1", "2", "3", "4"],
        answer: "0",
        working: "The codes are identical, character for character.",
      },
      {
        stimulus: ["Z52RX@KE", "252RX%KF"],
        question: "How many characters were different?",
        options: ["0", "1", "2", "3", "4"],
        answer: "3",
        working: "Z became 2, @ became %, E became F.",
      },
      {
        stimulus: ["DW7Y3#QA", "DV7Y8@QR"],
        question: "How many characters were different?",
        options: ["0", "1", "2", "3", "4"],
        answer: "4",
        working: "W became V, 3 became 8, # became @, A became R.",
      },
      {
        stimulus: ["NU6T%M", "MU6T%N"],
        question: "How many characters were different?",
        options: ["0", "1", "2", "3", "4"],
        answer: "2",
        working: "N and M swapped places: the first and last characters both changed.",
      },
    ],
    quickTip:
      "Chunk into threes, scan left to right and keep a running count. Watch lookalikes such as 8/B, 5/S and M/N.",
  },
  {
    id: "spatial",
    title: "Spatial orientation",
    tag: "SPATIAL REASONING",
    summary:
      "Two rules describe a pair of stacked arrows. After the rules disappear, pick the card whose arrows follow both. The secret is that you only need to picture one arrow.",
    screenOne:
      "Two rules, one about colour (black above or below white) and one about direction (pointing left above or below pointing right).",
    screenTwo:
      "The rules disappear. Four cards appear, each with a black and a white arrow pointing opposite ways. Choose the one that fits both rules.",
    worked: {
      stimulus: [
        "Black arrow is BELOW white arrow.",
        "Pointing LEFT is ABOVE pointing RIGHT.",
      ],
      mappingIntro:
        "Every card has one black and one white arrow, pointing opposite ways. So if you know the top arrow, you know the whole card. Reduce both rules to the top arrow:",
      steps: [
        { text: "Black is BELOW, so the top arrow is", code: "WHITE" },
        { text: "Left is ABOVE, so the top arrow points", code: "LEFT" },
        { text: "Picture one arrow:" },
      ],
      chain: "Top arrow: white, pointing left",
      question: "Which card follows both rules?",
      options: ["Card A", "Card B", "Card C", "Card D"],
      answer: "Card C",
      why: "Check only the top arrow of each card. Card C is the only one whose top arrow is white and points left.",
      cards: [A, B, C, D],
    },
    techniques: [
      {
        title: "Only remember the top arrow",
        text: "The bottom arrow is always the opposite colour and direction. Two rules become one picture: a colour and a direction.",
      },
      {
        title: "BELOW means 'the other one'",
        text: "If black is BELOW, the top arrow is white. If left is BELOW, the top arrow points right.",
      },
      {
        title: "Picture it, do not recite it",
        text: "Form a quick mental image of the single top arrow (\"white, pointing left\"). An image survives the screen change better than two sentences.",
      },
      {
        title: "Scan the top row of the cards",
        text: "On Screen 2, look only at the top arrow of each card, A to D. Exactly one card will match.",
      },
    ],
    traps: [
      {
        title: "Missing the word BELOW",
        text: "ABOVE and BELOW are the only words that change. Read them first, then the colour and direction.",
      },
      {
        title: "Left and right from your view",
        text: "Left means the arrowhead points to the left of your screen. Do not imagine it from the arrow's point of view.",
      },
      {
        title: "Checking both arrows",
        text: "Checking the bottom arrow as well wastes time and adds chances to confuse yourself. The top arrow is enough.",
      },
      {
        title: "Mixing up the two rules",
        text: "The colour rule decides colour only; the direction rule decides direction only. Keep them in separate slots.",
      },
    ],
    examples: [
      {
        stimulus: [
          "Black arrow is ABOVE white arrow.",
          "Pointing LEFT is ABOVE pointing RIGHT.",
        ],
        question: "Which card follows both rules?",
        options: ["Card A", "Card B", "Card C", "Card D"],
        answer: "Card B",
        working: "Top arrow: black, pointing left.",
        cards: [D, A, C, B],
      },
      {
        stimulus: [
          "Black arrow is ABOVE white arrow.",
          "Pointing LEFT is BELOW pointing RIGHT.",
        ],
        question: "Which card follows both rules?",
        options: ["Card A", "Card B", "Card C", "Card D"],
        answer: "Card D",
        working: "Left is BELOW, so the top arrow points right. Top arrow: black, pointing right.",
        cards: [A, C, D, B],
      },
      {
        stimulus: [
          "Black arrow is BELOW white arrow.",
          "Pointing LEFT is BELOW pointing RIGHT.",
        ],
        question: "Which card follows both rules?",
        options: ["Card A", "Card B", "Card C", "Card D"],
        answer: "Card A",
        working: "Both rules say BELOW, so flip both: top arrow is white, pointing right.",
        cards: [D, B, A, C],
      },
      {
        stimulus: [
          "Black arrow is BELOW white arrow.",
          "Pointing LEFT is ABOVE pointing RIGHT.",
        ],
        question: "Which card follows both rules?",
        options: ["Card A", "Card B", "Card C", "Card D"],
        answer: "Card B",
        working: "Top arrow: white, pointing left.",
        cards: [B, C, A, D],
      },
    ],
    quickTip:
      "Reduce both rules to the top arrow: its colour and its direction. BELOW means the opposite.",
  },
];

export const generalTips: Tip[] = [
  {
    title: "Solve on Screen 1, hold on Screen 2",
    text: "Every module is the same shape: do the work while the information is visible, and carry the smallest possible result forward (a chain, a number, a count or one arrow).",
  },
  {
    title: "Proceed early when you are ready",
    text: "Once you have the answer in your head, select Ready / Proceed. Waiting only gives your memory time to fade.",
  },
  {
    title: "Never leave a question blank",
    text: "In this trainer a timeout scores the same as a wrong answer, so if you are unsure, make your best choice rather than running out the clock.",
  },
  {
    title: "Let a bad question go",
    text: "One mistake does not decide a test. Dwelling on it costs you the next question too. Reset and focus on the new screen.",
  },
  {
    title: "Build up in stages",
    text: "Start with practice drills and feedback on, one module at a time. Then turn feedback off, move to all-round training, and finish with timed exams.",
  },
  {
    title: "Little and often",
    text: "Fifteen focused minutes a day beats one long session a week. Check the Performance tab to see which module needs the most work.",
  },
];

export const guideFor = (id: Category) => guides.find((g) => g.id === id)!;
