import { useCoreList } from "@/lib/queries/core";
import { Component, createSignal, For, Show } from "solid-js";
import { SkeletonList } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { CoreRow } from "@/components/CoreRow";
import { CorePanel } from "@/components/CorePanel";
import { CreateCoreForm } from "@/components/forms/CreateCoreForm";

const CoresPage: Component = () => {
  const [page, setPage] = createSignal(1);
  const [selectedId, setSelectedId] = createSignal<number | null>(null);

  const list = useCoreList(page);
  const isFetching = () => list.isFetching && !list.isLoading;

  return (
    <div class="flex-1 flex min-h-0">
      {/* Left column — core list */}
      <div class="w-72 border-r border-void-700 flex flex-col shrink-0">
        <div class="p-4 border-b border-void-700">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="label-xs mb-0.5">Comunidade</p>
              <h2 class="font-display text-base text-stone-100 tracking-wide">
                Cores
              </h2>
            </div>
            <Show when={isFetching()}>
              <Spinner class="text-stone-600" size={14} />
            </Show>
          </div>

          <Show when={list.isSuccess}>
            <p class="font-mono text-[10px] text-stone-600">
              {list.data?.total ?? 0} core
              {(list.data?.total ?? 0) !== 1 ? "s" : ""} registrado
              {(list.data?.total ?? 0) !== 1 ? "s" : ""}
            </p>
          </Show>
        </div>

        <div class="px-4 py-3 border-b border-void-700">
          <CreateCoreForm onCreated={setSelectedId} />
        </div>

        <div class="flex-1 overflow-y-auto py-1 space-y-px">
          <Show when={list.isLoading}>
            <div class="px-4 py-2">
              <SkeletonList rows={5} />
            </div>
          </Show>

          <Show when={list.isError}>
            <p class="px-4 py-3 font-mono text-xs text-red-400">
              Erro ao carregar cores.
            </p>
          </Show>

          <Show when={list.isSuccess}>
            <Show
              when={(list.data?.data.length ?? 0) > 0}
              fallback={
                <div class="px-4 py-8 text-center">
                  <p class="font-mono text-xs text-stone-600">
                    Nenhum core cadastrado
                  </p>
                </div>
              }
            >
              <For each={list.data?.data}>
                {(core) => (
                  <CoreRow
                    core={core}
                    selected={selectedId() === core.id}
                    onClick={() => setSelectedId(core.id)}
                  />
                )}
              </For>
            </Show>
          </Show>
        </div>

        <Show when={(list.data?.total ?? 0) > 20}>
          <div class="px-4 py-3 border-t border-void-700 flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page() <= 1}
              class="btn-ghost text-xs py-1 px-3 disabled:opacity-30 flex-1"
            >
              ← Ant.
            </button>
            <span class="font-mono text-[10px] text-stone-600 shrink-0">
              {page()}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(list.data?.data.length ?? 0) < 20}
              class="btn-ghost text-xs py-1 px-3 disabled:opacity-30 flex-1"
            >
              Próx. →
            </button>
          </div>
        </Show>
      </div>

      {/* Right panel — core detail */}
      <div class="flex-1 min-h-0">
        <Show
          when={selectedId() !== null}
          fallback={
            <div class="h-full flex flex-col items-center justify-center text-center px-8">
              <div class="w-16 h-16 border border-void-600 flex items-center justify-center mb-5">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.8"
                  class="text-void-500"
                  aria-hidden="true"
                >
                  <circle cx="14" cy="9" r="4" />
                  <circle cx="6" cy="19" r="3" />
                  <circle cx="22" cy="19" r="3" />
                  <line x1="14" y1="13" x2="6" y2="16" />
                  <line x1="14" y1="13" x2="22" y2="16" />
                </svg>
              </div>
              <p class="text-stone-600 font-semibold text-sm">
                Selecione um core
              </p>
              <p class="text-stone-700 text-xs font-mono mt-1 leading-relaxed max-w-xs">
                ou crie um novo usando o botão na lista à esquerda
              </p>
            </div>
          }
        >
          <CorePanel
            coreId={selectedId()!}
            onDeleted={() => setSelectedId(null)}
          />
        </Show>
      </div>
    </div>
  );
};

export default CoresPage;
