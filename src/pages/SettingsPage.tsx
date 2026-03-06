import ChangePasswordCard from "@/components/ChangePasswordCard";
import SectionHeader from "@/components/ui/SectionHeader";
import WclCredentialsCard from "@/components/WclCredentialsCard";
import WclOAuthCard from "@/components/WclOAuthCard";
import { authStore } from "@/stores/auth";
import { Show } from "solid-js";

const SettingsPage = () => {
  const isAdmin = () => authStore.user()?.role == "1";

  return (
    <div class="flex-1 overflow-y-auto p-8">
      <div class="max-w-2xl space-y-4">
        <SectionHeader label="Sistema" title="Conta & Integrações" />
        <div class="card animate-fade-in">
          <p class="label-xs mb-4">Usuário Local</p>
          <dl class="grid grid-cols-2 gap-x-8 gap-y-4">
            {(
              [
                ["USERNAME", () => authStore.user()?.username],
                ["E-MAIL", () => authStore.user()?.email],
                ["ROLE", () => authStore.user()?.role],
                [
                  "MEMBRO DESDE",
                  () =>
                    authStore.user()?.createdAt
                      ? new Date(
                          authStore.user()!.createdAt,
                        ).toLocaleDateString("pt-BR")
                      : "—",
                ],
              ] as [string, () => string | undefined][]
            ).map(([k, v]) => (
              <div>
                <dt class="label-xs mb-1">{k}</dt>
                <dd class="text-stone-200 font-semibold text-sm">
                  {v() ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Show when={isAdmin()}>
          <WclCredentialsCard />
        </Show>
        <WclOAuthCard />
        <ChangePasswordCard />
      </div>
    </div>
  );
};

export default SettingsPage;
