import { classColor } from "@/helpers/colors";
import { useCharacterRaiderIo } from "@/lib/queries/character";
import { MythicPlusRun, RaiderIoRaidTier } from "@/types/characters";
import { useNavigate, useParams } from "@solidjs/router";
import { For, Show } from "solid-js";

function fmtMs(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function RaidProgressionBar(p: { tier: RaiderIoRaidTier }) {
  const total = p.tier.total_bosses;
  return (
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <span class="font-mono text-[10px] text-stone-500 uppercase tracking-wide">
          {p.tier.summary}
        </span>
      </div>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="bg-void-800 border border-void-700 px-2 py-1.5">
          <p class="font-mono text-[9px] text-stone-600 uppercase mb-0.5">
            Normal
          </p>
          <p class="font-mono text-xs text-stone-300">
            {p.tier.normal_bosses_killed}
            <span class="text-stone-600">/{total}</span>
          </p>
        </div>
        <div class="bg-void-800 border border-void-700 px-2 py-1.5">
          <p class="font-mono text-[9px] text-amber-700 uppercase mb-0.5">
            Heroic
          </p>
          <p class="font-mono text-xs text-amber-400">
            {p.tier.heroic_bosses_killed}
            <span class="text-stone-600">/{total}</span>
          </p>
        </div>
        <div class="bg-void-800 border border-void-700 px-2 py-1.5">
          <p class="font-mono text-[9px] text-violet-700 uppercase mb-0.5">
            Mythic
          </p>
          <p class="font-mono text-xs text-violet-400">
            {p.tier.mythic_bosses_killed}
            <span class="text-stone-600">/{total}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function upgradeColor(upgrades: number) {
  if (upgrades >= 3) return "text-amber-300";
  if (upgrades >= 2) return "text-emerald-400";
  if (upgrades >= 1) return "text-sky-400";
  return "text-stone-500";
}

function MythicPlusRunCard(p: { run: MythicPlusRun }) {
  const r = p.run;
  const overtime = r.clear_time_ms > r.par_time_ms;
  return (
    <div class="bg-void-800 border border-void-700 overflow-hidden">
      {/* Dungeon header with background image */}
      <div class="relative flex items-center gap-3 px-3 py-2.5">
        <div
          class="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ "background-image": `url(${r.background_image_url})` }}
          aria-hidden="true"
        />
        <img
          src={r.icon_url}
          alt={r.dungeon}
          class="w-8 h-8 shrink-0 border border-void-600 relative z-10"
        />
        <div class="flex-1 min-w-0 relative z-10">
          <p class="font-semibold text-sm text-stone-100 truncate">
            {r.dungeon}
          </p>
          <p class="font-mono text-[10px] text-stone-500">
            {r.short_name} · {r.spec.name} · {r.role}
          </p>
        </div>
        {/* Key level badge */}
        <div class="relative z-10 text-right shrink-0">
          <p class={`font-display text-lg leading-none ${upgradeColor(r.num_keystone_upgrades)}`}>
            +{r.mythic_level}
          </p>
          <p class="font-mono text-[9px] text-stone-600 mt-0.5">
            {r.num_keystone_upgrades > 0 ? `+${r.num_keystone_upgrades} chest` : "depleted"}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div class="border-t border-void-700 grid grid-cols-3 divide-x divide-void-700">
        <div class="px-3 py-1.5 text-center">
          <p class="font-mono text-[9px] text-stone-600 uppercase mb-0.5">Score</p>
          <p class="font-mono text-xs text-amber-400">{r.score.toFixed(1)}</p>
        </div>
        <div class="px-3 py-1.5 text-center">
          <p class="font-mono text-[9px] text-stone-600 uppercase mb-0.5">Tempo</p>
          <p class={`font-mono text-xs ${overtime ? "text-red-400" : "text-emerald-400"}`}>
            {fmtMs(r.clear_time_ms)}
          </p>
        </div>
        <div class="px-3 py-1.5 text-center">
          <p class="font-mono text-[9px] text-stone-600 uppercase mb-0.5">Par</p>
          <p class="font-mono text-xs text-stone-500">{fmtMs(r.par_time_ms)}</p>
        </div>
      </div>

      {/* Affixes */}
      <div class="border-t border-void-700 px-3 py-2 flex items-center gap-2 flex-wrap">
        <For each={r.affixes}>
          {(affix) => (
            <div
              class="flex items-center gap-1.5"
              title={affix.description}
            >
              <img
                src={affix.icon_url}
                alt={affix.name}
                class="w-4 h-4 border border-void-600"
              />
              <span class="font-mono text-[9px] text-stone-500">{affix.name}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

const CharacterDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const profile = useCharacterRaiderIo(() => Number(params.id));

  return (
    <div class="flex-1 overflow-y-auto p-6 w-full">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        class="inline-flex items-center gap-1.5 font-mono text-[10px] text-stone-600
               hover:text-ember-600 transition-colors mb-5"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
          aria-hidden="true"
        >
          <path d="M7 2L3 5l4 3" />
        </svg>
        Voltar
      </button>

      <Show when={profile.isLoading}>
        <div class="space-y-4 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-void-700 rounded" />
            <div class="space-y-2 flex-1">
              <div class="h-4 bg-void-700 rounded w-1/3" />
              <div class="h-3 bg-void-700 rounded w-1/4" />
            </div>
          </div>
          <div class="h-24 bg-void-700 rounded" />
          <div class="h-32 bg-void-700 rounded" />
        </div>
      </Show>

      <Show when={profile.isError}>
        <div class="bg-red-950/30 border border-red-900/50 px-4 py-3">
          <p class="text-red-400 text-xs font-mono">
            Erro ao carregar perfil Raider.IO
          </p>
        </div>
      </Show>

      <Show when={profile.isSuccess && profile.data}>
        {(data) => (
          <div class="space-y-5 animate-fade-in">
            {/* Header card */}
            <div class="bg-void-800 border border-void-700 p-4 flex items-start gap-4">
              <img
                src={data().thumbnail_url}
                alt={data().name}
                class="w-14 h-14 object-cover shrink-0 border border-void-600"
              />
              <div class="flex-1 min-w-0">
                <h1
                  class={`font-display text-xl leading-tight truncate ${classColor(data().class)}`}
                >
                  {data().name}
                </h1>
                <p class="font-mono text-[11px] text-stone-500 mt-0.5">
                  {data().active_spec_name} {data().class} ·{" "}
                  {data().race} · {data().realm}–{data().region.toUpperCase()}
                </p>
                <div class="flex items-center gap-2 mt-2 flex-wrap">
                  <span class="font-mono text-[9px] px-1.5 py-0.5 bg-void-700 border border-void-600 text-stone-400 uppercase">
                    {data().active_spec_role}
                  </span>
                  <span class="font-mono text-[9px] px-1.5 py-0.5 bg-void-700 border border-void-600 text-stone-400 capitalize">
                    {data().faction}
                  </span>
                  <span class="font-mono text-[9px] text-stone-600">
                    {data().achievement_points.toLocaleString()} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Mythic+ best runs */}
            <Show when={(data().mythic_plus_best_runs?.length ?? 0) > 0}>
              <div>
                <h2 class="font-mono text-[10px] text-stone-500 uppercase tracking-widest mb-3">
                  Mythic+ Melhores Runs
                </h2>
                <div class="grid gap-3 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
                  <For each={data().mythic_plus_best_runs}>
                    {(run) => <MythicPlusRunCard run={run} />}
                  </For>
                </div>
              </div>
            </Show>

            {/* Raid progression */}
            <div class="bg-void-800 border border-void-700 p-4">
              <h2 class="font-mono text-[10px] text-stone-500 uppercase tracking-widest mb-3">
                Progressão de Raid
              </h2>
              <Show
                when={Object.keys(data().raid_progression).length > 0}
                fallback={
                  <p class="font-mono text-xs text-stone-600">
                    Sem dados de progressão
                  </p>
                }
              >
                <div class="space-y-4">
                  <For each={Object.entries(data().raid_progression)}>
                    {([key, tier]) => (
                      <div>
                        <p class="font-mono text-[9px] text-stone-600 uppercase mb-2">
                          {key}
                        </p>
                        <RaidProgressionBar tier={tier} />
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>

            {/* Footer */}
            <p class="font-mono text-[9px] text-stone-700 text-right">
              Atualizado em{" "}
              {new Date(data().last_crawled_at).toLocaleString("pt-BR")}
            </p>
          </div>
        )}
      </Show>
    </div>
  );
};

export default CharacterDetailsPage;
