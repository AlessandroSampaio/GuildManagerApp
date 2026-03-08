import { NewWeekForm } from "@/components/forms/NewWeekForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import SectionHeader from "@/components/ui/SectionHeader";
import { SkeletonList } from "@/components/ui/Skeleton";
import { WeekDetail } from "@/components/WeekDetail";
import { WeekItem } from "@/components/WeekItem";
import { useRaidWeekList } from "@/lib/queries/raid-week";
import { authStore } from "@/stores/auth";
import { Component, createSignal, For, Show } from "solid-js";

const RaidWeeksPage: Component = () => {
  const isAdmin = () => authStore.user()?.role?.toUpperCase() === "ADMIN";
  const [page] = createSignal(1);
  const [selectedId, setSelectedId] = createSignal<number | null>(null);
  const [showNew, setShowNew] = createSignal(false);

  const listQ = useRaidWeekList(page);

  return (
    <div class="flex-1 overflow-hidden flex flex-col">
      <div class="p-8 pb-4">
        <SectionHeader
          label="Raid Management"
          title="Semanas de Raid"
          action={
            <Show when={isAdmin()}>
              <button
                onClick={() => {
                  setShowNew(true);
                  setSelectedId(null);
                }}
                class="btn-primary text-sm py-2 px-4 flex items-center gap-2"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <line
                    x1="6.5"
                    y1="2"
                    x2="6.5"
                    y2="11"
                    stroke-linecap="round"
                  />
                  <line
                    x1="2"
                    y1="6.5"
                    x2="11"
                    y2="6.5"
                    stroke-linecap="round"
                  />
                </svg>
                Nova Semana
              </button>
            </Show>
          }
        />
      </div>

      <div class="flex-1 overflow-hidden flex gap-0 px-8 pb-8">
        {/* Left: weeks list */}
        <div class="w-60 shrink-0 border border-void-700 bg-void-800/30 overflow-y-auto mr-6 flex flex-col">
          <Show when={listQ.isLoading}>
            <div class="p-4">
              <SkeletonList rows={4} />
            </div>
          </Show>
          <Show when={listQ.isError}>
            <div class="p-4">
              <ErrorBanner message="Falha ao carregar semanas." />
            </div>
          </Show>
          <Show when={listQ.isSuccess && !listQ.data?.data.length}>
            <div class="flex-1 flex items-center justify-center p-4">
              <p class="font-mono text-[11px] text-stone-600 text-center leading-relaxed">
                Nenhuma semana registrada.
                <Show when={isAdmin()}>
                  <br />
                  Clique em "Nova Semana".
                </Show>
              </p>
            </div>
          </Show>
          <Show when={listQ.data?.data.length}>
            <div class="py-2">
              <For each={listQ.data!.data}>
                {(week) => (
                  <WeekItem
                    week={week}
                    active={selectedId() === week.id}
                    onClick={() => {
                      setSelectedId(week.id);
                      setShowNew(false);
                    }}
                  />
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Right: detail or new form */}
        <div class="flex-1 min-w-0 overflow-y-auto">
          <Show when={showNew()}>
            <NewWeekForm onClose={() => setShowNew(false)} />
          </Show>
          <Show when={!showNew() && selectedId() !== null}>
            <WeekDetail
              weekId={selectedId()!}
              onClose={() => setSelectedId(null)}
            />
          </Show>
          <Show when={!showNew() && selectedId() === null}>
            <EmptyState
              title="Selecione uma semana"
              subtitle="Ou crie uma nova para começar."
            />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default RaidWeeksPage;
