<script setup lang="ts">
// The trainer: the settings of a round, then the task with the stopwatch and the failed attempts, a message for every
// answer, and the result. It announces every change for screen readers. The runtime gives it the core's state; its
// buttons emit actions as input and keep no state of their own but the typed text.
import { computed, ref, watch } from "vue";
import { announce } from "@lernapps/tooling/a11y";
import { translator } from "@lernapps/tooling/i18n";
import type { Input } from "@lernapps/app-templates/interactive";
import settings from "../data/settings.json";
import type { Op, State } from "../core/index.ts";
import de from "../messages/de.json";

const props = defineProps<{ state: State; lang: string }>();
const emit = defineEmits<{ input: [input: Input] }>();
const t = translator(de);

const OPS: readonly Op[] = ["plus", "minus", "mal", "geteilt"];
const typed = ref("");
const field = ref<HTMLInputElement | null>(null);

const act = (name: string, value?: string | number | boolean): void =>
  emit("input", value === undefined ? { kind: "action", name } : { kind: "action", name, value });

const total = computed(() => props.state.tasks.length);
const task = computed(() => props.state.tasks[props.state.index]);
/** The task answered last: a right answer or a solution moves on at once. */
const previous = computed(() => props.state.tasks[props.state.index - 1]);
const showTime = computed(() => props.state.settings.timer);
const time = computed(() => {
  const seconds = Math.floor(props.state.elapsed / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
});

/** The message for the last answer. */
const feedback = computed(() => {
  const { last, mistake, attempts } = props.state;
  if (last === "right") return t("right");
  if (last === "reveal" && previous.value !== undefined) {
    const { answer, path } = previous.value;
    return t("reveal", { answer, path });
  }
  if (last === "wrong" && task.value !== undefined) {
    const detail = mistake === "" ? t("wrong") : t(`${task.value.op}-${mistake}` as keyof typeof de);
    return `${detail} ${t("attempt", { attempts, max: settings.maxFailures })}`;
  }
  return "";
});

watch(
  () => [props.state.phase, props.state.index, props.state.failures, props.state.seed] as const,
  () => {
    const { phase, last } = props.state;
    typed.value = "";
    if (phase === "done") announce(`${feedback.value} ${t("done", { total: total.value })}`);
    else if (phase === "playing" && task.value !== undefined) {
      const question = t("question", { expr: task.value.expr });
      announce(last === "start" ? t("start", { expr: task.value.expr }) : `${feedback.value} ${question}`);
      field.value?.focus();
    }
  },
);

const submit = (): void => {
  if (typed.value.trim() !== "") act("answer", typed.value);
};
</script>

<template>
  <section class="game" :class="`phase-${state.phase}`" :aria-label="t('game')">
    <form v-if="state.phase === 'setup'" class="setup" @submit.prevent="act('begin')">
      <h2>{{ t("setup") }}</h2>
      <fieldset>
        <legend>{{ t("ops") }}</legend>
        <button
          v-for="op in OPS"
          :key="op"
          type="button"
          class="choice"
          :aria-pressed="state.settings.ops.includes(op)"
          @click="act('toggle-op', op)"
        >
          {{ t(`op-${op}` as keyof typeof de) }}
        </button>
      </fieldset>
      <fieldset>
        <legend>{{ t("range") }}</legend>
        <button
          v-for="range in settings.ranges"
          :key="range"
          type="button"
          class="choice"
          :aria-pressed="state.settings.range === range"
          @click="act('set-range', range)"
        >
          {{ t(`range-${range}` as keyof typeof de) }}
        </button>
      </fieldset>
      <fieldset>
        <legend>{{ t("count") }}</legend>
        <button
          v-for="count in settings.counts"
          :key="count"
          type="button"
          class="choice"
          :aria-pressed="state.settings.count === count"
          @click="act('set-count', count)"
        >
          {{ count }}
        </button>
      </fieldset>
      <fieldset>
        <legend>{{ t("terms") }}</legend>
        <button
          v-for="terms in settings.terms"
          :key="terms"
          type="button"
          class="choice"
          :aria-pressed="state.settings.terms === terms"
          @click="act('set-terms', terms)"
        >
          {{ terms }}
        </button>
      </fieldset>
      <fieldset>
        <legend>{{ t("mode") }}</legend>
        <button
          v-for="mode in ['choice', 'input']"
          :key="mode"
          type="button"
          class="choice"
          :aria-pressed="state.settings.mode === mode"
          @click="act('set-mode', mode)"
        >
          {{ t(`mode-${mode}` as keyof typeof de) }}
        </button>
      </fieldset>
      <fieldset>
        <legend>{{ t("timer") }}</legend>
        <button type="button" class="choice" :aria-pressed="state.settings.timer" @click="act('set-timer', true)">
          {{ t("timer-on") }}
        </button>
        <button type="button" class="choice" :aria-pressed="!state.settings.timer" @click="act('set-timer', false)">
          {{ t("timer-off") }}
        </button>
      </fieldset>
      <button type="submit" class="big">{{ t("begin") }}</button>
    </form>

    <template v-else-if="state.phase === 'playing' && task">
      <p class="status">
        <span>{{ t("task", { n: state.index + 1, total }) }}</span>
        <span v-if="showTime">{{ t("time", { time }) }}</span>
        <span>{{ t("failures", { failures: state.failures }) }}</span>
      </p>
      <p v-if="feedback" class="feedback" :class="`is-${state.last}`" aria-hidden="true">{{ feedback }}</p>
      <p class="question" aria-hidden="true">{{ t("question", { expr: task.expr }) }}</p>
      <div v-if="state.settings.mode === 'choice'" class="options" role="group" :aria-label="t('pick')">
        <button
          v-for="option in task.options"
          :key="option"
          type="button"
          class="option"
          @click="act('answer', option)"
        >
          {{ option }}
        </button>
      </div>
      <form v-else class="typed" @submit.prevent="submit">
        <label for="result">{{ t("input-label") }}</label>
        <input id="result" ref="field" v-model="typed" type="text" inputmode="numeric" autocomplete="off" />
        <button type="submit" class="big">{{ t("check") }}</button>
      </form>
      <button type="button" class="quiet" @click="act('settings')">{{ t("cancel") }}</button>
    </template>

    <template v-else>
      <h2>{{ t("done", { total }) }}</h2>
      <p v-if="feedback" class="feedback" :class="`is-${state.last}`" aria-hidden="true">{{ feedback }}</p>
      <p class="result">{{ t("done-failures", { failures: state.failures }) }}</p>
      <p v-if="showTime" class="result">{{ t("done-time", { time }) }}</p>
      <button type="button" class="big" @click="act('again')">{{ t("again") }}</button>
      <button type="button" class="quiet" @click="act('settings')">{{ t("back") }}</button>
    </template>
  </section>
</template>

<style scoped>
.game {
  --accent: #5b4bd6;
  --accent-text: #ffffff;
  --hot: #c2410c;
  --paper: #f6f4ff;
  --card: #ffffff;
  --ink: #1f1b3a;
  --line: #5b4bd6;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--paper);
  color: var(--ink);
}

@media (prefers-color-scheme: dark) {
  .game {
    --accent: #a99cff;
    --accent-text: #15122e;
    --hot: #fdba74;
    --paper: #1d1a38;
    --card: #2a2650;
    --ink: #f1efff;
    --line: #a99cff;
  }
}

h2 {
  margin-top: 0;
}

fieldset {
  margin: 0 0 1rem;
  padding: 0;
  border: 0;
}

legend {
  margin-bottom: 0.25rem;
  font-weight: 700;
}

button {
  font: inherit;
  cursor: pointer;
}

button:focus-visible,
input:focus-visible {
  outline: 3px solid var(--hot);
  outline-offset: 2px;
}

.choice {
  min-width: 3.5rem;
  min-height: 2.75rem;
  margin: 0 0.25rem 0.25rem 0;
  padding: 0.25rem 0.75rem;
  border: 2px solid var(--line);
  border-radius: 0.75rem;
  background: var(--card);
  color: var(--ink);
}

.choice[aria-pressed="true"] {
  background: var(--accent);
  color: var(--accent-text);
  font-weight: 700;
}

.big {
  display: block;
  width: 100%;
  min-height: 3.25rem;
  margin-top: 0.75rem;
  border: 0;
  border-radius: 0.875rem;
  background: var(--hot);
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 700;
}

@media (prefers-color-scheme: dark) {
  .big {
    color: #15122e;
  }
}

.quiet {
  display: block;
  margin: 0.75rem auto 0;
  min-height: 2.75rem;
  border: 0;
  background: none;
  color: var(--ink);
  text-decoration: underline;
}

.status {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  justify-content: space-between;
  margin: 0 0 0.75rem;
}

.question {
  margin: 0.5rem 0 1rem;
  padding: 1.25rem 0.5rem;
  border: 2px solid var(--line);
  border-radius: 1rem;
  background: var(--card);
  font-size: clamp(1.75rem, 8vw, 2.5rem);
  font-weight: 700;
  text-align: center;
  overflow-wrap: anywhere;
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.option {
  min-height: 3.5rem;
  border: 2px solid var(--line);
  border-radius: 0.875rem;
  background: var(--card);
  color: var(--ink);
  font-size: 1.5rem;
  font-weight: 700;
  transition: transform 0.15s;
}

@media (prefers-reduced-motion: no-preference) {
  .option:hover {
    transform: scale(1.04);
  }

  .feedback {
    animation: pop 0.25s ease-out;
  }
}

@keyframes pop {
  from {
    transform: scale(0.96);
  }
}

.typed label {
  display: block;
  font-weight: 700;
}

.typed input {
  box-sizing: border-box;
  width: 100%;
  min-height: 3.25rem;
  padding: 0.25rem 0.75rem;
  border: 2px solid var(--line);
  border-radius: 0.75rem;
  background: var(--card);
  color: var(--ink);
  font-size: 1.5rem;
}

.feedback {
  margin: 0 0 0.5rem;
  padding: 0.75rem;
  border: 2px solid var(--line);
  border-radius: 0.75rem;
  background: var(--card);
}

.feedback.is-right {
  border-color: var(--accent);
  font-weight: 700;
}

.feedback.is-wrong,
.feedback.is-reveal {
  border-color: var(--hot);
}

.result {
  margin: 0.25rem 0;
  font-size: 1.25rem;
}
</style>
