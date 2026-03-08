import { ActiveTiersDisplay } from "@/components/ActiveTiersDisplay";
import { ScoreTester } from "@/components/ScoreTester";
import { TierEditor } from "@/components/TierEditor";
import { TierRow } from "@/components/TierRow";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import SectionHeader from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import {
  useDeleteScoringSettings,
  useScoringSettings,
} from "@/lib/queries/scoring";
import { ScoringTiersForm } from "@/schemas/scoringTierSchema";
import { authStore } from "@/stores/auth";
import { DEFAULT_TIERS } from "@/types/scoring";
import { Component, createSignal, For, Show } from "solid-js";

const ScoringPage: Component = () => {
  const isAdmin = () => authStore.user()?.role?.toUpperCase() === "ADMIN";
  const settingsQ = useScoringSettings();
  const deleteMut = useDeleteScoringSettings();

  const [editing, setEditing] = createSignal(false);
  const [confirmDel, setConfirmDel] = createSignal(false);
  const [deleteError, setDeleteError] = createSignal<string | null>(null);

  const hasConfig = () => (settingsQ.data?.tiers?.length ?? 0) > 0;

  function editorInitialTiers(): ScoringTiersForm["tiers"] {
    const t = settingsQ.data?.tiers;
    if (t?.length) {
      return t.map((t) => ({
        minPercent: t.minPercent,
        maxPercent: t.maxPercent,
        points: t.points,
        label: t.label ?? "",
      }));
    }
    return DEFAULT_TIERS;
  }

  return (
    <div class="flex overflow-y-auto p-8">
      <div class="max-w-3xl space-y-6">
        <SectionHeader
          label="Raid Management"
          title="Pontuação de Performance"
          action={
            <Show when={isAdmin() && !editing() && hasConfig()}>
              <div class="flex items-center gap-2">
                <button
                  onClick={() => setEditing(true)}
                  class="btn-ghost text-xs py-1.5 px-4"
                >
                  Editar Tiers
                </button>
                <button
                  onClick={() => setConfirmDel(true)}
                  class="btn-danger text-xs py-1.5 px-3"
                >
                  Remover
                </button>
              </div>
            </Show>
          }
        />

        <div class="card">
          <p class="label-xs mb-2">Como funciona</p>
          <p class="text-stone-500 text-sm leading-relaxed">
            As faixas de pontuação mapeiam o{" "}
            <span class="text-stone-300 font-semibold">
              percentil de ranking WCL
            </span>{" "}
            de cada boss kill para um número de pontos. O intervalo deve cobrir{" "}
            <span class="font-mono text-ember-700">0% a 100%</span> sem gaps ou
            sobreposições. Players acumulam pontos pela melhor performance de
            cada character em cada fight.
          </p>
        </div>

        <Show when={settingsQ.isLoading}>
          <div class="flex items-center gap-3 text-stone-500 font-mono text-xs py-4">
            <Spinner size={14} />
            Carregando configuração...
          </div>
        </Show>

        <Show when={settingsQ.isError}>
          <ErrorBanner message="Falha ao carregar configuração de scoring." />
        </Show>

        <Show when={confirmDel()}>
          <ConfirmDeleteDialog
            onConfirm={() => {
              setDeleteError(null);
              deleteMut.mutate(undefined, {
                onSuccess: () => setConfirmDel(false),
                onError: () =>
                  setDeleteError("Falha ao remover a configuração."),
              });
            }}
            onCancel={() => {
              setConfirmDel(false);
              setDeleteError(null);
            }}
            isPending={deleteMut.isPending}
          />
          <Show when={deleteError()}>
            <ErrorBanner message={deleteError()!} />
          </Show>
        </Show>

        <Show when={!editing() && settingsQ.isSuccess}>
          <Show
            when={hasConfig()}
            fallback={
              <EmptyState
                title="Nenhuma configuração de scoring"
                subtitle="Configure as faixas de percentil para habilitar o cálculo de pontos."
                action={
                  <Show when={isAdmin()}>
                    <button
                      onClick={() => setEditing(true)}
                      class="btn-primary text-sm py-2 px-5"
                    >
                      Configurar Agora
                    </button>
                  </Show>
                }
              />
            }
          >
            <div class="card space-y-4">
              <div class="flex items-center justify-between">
                <p class="label-xs">Configuração Ativa</p>
                <span class="font-mono text-[10px] text-stone-600">
                  Atualizado em{" "}
                  {new Date(settingsQ.data!.updatedAt).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              </div>

              {/* Column headers */}
              <div class="grid grid-cols-[1fr_1fr_1fr_2fr] gap-2 px-3">
                <span class="label-xs">Min %</span>
                <span class="label-xs">Max %</span>
                <span class="label-xs">Pontos</span>
                <span class="label-xs">Rótulo</span>
              </div>

              <ActiveTiersDisplay tiers={settingsQ.data!.tiers} />
              <ScoreTester />
            </div>
          </Show>
        </Show>

        <Show when={editing()}>
          <div class="card space-y-5 animate-fade-in">
            <div class="flex items-center justify-between">
              <p class="label-xs">Editor de Faixas</p>
              <button
                onClick={() => setEditing(false)}
                class="text-stone-600 hover:text-stone-300 transition-colors"
                aria-label="Fechar editor"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.3"
                >
                  <line x1="3" y1="3" x2="11" y2="11" stroke-linecap="round" />
                  <line x1="11" y1="3" x2="3" y2="11" stroke-linecap="round" />
                </svg>
              </button>
            </div>
            <TierEditor
              initialTiers={editorInitialTiers()}
              onSuccess={() => setEditing(false)}
              onCancel={() => setEditing(false)}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};

export default ScoringPage;
