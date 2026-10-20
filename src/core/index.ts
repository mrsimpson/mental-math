// The trainer's logic: a round of mental arithmetic tasks drawn from the seed and the settings the learner chose.
// A task is answered by picking one of four numbers or by typing the result; a wrong answer is a failed attempt with a
// message for the typical mistake, after three the task ends with its solution. The stopwatch is optional and counts
// ticks. Pure TypeScript without DOM; the runtime keeps the state and calls start, step and tick
// (@lernapps/app-templates/interactive).
import type { Input } from "@lernapps/app-templates/interactive";
import settings from "../data/settings.json" with { type: "json" };

export type Op = "plus" | "minus" | "mal" | "geteilt";
export type Mode = "choice" | "input";

/** What the learner chooses before a round. */
export interface Settings {
  ops: Op[];
  range: number;
  count: number;
  terms: number;
  mode: Mode;
  timer: boolean;
}

/** A typical wrong answer: its value and the kind of mistake that leads to it (the key of its message). */
export interface Mistake {
  value: number;
  kind: string;
}

/** One task: `expr` is the calculation without result, `path` the way to the solution. */
export interface Task {
  op: Op;
  expr: string;
  answer: number;
  options: number[];
  mistakes: Mistake[];
  path: string;
}

export interface State {
  seed: number;
  route: string;
  phase: "setup" | "playing" | "done";
  settings: Settings;
  tasks: Task[];
  /** The task to solve now. */
  index: number;
  /** Failed attempts at the task now. */
  attempts: number;
  /** Failed attempts of the whole round. */
  failures: number;
  /** Milliseconds of the stopwatch. */
  elapsed: number;
  /** What the last change was. */
  last: "setup" | "start" | "right" | "wrong" | "reveal";
  /** The kind of mistake of the last wrong answer, "" when it is none of the typical ones. */
  mistake: string;
}

const OPS: readonly Op[] = ["plus", "minus", "mal", "geteilt"];

type Random = () => number;

/** A random number from 0 to 1 for each call, the same sequence for the same seed (mulberry32). */
function random(seed: number): Random {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** A whole number from `low` to `high`, both included. */
const int = (next: Random, low: number, high: number): number => low + Math.floor(next() * (high - low + 1));

/** `total` split into `parts` parts of at least 1. */
function split(next: Random, total: number, parts: number): number[] {
  const cuts = new Set<number>();
  while (cuts.size < parts - 1) cuts.add(int(next, 1, total - 1));
  const sorted = [0, ...[...cuts].sort((a, b) => a - b), total];
  return sorted.slice(1).map((cut, i) => cut - (sorted[i] ?? 0));
}

/** A task before its options: the calculation, the result, the typical mistakes in order of likelihood, the path. */
interface Draft {
  op: Op;
  expr: string;
  answer: number;
  mistakes: Mistake[];
  path: string;
}

function plus(next: Random, range: number, terms: number): Draft {
  const total = int(next, range / 2, range);
  const parts = split(next, total, terms);
  let sum = 0;
  const steps = parts.slice(1).map((part, i) => {
    const before = i === 0 ? (parts[0] ?? 0) : sum;
    sum = before + part;
    return `${before} + ${part} = ${sum}`;
  });
  return {
    op: "plus",
    expr: parts.join(" + "),
    answer: total,
    mistakes: [
      { value: total - 10, kind: "carry" },
      { value: total + 10, kind: "carry" },
      { value: total - 1, kind: "slip" },
      { value: total + 1, kind: "slip" },
    ],
    path: steps.join("; "),
  };
}

function minus(next: Random, range: number, terms: number): Draft {
  const start = int(next, range / 2, range);
  const taken = int(next, terms - 1, start - 1);
  const parts = split(next, taken, terms - 1);
  let rest = start;
  const steps = parts.map((part) => {
    const before = rest;
    rest = before - part;
    return `${before} − ${part} = ${rest}`;
  });
  const answer = start - taken;
  // each column the smaller digit from the larger: 52 − 18 = 46, only for two terms
  const first = parts[0] ?? 0;
  let columns = 0;
  for (let place = 1; place <= range; place *= 10) {
    const a = Math.floor(start / place) % 10;
    const b = Math.floor(first / place) % 10;
    columns += Math.abs(a - b) * place;
  }
  return {
    op: "minus",
    expr: [start, ...parts].join(" − "),
    answer,
    mistakes: [
      ...(terms === 2 && columns < start ? [{ value: columns, kind: "columns" }] : []),
      { value: answer + 10, kind: "carry" },
      { value: answer - 10, kind: "carry" },
      ...(start + taken <= range ? [{ value: start + taken, kind: "added" }] : []),
      { value: answer + 1, kind: "slip" },
      { value: answer - 1, kind: "slip" },
    ],
    path: steps.join("; "),
  };
}

/** The factors of a multiplication: below 100 the small times table, to 1000 a single digit and a tens or hundreds number. */
function factors(next: Random, range: number): [number, number] {
  if (range <= 100) return [int(next, 2, 10), int(next, 2, 10)];
  const single = int(next, 2, 9);
  const big = [20, 30, 40, 50, 60, 70, 80, 90, 200, 300, 400, 500, 600, 700, 800, 900].filter(
    (n) => n * single <= range,
  );
  return [single, big[int(next, 0, big.length - 1)] ?? 20];
}

function zeroPath(a: number, b: number): string {
  const zeros = b >= 100 ? 100 : b >= 20 && b % 10 === 0 ? 10 : 1;
  if (zeros === 1) return `${a} · ${b} = ${a * b}`;
  return `${a} · ${b / zeros} = ${(a * b) / zeros}; ${(a * b) / zeros} · ${zeros} = ${a * b}`;
}

function mal(next: Random, range: number): Draft {
  const [a, b] = factors(next, range);
  const product = a * b;
  const swap = next() < 0.5;
  const mistakes: Mistake[] = [{ value: a + b, kind: "added" }];
  if (product % 10 === 0) mistakes.push({ value: product / 10, kind: "zero" });
  mistakes.push({ value: product + a, kind: "neighbour" }, { value: product - b, kind: "neighbour" });
  mistakes.push({ value: product + 10, kind: "neighbour" });
  return {
    op: "mal",
    expr: swap ? `${b} · ${a}` : `${a} · ${b}`,
    answer: product,
    mistakes,
    path: zeroPath(a, b),
  };
}

function geteilt(next: Random, range: number): Draft {
  const [a, b] = factors(next, range);
  const product = a * b;
  const [divisor, answer] = next() < 0.5 ? [a, b] : [b, a];
  const mistakes: Mistake[] = [{ value: product - divisor, kind: "minus" }];
  if (answer % 10 === 0) mistakes.push({ value: answer / 10, kind: "zero" });
  else mistakes.push({ value: answer * 10, kind: "zero" });
  mistakes.push({ value: answer + 1, kind: "neighbour" }, { value: answer - 1, kind: "neighbour" });
  return {
    op: "geteilt",
    expr: `${product} : ${divisor}`,
    answer,
    mistakes,
    path: `${divisor} · ${answer} = ${product}; ${product} : ${divisor} = ${answer}`,
  };
}

/** The options of a task: the result and three typical wrong ones, filled with near values, in an order from the seed. */
function withOptions(next: Random, draft: Draft): Task {
  const wrong: number[] = [];
  const fits = (value: number): boolean => value >= 0 && value !== draft.answer && !wrong.includes(value);
  for (const { value } of draft.mistakes) if (wrong.length < 3 && fits(value)) wrong.push(value);
  for (let near = 2; wrong.length < 3; near++) {
    for (const value of [draft.answer + near, draft.answer - near])
      if (wrong.length < 3 && fits(value)) wrong.push(value);
  }
  const options = [...wrong];
  options.splice(int(next, 0, 3), 0, draft.answer);
  return { ...draft, options, mistakes: draft.mistakes.filter(({ value }) => value >= 0 && value !== draft.answer) };
}

function makeTasks(seed: number, chosen: Settings): Task[] {
  const next = random(seed);
  return Array.from({ length: chosen.count }, () => {
    const op = chosen.ops[int(next, 0, chosen.ops.length - 1)] ?? "plus";
    const draft =
      op === "plus"
        ? plus(next, chosen.range, chosen.terms)
        : op === "minus"
          ? minus(next, chosen.range, chosen.terms)
          : op === "mal"
            ? mal(next, chosen.range)
            : geteilt(next, chosen.range);
    return withOptions(next, draft);
  });
}

const ROUTES: Readonly<Record<string, { ops: readonly string[] }>> = settings.routes;

const isOp = (value: unknown): value is Op => OPS.some((op) => op === value);

export function start(seed: number, route: string): State {
  const preset = ROUTES[route] ?? ROUTES["gemischt"];
  const ops = OPS.filter((op) => preset?.ops.includes(op));
  return {
    seed,
    route,
    phase: "setup",
    settings: { ...settings.defaults, mode: settings.defaults.mode as Mode, ops },
    tasks: [],
    index: 0,
    attempts: 0,
    failures: 0,
    elapsed: 0,
    last: "setup",
    mistake: "",
  };
}

/** The round with the chosen settings, its tasks drawn from the seed. */
function begin(state: State, seed: number): State {
  return {
    ...state,
    seed,
    phase: "playing",
    tasks: makeTasks(seed, state.settings),
    index: 0,
    attempts: 0,
    failures: 0,
    elapsed: 0,
    last: "start",
    mistake: "",
  };
}

/** The state with the next task, or done after the last. */
function advance(state: State, change: Partial<State>): State {
  const index = state.index + 1;
  return { ...state, ...change, index, attempts: 0, phase: index >= state.tasks.length ? "done" : "playing" };
}

/** The kind of mistake an answer is: a typical one, or "" . */
export function mistakeOf(task: Task, value: number): string {
  return task.mistakes.find((mistake) => mistake.value === value)?.kind ?? "";
}

function answer(state: State, value: unknown): State {
  const task = state.tasks[state.index];
  const given = typeof value === "number" ? value : typeof value === "string" ? Number(value.trim()) : NaN;
  if (task === undefined || state.phase !== "playing" || value === "" || !Number.isInteger(given)) return state;
  if (given === task.answer) return advance(state, { last: "right", mistake: "" });
  const attempts = state.attempts + 1;
  const failures = state.failures + 1;
  const mistake = mistakeOf(task, given);
  if (attempts >= settings.maxFailures) return advance(state, { failures, last: "reveal", mistake });
  return { ...state, attempts, failures, last: "wrong", mistake };
}

function choose<T>(value: unknown, allowed: readonly T[]): T | undefined {
  return allowed.find((candidate) => candidate === value);
}

function change(state: State, name: string, value: unknown): State {
  const current = state.settings;
  if (name === "toggle-op") {
    if (!isOp(value)) return state;
    const ops = OPS.filter((op) => (op === value ? !current.ops.includes(op) : current.ops.includes(op)));
    return ops.length === 0 ? state : { ...state, settings: { ...current, ops } };
  }
  if (name === "set-range") {
    const range = choose(value, settings.ranges);
    return range === undefined ? state : { ...state, settings: { ...current, range } };
  }
  if (name === "set-count") {
    const count = choose(value, settings.counts);
    return count === undefined ? state : { ...state, settings: { ...current, count } };
  }
  if (name === "set-terms") {
    const terms = choose(value, settings.terms);
    return terms === undefined ? state : { ...state, settings: { ...current, terms } };
  }
  if (name === "set-mode") {
    const mode = choose(value, ["choice", "input"] as const);
    return mode === undefined ? state : { ...state, settings: { ...current, mode } };
  }
  if (name === "set-timer" && typeof value === "boolean") return { ...state, settings: { ...current, timer: value } };
  return state;
}

export function step(state: State, input: Input): State {
  if (input.kind !== "action") return state;
  const { name, value } = input;
  if (name === "begin" && state.phase === "setup") return begin(state, state.seed);
  if (name === "again" && state.phase === "done") return begin(state, state.seed + 1);
  if (name === "settings" && state.phase !== "setup") return { ...state, phase: "setup", last: "setup", tasks: [] };
  if (name === "answer") return answer(state, value);
  return state.phase === "setup" ? change(state, name, value) : state;
}

export function tick(state: State, dt: number): State {
  if (state.phase !== "playing" || !state.settings.timer) return state;
  return { ...state, elapsed: state.elapsed + dt };
}
