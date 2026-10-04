import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ExternalLink, LifeBuoy, Link2 } from "lucide-react";
import {
  getGetOwnerSettingsQueryKey,
  useGetOwnerSettings,
  useUpdateOwnerSettings,
} from "@workspace/api-client-react";
import "./owner-users.css";

export interface OwnerSettingsPanelProps {
  ownerPassword: string;
}

export function OwnerSettingsPanel({ ownerPassword }: OwnerSettingsPanelProps) {
  const queryClient = useQueryClient();
  const request = useMemo(() => ({ headers: { "X-Owner-Password": ownerPassword } }), [ownerPassword]);
  const settingsQuery = useGetOwnerSettings({ request });
  const [supportLink, setSupportLink] = useState("");
  const [savedLink, setSavedLink] = useState("");
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (settingsQuery.data) {
      setSupportLink(settingsQuery.data.supportLink ?? "");
      setSavedLink(settingsQuery.data.supportLink ?? "");
    }
  }, [settingsQuery.data]);

  const updateSettings = useUpdateOwnerSettings({
    request,
    mutation: {
      onSuccess: async (result) => {
        setSupportLink(result.supportLink);
        setSavedLink(result.supportLink);
        await queryClient.invalidateQueries({ queryKey: getGetOwnerSettingsQueryKey() });
        setFeedback({ kind: "success", text: "Support link saved." });
      },
      onError: (error) => setFeedback({ kind: "error", text: error instanceof Error ? error.message : "Could not save support link." }),
    },
  });
  const normalized = supportLink.trim();
  const isDirty = normalized !== savedLink;
  const looksLikeHttpUrl = !normalized || /^https?:\/\/\S+$/i.test(normalized);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!looksLikeHttpUrl || updateSettings.isPending) return;
    setFeedback(null);
    updateSettings.mutate({ data: { supportLink: normalized } });
  };

  return <section className="owner-settings-panel" aria-labelledby="owner-settings-heading" data-testid="owner-settings-panel">
    <div className="owner-users-heading">
      <div>
        <div className="ou-kicker"><LifeBuoy size={14} aria-hidden="true"/> SUPPORT CONFIGURATION</div>
        <h2 id="owner-settings-heading">Support settings</h2>
        <p>Choose where users should go when they need help with account access.</p>
      </div>
      <div className="ou-setting-stamp"><Link2 size={16}/><span>OWNER<br/>SETTING</span></div>
    </div>
    {settingsQuery.isPending ? <div className="ou-settings-skeleton" aria-label="Loading support settings" data-testid="owner-settings-loading"><span/><span/><span/></div>
      : settingsQuery.isError ? <div className="ou-load-error" role="alert">
        <div><strong>Couldn’t load support settings</strong><span>{settingsQuery.error instanceof Error ? settingsQuery.error.message : "Check your connection and try again."}</span></div>
        <button className="ou-button quiet" type="button" onClick={() => void settingsQuery.refetch()} data-testid="retry-owner-settings">Try again</button>
      </div> : <form className="ou-support-form" onSubmit={submit} noValidate>
        <div className="ou-support-card">
          <div className="ou-support-icon"><LifeBuoy size={19}/></div>
          <div className="ou-support-copy"><strong>Support destination</strong><span>Enter a public page or contact form URL. Leave blank to remove the support link.</span></div>
          {normalized && looksLikeHttpUrl && <a className="ou-preview-link" href={normalized} target="_blank" rel="noreferrer" aria-label="Open support URL in a new tab" data-testid="owner-support-link-preview"><ExternalLink size={14}/> Preview</a>}
        </div>
        <label className="ou-support-label" htmlFor="owner-support-link">SUPPORT URL</label>
        <div className={`ou-url-input ${!looksLikeHttpUrl ? "invalid" : ""}`}>
          <Link2 size={16} aria-hidden="true"/>
          <input id="owner-support-link" type="url" inputMode="url" autoComplete="url" maxLength={2048} placeholder="https://help.example.com/contact" value={supportLink}
            onChange={(event) => { setSupportLink(event.target.value); setFeedback(null); }} aria-invalid={!looksLikeHttpUrl} aria-describedby="owner-support-help owner-support-error" data-testid="owner-support-link-input"/>
          <span>{supportLink.length}/2048</span>
        </div>
        <p id="owner-support-help" className="ou-support-help">Use a complete URL beginning with https://. Saving updates the support destination across the account experience.</p>
        {!looksLikeHttpUrl && <p id="owner-support-error" className="ou-inline-error" role="alert" data-testid="owner-support-link-error">Enter a valid http or https URL.</p>}
        {feedback && <div className={`ou-feedback ${feedback.kind}`} role={feedback.kind === "error" ? "alert" : "status"} data-testid="owner-settings-feedback">
          {feedback.kind === "success" && <Check size={15}/>}<span>{feedback.text}</span>
        </div>}
        <div className="ou-settings-foot">
          <span>{isDirty ? "Unsaved changes" : "All changes saved"}</span>
          <button className="ou-button primary" type="submit" disabled={!isDirty || !looksLikeHttpUrl || updateSettings.isPending} data-testid="owner-support-link-save">
            {updateSettings.isPending ? "Saving…" : "Save support URL"}
          </button>
        </div>
      </form>}
  </section>;
}
