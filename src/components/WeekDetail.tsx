import { ApiError } from "@/api/client";
import { formatWeekRange, isTuesday } from "@/helpers";
import {
  useAddReportToWeek,
  useDeleteRaidWeek,
  useRaidWeekDetail,
  useRemoveReportFromWeek,
  useUpdateRaidWeek,
} from "@/lib/queries/raid-week";
import { authStore } from "@/stores/auth";
import { useNavigate } from "@solidjs/router";
import { Component, For, Show, createSignal } from "solid-js";
import { ErrorBanner } from "./ui/ErrorBanner";
import { SkeletonList } from "./ui/Skeleton";
import { Spinner } from "./ui/Spinner";
import { WeekPenalties } from "./WeekPenalties";

export const WeekDetail: Component<{ weekId: number; onClose: () => void }> = (
  props,
) => {
  const isAdmin = () => authStore.user()?.role?.toUpperCase() === "ADMIN";
  const weekQ = useRaidWeekDetail(() => props.weekId);
  const updateMut = useUpdateRaidWeek();
  const deleteMut = useDeleteRaidWeek();
  const addMut = useAddReportToWeek();
  const removeMut = useRemoveReportFromWeek();
  const nav = useNavigate();

  const [editing, setEditing] = createSignal(false);
  const [editLabel, setEditLabel] = createSignal("");
  const [editDate, setEditDate] = createSignal("");
  const [newCode, setNewCode] = createSignal("");
  const [confirmDel, setConfirmDel] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  function startEdit() {
    setEditLabel(weekQ.data?.label ?? "");
    setEditDate(weekQ.data?.startsAt?.slice(0, 10) ?? "");
    setError(null);
    setEditing(true);
  }

  function saveEdit() {
    if (!editLabel().trim()) {
      setError("Rótulo obrigatório.");
      return;
    }
    if (!isTuesday(editDate())) {
      setError(`Data deve ser Terça-Feira.`);
      return;
    }
    setError(null);
    updateMut.mutate(
      { id: props.weekId, label: editLabel().trim(), startsAt: editDate() },
      {
        onSuccess: () => setEditing(false),
        onError: (err) =>
          setError(
            err instanceof ApiError ? err.message : "Falha ao atualizar.",
          ),
      },
    );
  }

  function addReport() {
    const code = newCode().trim();
    if (!code) return;
    setError(null);
    addMut.mutate(
      { id: props.weekId, reportCode: code },
      {
        onSuccess: () => setNewCode(""),
        onError: (err) =>
          setError(
            err instanceof ApiError ? err.message : "Falha ao associar report.",
          ),
      },
    );
  }

  function removeReport(code: string) {
    removeMut.mutate({ id: props.weekId, reportCode: code });
  }

  function deleteWeek() {
    deleteMut.mutate(props.weekId, {
      onSuccess: () => {
        setConfirmDel(false);
        props.onClose();
      },
    });
  }

  const week = () => weekQ.data;

  return (
    <div class="flex-1 min-w-0 space-y-5">
      <Show when={weekQ.isLoading}>
        <SkeletonList rows={3} />
      </Show>
      <Show when={weekQ.isError}>
        <ErrorBanner message="Falha ao carregar semana." />
      </Show>
      <Show when={week()}>
        {/* Header */}
        <div class="flex items-start justify-between">
          <div>
            <Show
              when={!editing()}
              fallback={
                <div class="space-y-2 animate-fade-in">
                  <input
                    type="text"
                    value={editLabel()}
                    onInput={(e) => setEditLabel(e.currentTarget.value)}
                    maxlength="128"
                    class="w-full bg-void-800 border border-void-600 px-3 py-2 font-display text-base text-stone-100 focus:outline-none focus:border-ember-700 transition-colors"
                  />
                  <div>
                    <input
                      type="date"
                      value={editDate()}
                      onInput={(e) => setEditDate(e.currentTarget.value)}
                      class="bg-void-800 border border-void-600 px-3 py-1.5 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors"
                    />
                    <Show when={editDate() && !isTuesday(editDate())}>
                      <span class="font-mono text-[10px] text-amber-500 ml-2">
                        ⚠ Deve ser Terça-Feira
                      </span>
                    </Show>
                  </div>
                  <Show when={error()}>
                    <p class="font-mono text-xs text-red-400">{error()}</p>
                  </Show>
                  <div class="flex gap-2">
                    <button
                      onClick={saveEdit}
                      disabled={updateMut.isPending}
                      class="btn-primary text-xs py-1.5 px-4 flex items-center gap-2"
                    >
                      <Show when={updateMut.isPending}>
                        <Spinner size={12} />
                      </Show>
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      class="btn-ghost text-xs py-1.5 px-3"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              }
            >
              <h3 class="font-display text-lg text-stone-100 tracking-wide">
                {week()!.label}
              </h3>
              <p class="font-mono text-[11px] text-stone-500 mt-1">
                {formatWeekRange(week()!.startsAt, week()!.endsAt)}
                <span class="ml-2 text-stone-700">
                  · criado{" "}
                  {new Date(week()!.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </p>
            </Show>
          </div>

          <Show when={isAdmin() && !editing()}>
            <div class="flex items-center gap-2 ml-4 shrink-0">
              <button onClick={startEdit} class="btn-ghost text-xs py-1.5 px-3">
                Editar
              </button>
              <button
                onClick={() => nav(`/app/player-scoring/${props.weekId}`)}
                class="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <circle cx="6" cy="6" r="5" />
                  <path
                    d="M4 6l1.5 1.5L8 4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Calcular Pontos
              </button>
              <button
                onClick={() => setConfirmDel(true)}
                class="btn-danger text-xs py-1.5 px-3"
              >
                Remover
              </button>
            </div>
          </Show>
          <Show when={!isAdmin()}>
            <button
              onClick={() => nav(`/app/player-scoring/${props.weekId}`)}
              class="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 ml-4 shrink-0"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <circle cx="6" cy="6" r="5" />
                <path
                  d="M4 6l1.5 1.5L8 4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Ver Pontuação
            </button>
          </Show>
        </div>

        {/* Confirm delete */}
        <Show when={confirmDel()}>
          <div class="border border-red-900 bg-red-950/40 p-4 space-y-3 animate-fade-in">
            <p class="font-mono text-xs text-red-400">
              Remover "{week()!.label}"?
            </p>
            <div class="flex gap-2">
              <button
                onClick={deleteWeek}
                disabled={deleteMut.isPending}
                class="btn-danger text-xs py-1.5 px-4 flex items-center gap-2"
              >
                <Show when={deleteMut.isPending}>
                  <Spinner size={12} />
                </Show>
                Confirmar
              </button>
              <button
                onClick={() => setConfirmDel(false)}
                class="btn-ghost text-xs py-1.5 px-3"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Show>

        {/* Reports list */}
        <div class="card space-y-4">
          <p class="label-xs">Report Codes</p>

          <Show
            when={(week()!.reportCodes?.length ?? 0) > 0}
            fallback={
              <p class="font-mono text-xs text-stone-600 py-2">
                Nenhum report associado. Adicione abaixo.
              </p>
            }
          >
            <div class="space-y-1.5">
              <For each={week()!.reportCodes}>
                {(code) => (
                  <div class="flex items-center justify-between px-3 py-2 bg-void-800/60 border border-void-600">
                    <span class="font-mono text-xs text-stone-300">{code}</span>
                    <Show when={isAdmin()}>
                      <button
                        onClick={() => removeReport(code)}
                        disabled={removeMut.isPending}
                        class="text-stone-600 hover:text-red-400 transition-colors ml-3"
                        title="Remover"
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 11 11"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                        >
                          <line
                            x1="2"
                            y1="2"
                            x2="9"
                            y2="9"
                            stroke-linecap="round"
                          />
                          <line
                            x1="9"
                            y1="2"
                            x2="2"
                            y2="9"
                            stroke-linecap="round"
                          />
                        </svg>
                      </button>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* Add report */}
          <Show when={isAdmin()}>
            <div class="space-y-2">
              <Show when={error()}>
                <p class="font-mono text-xs text-red-400">{error()}</p>
              </Show>
              <div class="flex gap-2">
                <input
                  type="text"
                  value={newCode()}
                  onInput={(e) => setNewCode(e.currentTarget.value)}
                  onKeyDown={(e) => e.key === "Enter" && addReport()}
                  placeholder="WCL report code…"
                  maxlength="16"
                  class="flex-1 bg-void-800 border border-void-600 px-3 py-2 font-mono text-xs text-stone-200 focus:outline-none focus:border-ember-700 transition-colors"
                />
                <button
                  onClick={addReport}
                  disabled={addMut.isPending || !newCode().trim()}
                  class="btn-ghost text-xs py-1.5 px-4 flex items-center gap-2 disabled:opacity-40"
                >
                  <Show when={addMut.isPending}>
                    <Spinner size={12} />
                  </Show>
                  Adicionar
                </button>
              </div>
              <p class="font-mono text-[10px] text-stone-700">
                Reports podem ser adicionados antes de serem importados.
              </p>
            </div>
          </Show>
        </div>

        {/* Penalties */}
        <WeekPenalties weekId={props.weekId} />

        {/* Quick action */}
        <div class="flex justify-end">
          <button
            onClick={() => nav(`/app/player-scoring/${props.weekId}`)}
            class="btn-primary flex items-center gap-2 text-sm py-2 px-5"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
            >
              <circle cx="7" cy="7" r="5.5" />
              <path
                d="M5 7l1.5 2L9.5 5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Calcular Pontuação da Semana
          </button>
        </div>
      </Show>
    </div>
  );
};
