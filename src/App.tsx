import { HashRouter, Route, useNavigate } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import "./index.css";
import TitleBar from "./components/layout/TitleBar";
import { authStore } from "./stores/auth";
import AppShell from "./components/layout/AppShell";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));

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
  <HashRouter>
    <Route path="/" component={RootRedirect} />
    <Route path={"/login"} component={LoginShell} />
    <Route
      path="/app"
      component={() => (
        <Guard>
          <AppShell />
        </Guard>
      )}
    >
      <Route path="/dashboard" component={DashboardPage} />
    </Route>
  </HashRouter>
);

export default App;
