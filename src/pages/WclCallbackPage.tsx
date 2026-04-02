import { OAuthCallbackView } from "@/components/ui/OAuthCallbackView";
import { wclAuthIpc } from "@/ipc";
import { Component } from "solid-js";

const WclCallbackPage: Component = () => (
  <OAuthCallbackView
    serviceLabel="WarcraftLogs"
    onSuccess={() => wclAuthIpc.notify_auth_complete()}
  />
);

export default WclCallbackPage;
