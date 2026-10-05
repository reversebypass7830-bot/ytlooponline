import { ArrowUpRight } from "lucide-react";
import "./maintenance-screen.css";

export interface MaintenanceScreenProps {
  message: string;
  linkUrl: string;
  linkLabel: string;
}

export function MaintenanceScreen({ message, linkUrl, linkLabel }: MaintenanceScreenProps) {
  return <main className="maintenance-screen" data-testid="maintenance-screen">
    <section className="maintenance-screen-card" aria-labelledby="maintenance-screen-title">
      <div className="maintenance-screen-mark"><img src="/images/ytloop-logo.png" alt="YT Loop"/></div>
      <p className="maintenance-screen-status"><span aria-hidden="true"/> Maintenance in progress</p>
      <h1 id="maintenance-screen-title">We’ll be back soon</h1>
      <p className="maintenance-screen-message">{message}</p>
      {linkUrl && <a className="maintenance-screen-link" href={linkUrl} data-testid="maintenance-screen-link">
        {linkLabel || "Get Updates"}<ArrowUpRight size={17} aria-hidden="true"/>
      </a>}
      <p className="maintenance-screen-foot">Thanks for your patience while we make improvements.</p>
    </section>
  </main>;
}
