import SectionHeader from "@/components/ui/SectionHeader";
import WclCredentialsCard from "@/components/WclCredentialsCard";
import WclOAuthCard from "@/components/WclOAuthCard";
import { authStore } from "@/stores/auth";
import { Show } from "solid-js";

const SettingsPage = () => {
  const isAdmin = () => authStore.user()?.role?.toUpperCase() === "ADMIN";

  return (
    <div class="flex-1 overflow-y-auto p-8">
      <div class="max-w-2xl space-y-4">
        <SectionHeader label="Sistema" title="Configurações" />

        <Show when={isAdmin()}>
          <WclCredentialsCard />
        </Show>
        <WclOAuthCard />
      </div>
    </div>
  );
};

export default SettingsPage;
