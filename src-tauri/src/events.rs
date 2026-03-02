#[taurpc::procedures(path = "events", event_trigger = AppEventTrigger, export_to = "../src/ipc/bindings.ts")]
pub trait AppEventsApi {
    // Fired when the WCL OAuth callback has been processed by the API server.
    // `success` is `true` when a token was stored, `false` on error.
    #[taurpc(event)]
    async fn wcl_auth_complete(success: bool);

    // Fired when the WCL OAuth window is closed by the user without completing auth.
    #[taurpc(event)]
    async fn wcl_auth_cancelled();
}
