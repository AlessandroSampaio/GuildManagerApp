import SectionHeader from "@/components/ui/SectionHeader";
import { SkeletonList } from "@/components/ui/Skeleton";
import { classColor, raiderIoScoreColor } from "@/helpers/colors";
import { authStore } from "@/stores/auth";
import { characterKeys } from "@/lib/query-keys";
import { charactersApi } from "@/api/characters";
import { useQuery } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
import { Component, For, Show, createMemo } from "solid-js";

const DashboardPage: Component = () => {
  const characters = useQuery(() => ({
    queryKey: characterKeys.mine(true),
    queryFn: () => charactersApi.getMyCharacters(true),
    staleTime: Infinity,
    gcTime: 0,
  }));

  const sortedCharacters = createMemo(() =>
    [...(characters.data ?? [])].sort(
      (a, b) => (b.raiderIoSnapshot?.score ?? 0) - (a.raiderIoSnapshot?.score ?? 0)
    )
  );
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
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <For each={sortedCharacters()}>
                {(char, i) => (
                  <div
                    class="flex items-center gap-3 px-3 py-2 bg-void-800/40 border border-void-700
                           hover:bg-void-700/40 transition-colors animate-fade-in cursor-pointer"
                    style={`animation-delay:${i() * 40}ms`}
                    onClick={() => navigate(`/app/characters/${char.id}`)}
                  >
                    {/* Thumbnail */}
                    <div class="relative w-10 h-10 shrink-0 bg-void-900 overflow-hidden">
                      <Show
                        when={char.raiderIoSnapshot?.thumbnailUrl}
                        fallback={
                          <div
                            class={`w-full h-full flex items-center justify-center text-base font-display opacity-30 ${classColor(char.class)}`}
                          >
                            {char.name[0]}
                          </div>
                        }
                      >
                        <img
                          src={char.raiderIoSnapshot!.thumbnailUrl}
                          alt={char.name}
                          class="w-full h-full object-cover object-top"
                        />
                      </Show>
                      {/* Class color bar */}
                      <div
                        class={`absolute bottom-0 left-0 right-0 h-0.5 opacity-80 ${classColor(char.class).replace("text-", "bg-")}`}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Name + server + guild */}
                    <div class="flex-1 min-w-0">
                      <p class={`font-semibold text-sm truncate ${classColor(char.class)}`}>
                        {char.name}
                      </p>
                      <p class="font-mono text-[10px] text-stone-600 mt-0.5 truncate">
                        {char.server}
                        <Show when={char.guildName}>
                          <span class="text-void-500"> · </span>
                          <span class="text-stone-700">{char.guildName}</span>
                        </Show>
                      </p>
                    </div>

                    {/* M+ Score */}
                    <Show when={char.raiderIoSnapshot?.score != null}>
                      <span
                        class="font-mono text-xs shrink-0"
                        style={`color: ${raiderIoScoreColor(char.raiderIoSnapshot!.score)}`}
                      >
                        {Math.round(char.raiderIoSnapshot!.score)}
                      </span>
                    </Show>
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
