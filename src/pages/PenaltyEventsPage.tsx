import { CreateEventPenalityForm } from "@/components/forms/CreateEventPenalityForm";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { EventRow } from "@/components/ui/EventRow";
import SectionHeader from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { usePenaltyEvents } from "@/lib/queries/penalty";
import { authStore } from "@/stores/auth";
import { Component, For, Show } from "solid-js";

const PenaltyEventsPage: Component = () => {
  const isAdmin = () => authStore.user()?.role?.toUpperCase() === "ADMIN";
  const eventsQ = usePenaltyEvents();

  return (
    <div class="flex-1 overflow-y-auto p-8">
      <div class="max-w-2xl space-y-6">
        <SectionHeader label="Raid Management" title="Eventos de Penalidade" />

        <div class="card space-y-3">
          <p class="label-xs mb-0">Como funciona</p>
          <p class="text-stone-500 text-sm leading-relaxed">
            Eventos de penalidade definem os tipos de infração que podem ser
            atribuídos a players em uma semana de raid. Cada evento desconta{" "}
            <span class="text-stone-300 font-semibold">pontos</span> do total do
            player no cálculo de pontuação da semana.
          </p>
        </div>

        <Show when={isAdmin()}>
          <CreateEventPenalityForm />
        </Show>

        <div class="card space-y-4">
          <div class="flex items-center justify-between">
            <p class="label-xs">Eventos Cadastrados</p>
            <Show when={eventsQ.isFetching && !eventsQ.isLoading}>
              <Spinner size={12} class="text-stone-600" />
            </Show>
          </div>

          <Show when={eventsQ.isLoading}>
            <div class="flex items-center gap-2 py-4 text-stone-600 font-mono text-xs">
              <Spinner size={13} />
              Carregando…
            </div>
          </Show>

          <Show when={eventsQ.isError}>
            <ErrorBanner message="Falha ao carregar eventos de penalidade." />
          </Show>

          <Show when={eventsQ.isSuccess}>
            <Show
              when={(eventsQ.data?.length ?? 0) > 0}
              fallback={
                <p class="font-mono text-xs text-stone-600 py-2">
                  Nenhum evento cadastrado.
                  <Show when={isAdmin()}>
                    Crie um usando o formulário acima.
                  </Show>
                </p>
              }
            >
              {/* Column header */}
              <div class="grid grid-cols-[1fr_auto_auto] gap-4 px-4 mb-1">
                <span class="label-xs">Descrição</span>
                <span class="label-xs">Pontos</span>
                <Show when={isAdmin()}>
                  <span class="label-xs">Ações</span>
                </Show>
              </div>

              <div class="space-y-1">
                <For each={eventsQ.data}>{(ev) => <EventRow event={ev} />}</For>
              </div>
            </Show>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default PenaltyEventsPage;
