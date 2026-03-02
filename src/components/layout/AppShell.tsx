import Sidebar from "@/components/layout/Sidebar";
import TitleBar from "@/components/layout/TitleBar";
import { children, Component, ComponentProps } from "solid-js";

const AppShell: Component<ComponentProps<"div">> = (props) => {
  const resolved = children(() => props.children);

  return (
    <div class="flex flex-col h-screen bg-void-900 overflow-hidden">
      <TitleBar />
      <div class="flex flex-1 min-h-0">
        <Sidebar />
        <main class="flex-1 flex flex-col min-h-0 min-w-0">{resolved()}</main>
      </div>
    </div>
  );
};

export default AppShell;
