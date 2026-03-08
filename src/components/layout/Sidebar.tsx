import { authApi } from "@/api/auth";
import { authStore } from "@/stores/auth";
import { A, useLocation, useNavigate } from "@solidjs/router";
import { Component, For } from "solid-js";

const NAV = [
  {
    href: "/app/dashboard",
    label: "Dashboard",
    icon: (active: boolean) => (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        stroke={active ? "#c8741c" : "currentColor"}
        stroke-width="1.2"
      >
        <rect x="1" y="1" width="5.5" height="5.5" rx="0.5" />
        <rect x="8.5" y="1" width="5.5" height="5.5" rx="0.5" />
        <rect x="1" y="8.5" width="5.5" height="5.5" rx="0.5" />
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="0.5" />
      </svg>
    ),
  },
  {
    href: "/app/reports",
    label: "Reports",
    icon: (active: boolean) => (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        stroke={active ? "#c8741c" : "currentColor"}
        stroke-width="1.2"
      >
        <path d="M3 1.5h6.5l2.5 2.5V13.5H3z" />
        <path d="M9.5 1.5V4H12" />
        <line x1="5" y1="7" x2="10" y2="7" />
        <line x1="5" y1="9.5" x2="8.5" y2="9.5" />
      </svg>
    ),
  },
  {
    href: "/app/players",
    label: "Jogadores",
    icon: (active: boolean) => (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        stroke={active ? "#c8741c" : "currentColor"}
        stroke-width="1.2"
      >
        <circle cx="6" cy="5.5" r="2.5" />
        <path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5" />
        <circle cx="11.5" cy="5" r="2" />
        <path d="M11.5 9c1.9 0 3 1.4 3 3" />
      </svg>
    ),
  },
  {
    href: "/app/raid-weeks",
    label: "Semanas",
    icon: (active: boolean) => (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        stroke={active ? "#c8741c" : "currentColor"}
        stroke-width="1.2"
      >
        <rect x="1.5" y="2.5" width="12" height="11" rx="0.5" />
        <line x1="1.5" y1="6" x2="13.5" y2="6" />
        <line x1="5" y1="1" x2="5" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="4.5" y1="9" x2="6.5" y2="9" />
        <line x1="8.5" y1="9" x2="10.5" y2="9" />
      </svg>
    ),
  },
  {
    href: "/app/scoring",
    label: "Pontuação",
    icon: (active: boolean) => (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        stroke={active ? "#c8741c" : "currentColor"}
        stroke-width="1.2"
      >
        <path d="M2 12l3-4 2.5 2 3-5 2.5 3" />
        <circle
          cx="13"
          cy="3"
          r="1.5"
          fill={active ? "#c8741c" : "none"}
          stroke={active ? "#c8741c" : "currentColor"}
        />
      </svg>
    ),
  },
  {
    href: "/app/settings",
    label: "Configurações",
    icon: (active: boolean) => (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        stroke={active ? "#c8741c" : "currentColor"}
        stroke-width="1.2"
      >
        <circle cx="7.5" cy="7.5" r="2.2" />
        <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.7 2.7l1.06 1.06M11.24 11.24l1.06 1.06M2.7 12.3l1.06-1.06M11.24 3.76l1.06-1.06" />
      </svg>
    ),
  },
];

const Sidebar: Component = () => {
  const loc = useLocation();
  const nav = useNavigate();

  async function logout() {
    const rt = authStore.refreshToken();
    if (rt)
      await authApi
        .logout(rt)
        .then(() => nav("/"))
        .catch(() => {});
    authStore.clear();
  }

  const initials = () => (authStore.user()?.username ?? "?")[0].toUpperCase();

  return (
    <aside class="w-[13.3rem] bg-void-950 border-r border-void-700 flex flex-col shrink-0">
      {/* Avatar */}
      <div class="p-4 border-b border-void-700">
        <div class="flex items-center gap-3">
          <div class="size-8 border border-ember-800 bg-forge-900 flex items-center justify-center font-display text-xs text-ember-600 animate-ember-pulse shrink-0">
            {initials()}
          </div>
          <div class="min-w-0">
            <p class="text-stone-100 font-bold text-sm truncate leading-tight">
              {authStore.user()?.username}
            </p>
            <p class="font-mono text-[10px] text-stone-500 truncate">
              {authStore.user()?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav class="flex-1 p-2 space-y-px overflow-y-auto">
        <For each={NAV}>
          {(item) => {
            const active = () => loc.pathname.startsWith(item.href);

            return (
              <A
                href={item.href}
                class={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold tracking-wide
                        transition-all duration-150 border-l-2
                        ${
                          active()
                            ? "bg-forge-900/40 text-ember-600 border-ember-700"
                            : "text-stone-500 hover:text-stone-200 hover:bg-void-800 border-transparent"
                        }`}
              >
                {item.icon(active())}
                {item.label}
              </A>
            );
          }}
        </For>
      </nav>

      {/* WCL status pill */}
      <div class="px-4 py-3 border-t border-void-700">
        <A href="/app/settings" class="flex items-center gap-2 group">
          <div
            class={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
              authStore.wclAuthorized()
                ? "bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.9)]"
                : "bg-void-500"
            }`}
          />
          <span class="font-mono text-[10px] text-stone-600 group-hover:text-stone-400 tracking-wider transition-colors">
            {authStore.wclAuthorized() ? "WCL CONECTADO" : "WCL OFFLINE"}
          </span>
        </A>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        class="flex items-center gap-2.5 px-5 py-3 border-t border-void-700
                     text-sm text-stone-600 hover:text-red-400 hover:bg-void-800
                     transition-all duration-150 font-semibold tracking-wide"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          stroke-width="1.2"
        >
          <path d="M5 2H2v10h3" />
          <path d="M10 4.5l2.5 2.5L10 9.5" />
          <line x1="12.5" y1="7" x2="5.5" y2="7" />
        </svg>
        Sair
      </button>
    </aside>
  );
};

export default Sidebar;
