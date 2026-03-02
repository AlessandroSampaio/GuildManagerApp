import { render } from "solid-js/web";
import App from "./App";
import { QueryClientProvider } from "@tanstack/solid-query";
import { queryClient } from "./lib";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");
render(
  () => (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
  root,
);
