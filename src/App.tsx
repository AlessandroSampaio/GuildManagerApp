import { HashRouter, Route, useNavigate } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import "./index.css";
import TitleBar from "./components/layout/TitleBar";

const LoginPage = lazy(() => import("@/pages/LoginPage"));

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

const App: Component = () => (
  <HashRouter>
    <Route path="/" component={RootRedirect} />
    <Route path={"/login"} component={LoginShell} />
  </HashRouter>
);

export default App;
