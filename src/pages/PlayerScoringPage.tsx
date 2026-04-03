import { ApiError } from "@/api/client";
import { penaltyApi } from "@/api/penalty";
import { playerScoringApi } from "@/api/player-scoring";
import PlayerScoringDetailedView from "@/components/PlayerScoringDetailedView";
import PlayerScoringSimplifiedView, { SimplifiedRow } from "@/components/PlayerScoringSimplifiedView";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { ReportStatusBadge } from "@/components/ui/ReportStatusBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { fmtDate } from "@/helpers";
import { tierBadgeClass } from "@/helpers/colors";
import { exportRaidWeekXlsx } from "@/lib/export-xlsx";
import { PlayerWeekPenalty } from "@/types/penalty";
import { PlayerScoringResult } from "@/types/player-scoring";
import { useNavigate, useParams } from "@solidjs/router";
import { Component, createMemo, createSignal, For, onMount, Show } from "solid-js";

const PlayerScoringPage: Component = () => {
  const params = useParams<{ weekId: string }>();
  const nav = useNavigate();

  const [result, setResult] = createSignal<PlayerScoringResult | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [showReports, setShowReports] = createSignal(false);
  const [exporting, setExporting] = createSignal(false);
  const [exportError, setExportError] = createSignal<string | null>(null);
  const [viewMode, setViewMode] = createSignal<"detailed" | "simplified">("detailed");
  const [penalties, setPenalties] = createSignal<PlayerWeekPenalty[]>([]);
  const [penaltiesLoaded, setPenaltiesLoaded] = createSignal(false);

  const weekId = () => parseInt(params.weekId, 10);
  const week = () => result()?.raidWeek;

  async function calculate() {
    setLoading(true);
    setError(null);
    try {
      const r = await playerScoringApi.calculateByWeek(weekId());
      setResult(r);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Falha ao calcular pontuação.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadPenalties() {
    if (penaltiesLoaded() || !week()?.id) return;
    try {
      const data = await penaltyApi.listWeekPenalties(week()!.id);
      setPenalties(data);
      setPenaltiesLoaded(true);
    } catch {
      // silently fail — penalties show as 0
    }
  }

  async function switchToSimplified() {
    setViewMode("simplified");
    await loadPenalties();
  }

  const simplifiedData = createMemo(() => {
    const players = result()?.players ?? [];
    if (players.length === 0) return { fightNames: [] as string[], rows: [] as SimplifiedRow[] };

    const fightNameSet = new Map<string, true>();
    for (const player of players) {
      for (const char of player.characters) {
        for (const fight of char.fights) {
          fightNameSet.set(fight.fightName, true);
        }
      }
    }
    const fightNames = [...fightNameSet.keys()];

    const penaltyByPlayer = new Map<number, number>();
    for (const p of penalties()) {
      const prev = penaltyByPlayer.get(p.playerId) ?? 0;
      penaltyByPlayer.set(p.playerId, prev + p.points);
    }

    const rows = players.map((player) => {
      const fightPoints = new Map<string, number>();
      for (const char of player.characters) {
        for (const fight of char.fights) {
          const prev = fightPoints.get(fight.fightName) ?? 0;
          fightPoints.set(fight.fightName, prev + (fight.points ?? 0));
        }
      }
      return {
        playerName: player.playerName,
        totalPoints: player.totalPoints,
        fightPoints,
        penaltyTotal: penaltyByPlayer.get(player.playerId) ?? 0,
      };
    });

    return { fightNames, rows };
  });

  onMount(() => {
    if (!Number.isNaN(weekId())) {
      calculate();
    }
  });

  return (
    <div class="flex-1 overflow-y-auto p-8">
      <div class="space-y-6">
        <div class="max-w-4xl flex items-start justify-between">
          <div>
            <button
              onClick={() => nav("/app/raid-weeks")}
              class="flex items-center gap-1.5 text-stone-600 hover:text-stone-300 font-mono text-xs mb-3 transition-colors"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M7 2L3 5.5l4 3.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Semanas de Raid
            </button>
            <SectionHeader
              label="Pontuação"
              title={week() ? week()!.label : "Calculando…"}
            />
            <Show when={week()}>
              <p class="font-mono text-[11px] text-stone-600 -mt-4">
                {fmtDate(new Date(week()!.startsAt).toDateString())} &rarr;{" "}
                {fmtDate(new Date(week()!.endsAt).toDateString())}
              </p>
            </Show>
          </div>

          <div class="flex items-center gap-2 mt-6">
            <Show when={result()}>
              <button
                onClick={async () => {
                  setExporting(true);
                  setExportError(null);
                  try {
                    let weekPenalties: PlayerWeekPenalty[] = [];
                    if (week()?.id) {
                      weekPenalties = await penaltyApi.listWeekPenalties(week()!.id);
                    }
                    await exportRaidWeekXlsx(
                      result()!,
                      week()?.label ?? "raidweek",
                      weekPenalties,
                    );
                  } catch (e) {
                    setExportError(e instanceof Error ? e.message : String(e));
                  } finally {
                    setExporting(false);
                  }
                }}
                disabled={exporting()}
                class="btn-ghost text-xs py-1.5 px-4 flex items-center gap-2"
                title="Exportar XLSX"
              >
                <Show
                  when={exporting()}
                  fallback={
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        d="M6 1v7M3 5l3 3 3-3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path d="M2 10h8" stroke-linecap="round" />
                    </svg>
                  }
                >
                  <Spinner size={12} />
                </Show>
                {exporting() ? "Exportando..." : "Exportar XLSX"}
              </button>

              <Show when={exportError()}>
                <p class="font-mono text-[10px] text-red-400 max-w-[200px] text-right">
                  {exportError()}
                </p>
              </Show>
            </Show>
            <button
              onClick={calculate}
              disabled={loading()}
              class="btn-ghost text-xs py-1.5 px-4 flex items-center gap-2"
              title="Recalcular"
            >
              <Show when={loading()}>
                <Spinner size={12} />
              </Show>
              <Show when={!loading()}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path d="M10 6A4 4 0 112 6" stroke-linecap="round" />
                  <path
                    d="M10 3v3h-3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Show>
              {loading() ? "Calculando..." : "Recalcular"}
            </button>
          </div>
        </div>

        <Show when={loading() && !result()}>
          <div class="max-w-4xl flex items-center gap-3 text-stone-500 font-mono text-xs py-6">
            <Spinner size={16} />
            Calculando pontuação dos players…
          </div>
        </Show>

        <Show when={error()}>
          <div class="max-w-4xl">
            <ErrorBanner message={error()!} />
          </div>
        </Show>

        <Show when={result()}>
          {/* Summary bar */}
          <div class="max-w-4xl grid grid-cols-4 gap-3">
            {(
              [
                ["Players", result()!.players.length.toString()],
                [
                  "Reports avaliados",
                  result()!
                    .reports.filter((r) => r.includedInScoring)
                    .length.toString(),
                ],
                [
                  "Entries avaliadas",
                  result()!.totalEntriesEvaluated.toString(),
                ],
                [
                  "Sem ranking WCL",
                  result()!.entriesWithoutRankPercent.toString(),
                ],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div class="bg-void-800/40 border border-void-700 px-4 py-3">
                <p class="label-xs mb-1">{k}</p>
                <p class="font-mono text-xl font-bold text-stone-100">{v}</p>
              </div>
            ))}
          </div>

          {/* Scoring settings snapshot */}
          <div class="max-w-4xl flex items-center gap-3">
            <p class="label-xs">Configuração de scoring usada:</p>
            <div class="flex gap-2 flex-wrap">
              <For
                each={result()!.scoringSettings.tiers.sort(
                  (a, b) => b.minPercent - a.minPercent,
                )}
              >
                {(t) => (
                  <span
                    class={`font-mono text-[10px] px-2 py-0.5 border ${tierBadgeClass(t.points)}`}
                  >
                    {t.minPercent}–{t.maxPercent}%: {t.points}pts
                    {t.label ? ` · ${t.label}` : ""}
                  </span>
                )}
              </For>
            </div>
          </div>

          {/* No players */}
          <Show when={result()!.players.length === 0}>
            <div class="max-w-4xl">
            <EmptyState
              title="Nenhum player com pontuação"
              subtitle="Os reports avaliados não têm PerformanceEntries vinculadas a Players."
            />
            </div>
          </Show>

          {/* View mode toggle + player list */}
          <Show when={result()!.players.length > 0}>
            {/* Toggle */}
            <div class="flex items-center gap-1 bg-void-800/60 border border-void-700 p-0.5 w-fit">
              <button
                onClick={() => setViewMode("detailed")}
                class={`font-mono text-[10px] tracking-wider px-3 py-1 transition-colors ${
                  viewMode() === "detailed"
                    ? "bg-void-600 text-stone-200"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                DETALHADA
              </button>
              <button
                onClick={switchToSimplified}
                class={`font-mono text-[10px] tracking-wider px-3 py-1 transition-colors ${
                  viewMode() === "simplified"
                    ? "bg-void-600 text-stone-200"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                SIMPLIFICADA
              </button>
            </div>

            {/* Detailed view */}
            <Show when={viewMode() === "detailed"}>
              <PlayerScoringDetailedView players={result()!.players} />
            </Show>

            {/* Simplified grid view */}
            <Show when={viewMode() === "simplified"}>
              <PlayerScoringSimplifiedView
                fightNames={simplifiedData().fightNames}
                rows={simplifiedData().rows}
              />
            </Show>
          </Show>

          {/* Reports toggle */}
          <div class="max-w-4xl">
            <button
              onClick={() => setShowReports((v) => !v)}
              class="flex items-center gap-2 text-xs text-stone-600 hover:text-stone-300 transition-colors font-mono"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
                class={`transition-transform ${showReports() ? "rotate-90" : ""}`}
              >
                <path
                  d="M4 2l3 3.5-3 3.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {showReports() ? "Ocultar" : "Ver"} status dos reports (
              {result()!.reports.length})
            </button>

            <Show when={showReports()}>
              <div class="mt-3 space-y-1 animate-fade-in">
                <For each={result()!.reports}>
                  {(r) => (
                    <ReportStatusBadge
                      code={r.reportCode}
                      title={r.title}
                      status={r.importStatus}
                      included={r.includedInScoring}
                    />
                  )}
                </For>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default PlayerScoringPage;
