import { classColor, raiderIoScoreColor } from "@/helpers/colors";
import { useCharacterRaiderIo } from "@/lib/queries/character";
import { MythicPlusRun, RaiderIoRaidTier } from "@/types/characters";
import { useNavigate, useParams } from "@solidjs/router";
import { For, Show } from "solid-js";

function RaidProgressionBar(p: { tier: RaiderIoRaidTier }) {
  const total = p.tier.totalBosses;
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
            {p.tier.normalBossesKilled}
            <span class="text-stone-600">/{total}</span>
          </p>
        </div>
        <div class="bg-void-800 border border-void-700 px-2 py-1.5">
          <p class="font-mono text-[9px] text-amber-700 uppercase mb-0.5">
            Heroic
          </p>
          <p class="font-mono text-xs text-amber-400">
            {p.tier.heroicBossesKilled}
            <span class="text-stone-600">/{total}</span>
          </p>
        </div>
        <div class="bg-void-800 border border-void-700 px-2 py-1.5">
          <p class="font-mono text-[9px] text-violet-700 uppercase mb-0.5">
            Mythic
          </p>
          <p class="font-mono text-xs text-violet-400">
            {p.tier.mythicBossesKilled}
            <span class="text-stone-600">/{total}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function MythicPlusRunCard(p: { run: MythicPlusRun }) {
  const r = p.run;
  return (
    <div class="bg-void-800 border border-void-700 overflow-hidden">
      {/* Dungeon header with background image */}
      <div class="relative flex items-center gap-3 px-3 py-2.5">
        <div
          class="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ "background-image": `url(${r.backgroundImageUrl})` }}
          aria-hidden="true"
        />
        <img
          src={r.iconUrl}
          alt={r.dungeon}
          class="w-8 h-8 shrink-0 border border-void-600 relative z-10"
        />
        <div class="flex-1 min-w-0 relative z-10">
          <p class="font-semibold text-sm text-stone-100 truncate">
            {r.dungeon}
          </p>
          <p class="font-mono text-[10px] text-stone-500">{r.shortName}</p>
        </div>
        {/* Key level badge */}
        <div class="relative z-10 text-right shrink-0">
          <p class="font-display text-lg leading-none text-amber-300">
            +{r.mythicLevel}
          </p>
          <p
            class="font-mono text-[9px] mt-0.5"
            style={`color: ${raiderIoScoreColor(r.score * 8)}`}
          >
            {r.score.toFixed(1)} pts
          </p>
        </div>
      </div>

      {/* Affixes */}
      <Show when={r.affixes.length > 0}>
        <div class="border-t border-void-700 px-3 py-2 flex items-center gap-2 flex-wrap">
          <For each={r.affixes}>
            {(affix) => (
              <div class="flex items-center gap-1.5">
                <img
                  src={affix.iconUrl}
                  alt={affix.name}
                  class="w-4 h-4 border border-void-600"
                />
                <span class="font-mono text-[9px] text-stone-500">
                  {affix.name}
                </span>
              </div>
            )}
          </For>
        </div>
      </Show>
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

      <Show when={profile.isSuccess && profile.data && !profile.data.isFresh}>
        <div class="flex items-center justify-between gap-3 bg-amber-950/40 border border-amber-700/60 px-4 py-2.5 mb-5">
          <p class="font-mono text-[10px] text-amber-400 uppercase tracking-wide">
            Dados desatualizados — este perfil não foi sincronizado recentemente
          </p>
          <button
            onClick={() => profile.refetch()}
            class="shrink-0 font-mono text-[10px] text-amber-300 border border-amber-700/60
                   bg-amber-900/30 hover:bg-amber-800/40 transition-colors px-2.5 py-1 uppercase tracking-wide"
          >
            Atualizar
          </button>
        </div>
      </Show>

      <Show when={profile.isSuccess && profile.data}>
        {(data) => (
          <div class="space-y-5 animate-fade-in">
            {/* Header card */}
            <div class="bg-void-800 border border-void-700 p-4 flex items-start gap-4">
              <img
                src={data().thumbnailUrl}
                alt={data().name}
                class="w-14 h-14 object-cover shrink-0 border border-void-600"
              />
              <div class="flex-1 min-w-0">
                <h1
                  class={`font-display text-xl leading-tight truncate ${classColor(data().className ?? "")}`}
                >
                  {data().name}
                </h1>
                <p class="font-mono text-[11px] text-stone-500 mt-0.5">
                  {data().className ?? "Unknown"} · {data().server}–
                  {data().region.toUpperCase()}
                </p>
                <div class="flex items-center gap-2 mt-2 flex-wrap">
                  <Show when={data().guildName}>
                    <span class="font-mono text-[9px] px-1.5 py-0.5 bg-void-700 border border-void-600 text-stone-400">
                      &lt;{data().guildName}&gt;
                    </span>
                  </Show>
                  <span
                    class="font-mono text-[9px]"
                    style={`color: ${raiderIoScoreColor(data().score)}`}
                  >
                    {data().score.toFixed(1)} score
                  </span>
                </div>
              </div>
            </div>

            {/* Mythic+ best runs */}
            <Show when={(data().mythicRuns?.length ?? 0) > 0}>
              <div>
                <h2 class="font-mono text-[10px] text-stone-500 uppercase tracking-widest mb-3">
                  Mythic+ Melhores Runs
                </h2>
                <div class="grid gap-3 grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
                  <For each={data().mythicRuns}>
                    {(run) => <MythicPlusRunCard run={run} />}
                  </For>
                </div>
              </div>
            </Show>

            {/* Raid progression */}
            <Show when={(data().raidProgressions?.length ?? 0) > 0}>
              <div class="bg-void-800 border border-void-700 p-4">
                <h2 class="font-mono text-[10px] text-stone-500 uppercase tracking-widest mb-3">
                  Progressão de Raid
                </h2>
                <div class="space-y-4">
                  <For each={data().raidProgressions}>
                    {(tier) => (
                      <div>
                        <p class="font-mono text-[9px] text-stone-600 uppercase mb-2">
                          {tier.raidSlug}
                        </p>
                        <RaidProgressionBar tier={tier} />
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            {/* Footer */}
            <p class="font-mono text-[9px] text-stone-700 text-right">
              Atualizado em{" "}
              {new Date(data().lastCrawledAt).toLocaleString("pt-BR")}
            </p>
          </div>
        )}
      </Show>
    </div>
  );
};

export default CharacterDetailsPage;
