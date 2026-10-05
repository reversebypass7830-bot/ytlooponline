import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ExternalLink, LifeBuoy, Link2, Radio, Wrench } from "lucide-react";
import {
  getGetOwnerSettingsQueryKey,
  useGetOwnerSettings,
  useUpdateOwnerSettings,
} from "@workspace/api-client-react";
import "./owner-users.css";

const defaultMaintenanceMessage = "We’re carrying out scheduled maintenance to improve your experience. Please check back soon.";
const defaultMaintenanceLinkLabel = "Get Updates";

export interface OwnerSettingsPanelProps {
  ownerPassword: string;
}

function isHttpUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function OwnerSettingsPanel({ ownerPassword }: OwnerSettingsPanelProps) {
  const queryClient = useQueryClient();
  const request = useMemo(() => ({ headers: { "X-Owner-Password": ownerPassword } }), [ownerPassword]);
  const settingsQuery = useGetOwnerSettings({ request });
  const [supportLink, setSupportLink] = useState("");
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [maintenanceLinkUrl, setMaintenanceLinkUrl] = useState("");
  const [maintenanceLinkLabel, setMaintenanceLinkLabel] = useState("");
  const [savedValues, setSavedValues] = useState({
    supportLink: "",
    maintenanceEnabled: false,
    maintenanceMessage: "",
    maintenanceLinkUrl: "",
    maintenanceLinkLabel: "",
  });
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!settingsQuery.data) return;
    const loaded = {
      supportLink: settingsQuery.data.supportLink ?? "",
      maintenanceEnabled: settingsQuery.data.maintenanceEnabled ?? false,
      maintenanceMessage: settingsQuery.data.maintenanceMessage ?? "",
      maintenanceLinkUrl: settingsQuery.data.maintenanceLinkUrl ?? "",
      maintenanceLinkLabel: settingsQuery.data.maintenanceLinkLabel ?? "",
    };
    setSupportLink(loaded.supportLink);
    setMaintenanceEnabled(loaded.maintenanceEnabled);
    setMaintenanceMessage(loaded.maintenanceMessage);
    setMaintenanceLinkUrl(loaded.maintenanceLinkUrl);
    setMaintenanceLinkLabel(loaded.maintenanceLinkLabel);
    setSavedValues(loaded);
  }, [settingsQuery.data]);

  const updateSettings = useUpdateOwnerSettings({
    request,
    mutation: {
      onSuccess: async (result) => {
        setSupportLink(result.supportLink);
        setMaintenanceEnabled(result.maintenanceEnabled);
        setMaintenanceMessage(result.maintenanceMessage);
        setMaintenanceLinkUrl(result.maintenanceLinkUrl);
        setMaintenanceLinkLabel(result.maintenanceLinkLabel);
        setSavedValues({
          supportLink: result.supportLink,
          maintenanceEnabled: result.maintenanceEnabled,
          maintenanceMessage: result.maintenanceMessage,
          maintenanceLinkUrl: result.maintenanceLinkUrl,
          maintenanceLinkLabel: result.maintenanceLinkLabel,
        });
        await queryClient.invalidateQueries({ queryKey: getGetOwnerSettingsQueryKey() });
        setFeedback({
          kind: "success",
          text: result.maintenanceEnabled
            ? "Settings saved. Maintenance mode is now on."
            : "Settings saved. Maintenance mode is off.",
        });
      },
      onError: (error) => setFeedback({ kind: "error", text: error instanceof Error ? error.message : "Could not save settings." }),
    },
  });

  const currentValues = {
    supportLink: supportLink.trim(),
    maintenanceEnabled,
    maintenanceMessage: maintenanceMessage.trim(),
    maintenanceLinkUrl: maintenanceLinkUrl.trim(),
    maintenanceLinkLabel: maintenanceLinkLabel.trim(),
  };
  const isDirty = Object.keys(currentValues).some((key) =>
    currentValues[key as keyof typeof currentValues] !== savedValues[key as keyof typeof savedValues]);
  const supportUrlValid = isHttpUrl(currentValues.supportLink);
  const maintenanceUrlValid = isHttpUrl(currentValues.maintenanceLinkUrl);
  const previewMessage = currentValues.maintenanceMessage || defaultMaintenanceMessage;
  const previewLinkLabel = currentValues.maintenanceLinkLabel || defaultMaintenanceLinkLabel;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!supportUrlValid || !maintenanceUrlValid || updateSettings.isPending) return;
    setFeedback(null);
    updateSettings.mutate({ data: currentValues });
  };

  return <section className="owner-settings-panel" aria-labelledby="owner-settings-heading" data-testid="owner-settings-panel">
    <div className="owner-users-heading">
      <div>
        <div className="ou-kicker"><LifeBuoy size={14} aria-hidden="true"/> SITE CONFIGURATION</div>
        <h2 id="owner-settings-heading">Site settings</h2>
        <p>Set the support destination and control the notice visitors see during maintenance.</p>
      </div>
      <div className="ou-setting-stamp"><Link2 size={16} aria-hidden="true"/><span>OWNER<br/>SETTING</span></div>
    </div>
    {settingsQuery.isPending ? <div className="ou-settings-skeleton" aria-label="Loading site settings" data-testid="owner-settings-loading"><span/><span/><span/></div>
      : settingsQuery.isError ? <div className="ou-load-error" role="alert">
        <div><strong>Couldn’t load site settings</strong><span>{settingsQuery.error instanceof Error ? settingsQuery.error.message : "Check your connection and try again."}</span></div>
        <button className="ou-button quiet" type="button" onClick={() => void settingsQuery.refetch()} data-testid="retry-owner-settings">Try again</button>
      </div> : <form className="ou-support-form ou-owner-settings-form" onSubmit={submit} noValidate>
        <section className="ou-settings-section" aria-labelledby="owner-support-heading">
          <div className="ou-support-card">
            <div className="ou-support-icon"><LifeBuoy size={19} aria-hidden="true"/></div>
            <div className="ou-support-copy"><strong id="owner-support-heading">Support destination</strong><span>Where users can go for help with account access.</span></div>
            {currentValues.supportLink && supportUrlValid && <a className="ou-preview-link" href={currentValues.supportLink} target="_blank" rel="noreferrer" aria-label="Open support URL in a new tab" data-testid="owner-support-link-preview"><ExternalLink size={14} aria-hidden="true"/> Preview</a>}
          </div>
          <label className="ou-support-label" htmlFor="owner-support-link">SUPPORT URL</label>
          <div className={`ou-url-input ${!supportUrlValid ? "invalid" : ""}`}>
            <Link2 size={16} aria-hidden="true"/>
            <input id="owner-support-link" type="url" inputMode="url" autoComplete="url" maxLength={2048} placeholder="https://help.example.com/contact" value={supportLink}
              onChange={(event) => { setSupportLink(event.target.value); setFeedback(null); }} aria-invalid={!supportUrlValid} aria-describedby="owner-support-help owner-support-error" data-testid="owner-support-link-input"/>
            <span>{supportLink.length}/2048</span>
          </div>
          <p id="owner-support-help" className="ou-support-help">Leave blank to remove the support link. Use a complete http:// or https:// URL.</p>
          {!supportUrlValid && <p id="owner-support-error" className="ou-inline-error" role="alert" data-testid="owner-support-link-error">Enter a valid http or https URL.</p>}
        </section>

        <section className="ou-maintenance-section" aria-labelledby="owner-maintenance-heading">
          <div className="ou-maintenance-head">
            <div className="ou-support-icon ou-maintenance-icon"><Wrench size={19} aria-hidden="true"/></div>
            <div className="ou-support-copy">
              <strong id="owner-maintenance-heading">Maintenance mode</strong>
              <span>Show a maintenance notice to visitors. The owner console remains available so you can switch it off.</span>
            </div>
          </div>
          <label className={`ou-maintenance-toggle ${maintenanceEnabled ? "is-on" : ""}`} htmlFor="owner-maintenance-toggle">
            <span className="ou-maintenance-toggle-copy">
              <strong>{maintenanceEnabled ? "Maintenance is on" : "Maintenance is off"}</strong>
              <small>{maintenanceEnabled ? "Visitors will see the notice after you save." : "Visitors can use the site normally."}</small>
            </span>
            <input id="owner-maintenance-toggle" type="checkbox" role="switch" checked={maintenanceEnabled}
              onChange={(event) => { setMaintenanceEnabled(event.target.checked); setFeedback(null); }}
              aria-label="Turn maintenance mode on or off" data-testid="owner-maintenance-toggle"/>
            <span className="ou-maintenance-switch-track" aria-hidden="true"><span/></span>
          </label>

          <div className="ou-maintenance-fields">
            <label className="ou-support-label" htmlFor="owner-maintenance-message">VISITOR MESSAGE</label>
            <textarea id="owner-maintenance-message" maxLength={500} rows={4} value={maintenanceMessage}
              placeholder="Leave blank to use the default maintenance message."
              onChange={(event) => { setMaintenanceMessage(event.target.value); setFeedback(null); }}
              aria-describedby="owner-maintenance-message-help" data-testid="owner-maintenance-message"/>
            <div className="ou-maintenance-input-meta">
              <p id="owner-maintenance-message-help" className="ou-support-help">Your message appears prominently. Leave it blank to show: “{defaultMaintenanceMessage}”</p>
              <span>{maintenanceMessage.length}/500</span>
            </div>
            <div className="ou-maintenance-link-fields">
              <div>
                <label className="ou-support-label" htmlFor="owner-maintenance-link-label">LINK LABEL</label>
                <input id="owner-maintenance-link-label" type="text" maxLength={60} placeholder="Get Updates" value={maintenanceLinkLabel}
                  onChange={(event) => { setMaintenanceLinkLabel(event.target.value); setFeedback(null); }} data-testid="owner-maintenance-link-label"/>
              </div>
              <div>
                <label className="ou-support-label" htmlFor="owner-maintenance-link-url">LINK URL (OPTIONAL)</label>
                <input id="owner-maintenance-link-url" className={!maintenanceUrlValid ? "ou-input-invalid" : ""} type="url" inputMode="url" maxLength={2048} placeholder="https://example.com/updates" value={maintenanceLinkUrl}
                  onChange={(event) => { setMaintenanceLinkUrl(event.target.value); setFeedback(null); }}
                  aria-invalid={!maintenanceUrlValid} aria-describedby="owner-maintenance-link-help owner-maintenance-link-error" data-testid="owner-maintenance-link-url"/>
                <p id="owner-maintenance-link-help" className="ou-support-help">When provided, the notice includes a link to this address.</p>
                {!maintenanceUrlValid && <p id="owner-maintenance-link-error" className="ou-inline-error" role="alert">Enter a valid http or https URL.</p>}
              </div>
            </div>
          </div>

          <div className="ou-maintenance-preview" aria-live="polite" data-testid="owner-maintenance-preview">
            <span className="ou-maintenance-preview-kicker"><Radio size={13} aria-hidden="true"/> VISITOR PREVIEW</span>
            <h3>We’ll be back soon</h3>
            <p>{previewMessage}</p>
            {currentValues.maintenanceLinkUrl && maintenanceUrlValid && <a href={currentValues.maintenanceLinkUrl} target="_blank" rel="noreferrer">
              {previewLinkLabel}<ExternalLink size={14} aria-hidden="true"/>
            </a>}
          </div>
        </section>

        {feedback && <div className={`ou-feedback ${feedback.kind}`} role={feedback.kind === "error" ? "alert" : "status"} data-testid="owner-settings-feedback">
          {feedback.kind === "success" && <Check size={15} aria-hidden="true"/>}<span>{feedback.text}</span>
        </div>}
        <div className="ou-settings-foot">
          <span>{isDirty ? "Unsaved changes" : "All changes saved"}</span>
          <button className="ou-button primary" type="submit" disabled={!isDirty || !supportUrlValid || !maintenanceUrlValid || updateSettings.isPending} data-testid="owner-settings-save">
            {updateSettings.isPending ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>}
  </section>;
}
