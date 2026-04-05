import { Spinner } from "@/components/ui/Spinner";
import { tryRestoreSession } from "@/lib/session";
import { useNavigate } from "@solidjs/router";
import { Component, onMount } from "solid-js";

const RestorePage: Component = () => {
  const nav = useNavigate();

  onMount(async () => {
    console.log("[session] RestorePage mounted — attempting stronghold restore");
    const restored = await tryRestoreSession();
    console.log("[session] restore result:", restored);
    nav(restored ? "/app/dashboard" : "/login", { replace: true });
  });

  return (
    <div class="flex h-screen flex-col items-center justify-center gap-3 bg-void-900">
      <Spinner size={28} class="text-stone-500" />
      <p class="font-mono text-xs text-stone-600">Verificando sessão...</p>
    </div>
  );
};

export default RestorePage;
