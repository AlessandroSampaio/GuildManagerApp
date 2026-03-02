import { EmptyState } from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";
import { SkeletonList } from "@/components/ui/Skeleton";
import StatCard from "@/components/ui/StatCard";
import { useReportList } from "@/lib";
import { authStore } from "@/stores/auth";
import { A } from "@solidjs/router";
import { Component, For, Show } from "solid-js";

// Helpers
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function duration(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const DashboardPage: Component = () => {
  const reports = useReportList(() => 1);

  const totalKills = () =>
    reports.data?.reduce((s, r) => s + (r.killCount ?? 0), 0) ?? 0;
  const totalFights = () =>
    reports.data?.reduce((s, r) => s + (r.fightCount ?? 0), 0) ?? 0;

  return (
    <div class="flex-1 overflow-y-auto p-8">
      <SectionHeader
        label="Painel"
        title={`Olá, ${authStore.user()?.username ?? "Champion"}`}
      />
      <div class="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Acesso WCL"
          value={authStore.wclAuthorized() ? "Privado" : "Público"}
          sub={authStore.wclAuthorized() ? "/api/v2/user" : "/api/v2/client"}
          delay="0s"
        />
        <StatCard
          label="Reports"
          value={reports.isSuccess ? (reports.data?.length ?? 0) : "—"}
          sub="importados"
          delay="0.05s"
        />{" "}
        <StatCard
          label="Kills"
          value={totalKills()}
          sub={`de ${totalFights()} fights`}
          delay="0.10s"
        />
      </div>

      <Show when={!authStore.wclAuthorized()}>
        <div
          class="mb-6 bg-forge-900/30 border border-ember-900/50 px-5 py-4
          flex items-center justify-between animate-fade-in"
        >
          <div class="flex items-start gap-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#c8741c"
              stroke-width="1.2"
              class="mt-0.5 shrink-0"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6.5" />
              <line x1="8" y1="5" x2="8" y2="8.5" />
              <circle cx="8" cy="11" r="0.6" fill="#c8741c" />
            </svg>
            <div>
              <p class="text-ember-600 font-semibold text-sm">
                Reports privados indisponíveis
              </p>
              <p class="text-stone-600 text-xs mt-0.5">
                Conecte sua conta WCL para acessar a rota privada /api/v2/user.
              </p>
            </div>
          </div>
          <A
            href="/app/settings"
            class="btn-primary text-xs py-2 shrink-0 ml-6"
          >
            Conectar WCL
          </A>
        </div>
      </Show>
      <div>
        <div class="flex items-center justify-between mb-4">
          <p class="label-xs">Reports Recentes</p>{" "}
          <A
            href="/app/reports"
            class="font-mono text-[10px] text-stone-600 hover:text-ember-600
                             tracking-widest uppercase transition-colors"
          >
            Ver todos →
          </A>
        </div>

        <Show when={reports.isLoading}>
          <SkeletonList rows={5} />
        </Show>

        <Show when={reports.isError}>
          <div class="card text-center py-8">
            <p class="text-red-400 text-sm font-semibold mb-1">
              Falha ao carregar reports
            </p>
            <p class="text-stone-600 font-mono text-xs">
              {String(reports.error)}
            </p>
          </div>
        </Show>

        <Show when={reports.isSuccess && (reports.data?.length ?? 0) === 0}>
          <EmptyState
            title="Nenhum report importado"
            subtitle="Importe um report do WarcraftLogs para começar"
            action={
              <A href="/app/reports" class="btn-primary text-xs">
                Importar Report
              </A>
            }
          />
        </Show>

        <Show when={reports.isSuccess && (reports.data?.length ?? 0) > 0}>
          <div class="space-y-2">
            <For each={reports.data}>
              {(r, i) => (
                <A
                  href={`/app/reports/${r.id}`}
                  class="card-interactive group flex items-center justify-between animate-fade-in"
                  style={`animation-delay:${i() * 40}ms`}
                >
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 mb-0.5">
                      <p
                        class="font-semibold text-stone-200 text-sm truncate
                                         group-hover:text-ember-500 transition-colors"
                      >
                        {r.title}
                      </p>
                      <Show when={(r.killCount ?? 0) > 0}>
                        <span class="tag-kill text-[9px] shrink-0">
                          {r.killCount} kills
                        </span>
                      </Show>
                    </div>
                    <p class="font-mono text-[10px] text-stone-600">
                      {r.id} · {r.guildName ?? "sem guilda"} ·{" "}
                      {fmt(r.startTime)}
                    </p>
                  </div>
                  <div class="flex items-center gap-4 shrink-0 ml-4">
                    <p class="font-mono text-xs text-stone-500">
                      {r.fightCount} fights · {duration(r.startTime, r.endTime)}
                    </p>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.2"
                      aria-hidden="true"
                      class="text-stone-700 group-hover:text-ember-700 transition-colors"
                    >
                      <path d="M4 2l4 4-4 4" />
                    </svg>
                  </div>
                </A>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default DashboardPage;
