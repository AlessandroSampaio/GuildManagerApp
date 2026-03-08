import { HashRouter, Route, useNavigate } from "@solidjs/router";
import { QueryClientProvider } from "@tanstack/solid-query";
import { Component, lazy } from "solid-js";
import AppShell from "./components/layout/AppShell";
import TitleBar from "./components/layout/TitleBar";
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

const App: Component = () => (
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <Route path="/" component={RootRedirect} />
      <Route path={"/login"} component={LoginShell} />
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
        <Route path="/settings" component={SettingsPage} />
      </Route>
    </HashRouter>
    <SolidQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
