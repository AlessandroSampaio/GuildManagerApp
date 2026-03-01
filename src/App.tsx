import { HashRouter, Route, useNavigate } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import "./index.css";

const LoginPage = lazy(() => import("@/pages/LoginPage"));

const RootRedirect: Component = () => {
  const nav = useNavigate();
  nav("/login");
  return null;
};

const App: Component = () => (
  <HashRouter>
    <Route path="/" component={RootRedirect} />
    <Route path={"/login"} component={LoginPage} />
  </HashRouter>
);

export default App;
