import { HashRouter, Route, useNavigate } from "@solidjs/router";
import { QueryClientProvider } from "@tanstack/solid-query";
import { Component, lazy } from "solid-js";
import AppShell from "./components/layout/AppShell";
import TitleBar from "./components/layout/TitleBar";
import UpdateNotification from "./components/UpdateNotification";
import "./index.css";
import { queryClient } from "./lib";
import { authStore } from "./stores/auth";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const ReportDetailPage = lazy(() => import("@/pages/ReportDetailPage"));
const ScoringPage = lazy(() => import("@/pages/ScoringPage"));
const PlayersPage = lazy(() => import("@/pages/PlayersPage"));
const RaidWeeksPage = lazy(() => import("@/pages/RaidWeeksPage"));
const PlayerScoringPage = lazy(() => import("@/pages/PlayerScoringPage"));
const WclCallbackPage = lazy(() => import("@/pages/WclCallbackPage"));
const PenaltyEventsPage = lazy(() => import("@/pages/PenaltyEventsPage"));
const GuildsPage = lazy(() => import("@/pages/GuildsPage"));
const AuditLogPage = lazy(() => import("@/pages/AuditLogPage"));
const CharacterDetailsPage = lazy(() => import("@/pages/CharacterDetailsPage"));

const RootRedirect: Component = () => {
  const nav = useNavigate();
  nav("/login");
  return null;
};

const LoginShell: Component = () => (
  <div class="flex flex-col h-screen bg-void-900 overflow-hidden">
    <TitleBar />
    <LoginPage />
  </div>
);

// Validate if the user is authenticated
const Guard: Component<{ children: any }> = (p) => {
  const nav = useNavigate();
  if (!authStore.isAuthenticated()) {
    nav("/login", { replace: true });
    return null;
  }
  return p.children;
};

// Restrict access to admin-only routes
const AdminGuard: Component<{ children: any }> = (p) => {
  const nav = useNavigate();
  if (authStore.user()?.role?.toLowerCase() !== "admin") {
    nav("/app/dashboard", { replace: true });
    return null;
  }
  return p.children;
};

const App: Component = () => (
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <Route path="/" component={RootRedirect} />
      <Route path={"/login"} component={LoginShell} />
      <Route path="/wcl-callback" component={WclCallbackPage} />
      <Route
        path="/app"
        component={(props) => (
          <Guard>
            <AppShell {...props} />
          </Guard>
        )}
      >
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/reports/:code" component={ReportDetailPage} />
        <Route path="/scoring" component={ScoringPage} />
        <Route path="/players" component={PlayersPage} />
        <Route path="/raid-weeks" component={RaidWeeksPage} />
        <Route path="/player-scoring/:weekId" component={PlayerScoringPage} />
        <Route path="/penalty-events" component={PenaltyEventsPage} />
        <Route path="/guilds" component={GuildsPage} />
        <Route path="/characters/:id" component={CharacterDetailsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route
          path="/audit-log"
          component={() => (
            <AdminGuard>
              <AuditLogPage />
            </AdminGuard>
          )}
        />
      </Route>
    </HashRouter>
    <UpdateNotification />
    <SolidQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
