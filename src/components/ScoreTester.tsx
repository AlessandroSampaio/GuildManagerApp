import { adminApi } from "@/api/admin";
import { Component, createSignal, Show } from "solid-js";
import { Spinner } from "./ui/Spinner";
import { tierColor } from "@/helpers/colors";

export const ScoreTester: Component = () => {
  const [pct, setPct] = createSignal(75);
  const [result, setResult] = createSignal<{
    points: number | null;
    tier: any | null;
  } | null>(null);
  const [loading, setLoading] = createSignal(false);

  async function test() {
    setLoading(true);
    try {
      const r = await adminApi.calculateScore(pct());
      setResult(r);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="bg-void-700/30 border border-void-600 p-4">
      <p class="label-xs mb-3">Testar Percentil</p>
      <div class="flex items-center gap-3">
        <div class="flex-1 max-w-[160px]">
          <div class="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={pct()}
              onInput={(e) => {
                setPct(Number(e.currentTarget.value));
                setResult(null);
              }}
              class="flex-1 accent-ember-600 h-1"
            />
            <span class="font-mono text-sm text-stone-200 w-10 text-right">
              {pct()}%
            </span>
          </div>
        </div>
        <button
          onClick={test}
          disabled={loading()}
          class="btn-ghost text-xs py-1.5 px-4 flex items-center gap-2"
        >
          <Show when={loading()}>
            <Spinner size={12} />
          </Show>
          Calcular
        </button>
        <Show when={result()}>
          <div
            class={`px-3 py-1.5 border font-mono text-xs ${
              result()!.points !== null
                ? tierColor(result()!.points!)
                : "text-stone-500 bg-void-800 border-void-600"
            }`}
          >
            <Show
              when={result()!.points !== null}
              fallback={<span>Sem tier configurado</span>}
            >
              <span class="font-bold">{result()!.points} pts</span>
              <Show when={result()!.tier?.label}>
                <span class="opacity-70 ml-2">— {result()!.tier!.label}</span>
              </Show>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
};
