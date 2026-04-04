import SectionHeader from "@/components/ui/SectionHeader";
import { SkeletonList } from "@/components/ui/Skeleton";
import { classColor } from "@/helpers/colors";
import { useMyCharacters } from "@/lib/queries/character";
import { authStore } from "@/stores/auth";
import { useNavigate } from "@solidjs/router";
import { Component, For, Show } from "solid-js";

const DashboardPage: Component = () => {
  const characters = useMyCharacters(true);
  const navigate = useNavigate();

  return (
    <div class="flex-1 overflow-y-auto p-8">
      <div class="space-y-6">
        <SectionHeader
          label="Painel"
          title={`Olá, ${authStore.user()?.username ?? "Champion"}`}
        />

        <div>
          <p class="label-xs mb-4">Meus Personagens</p>

          <Show when={characters.isLoading}>
            <SkeletonList rows={4} />
          </Show>

          <Show when={characters.isError}>
            <div
              role="alert"
              class="bg-red-950/60 border border-red-900 px-4 py-3 font-mono text-xs text-red-400"
            >
              Falha ao carregar personagens. Tente recarregar a página.
            </div>
          </Show>

          <Show
            when={characters.isSuccess && (characters.data?.length ?? 0) === 0}
          >
            <div class="card text-center py-10">
              <p class="text-stone-400 text-sm font-semibold mb-1">
                Nenhum personagem vinculado
              </p>
              <p class="text-stone-600 font-mono text-xs">
                Conecte sua conta Battle.net em Perfil para sincronizar seus
                personagens.
              </p>
            </div>
          </Show>

          <Show
            when={characters.isSuccess && (characters.data?.length ?? 0) > 0}
          >
            <div class="space-y-1">
              <For each={characters.data}>
                {(char, i) => (
                  <div
                    class="flex items-center gap-4 px-4 py-3 bg-void-800/40 border border-void-700
                           hover:bg-void-700/40 transition-colors animate-fade-in cursor-pointer"
                    style={`animation-delay:${i() * 30}ms`}
                    onClick={() => navigate(`/app/characters/${char.id}`)}
                  >
                    {/* Class color bar */}
                    <div
                      class={`w-0.5 self-stretch shrink-0 rounded-full opacity-70 ${classColor(char.class).replace("text-", "bg-")}`}
                      aria-hidden="true"
                    />

                    {/* Name + server */}
                    <div class="flex-1 min-w-0">
                      <p
                        class={`font-semibold text-sm ${classColor(char.class)}`}
                      >
                        {char.name}
                      </p>
                      <p class="font-mono text-[10px] text-stone-600 mt-0.5">
                        {char.server}
                      </p>
                    </div>

                    {/* Class */}
                    <p class="font-mono text-xs text-stone-500 shrink-0 w-28 text-right">
                      {char.class}
                    </p>

                    {/* Guild */}
                    <p class="font-mono text-xs text-stone-600 shrink-0 w-40 text-right truncate">
                      {char.guildName ?? <span class="text-void-500">—</span>}
                    </p>

                    {/* M+ Score */}
                    <p class="font-mono text-xs shrink-0 w-20 text-right">
                      <Show
                        when={char.raiderIoSnapshot?.score != null}
                        fallback={<span class="text-void-500">—</span>}
                      >
                        <span class="text-amber-400">
                          {(Math.round(char.raiderIoSnapshot!.score * 100) / 100).toFixed(2)}
                        </span>
                      </Show>
                    </p>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
