import { OAuthCallbackView } from "@/components/ui/OAuthCallbackView";
import { Component } from "solid-js";

/**
 * Callback do fluxo OAuth Battle.net.
 * O backend redireciona para esta rota após processar o code/state.
 * Sem onSuccess: a janela fecha naturalmente e o BNetOAuthCard
 * detecta o fechamento via listenWclAuthCancelled + refetch de status.
 */
const BNetCallbackPage: Component = () => (
  <OAuthCallbackView serviceLabel="Battle.net" />
);

export default BNetCallbackPage;
