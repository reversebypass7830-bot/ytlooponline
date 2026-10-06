import { ArrowRight, Layers, MonitorPlay, Sparkles } from "lucide-react";

type VideoEditorMockupProps = {
  refined?: boolean;
};

export function VideoEditorMockup({ refined = false }: VideoEditorMockupProps) {
  return (
    <main className={`video-editor-mockup${refined ? " video-editor-mockup--refined" : ""}`}>
      <div className="video-editor-page">
        <div className="video-editor-page-head">
          <div className="video-editor-page-copy">
            <p className="eyebrow">Edit &amp; compose</p>
            <h1>Video editor</h1>
            <p className="subtle">
              Shape your clips, add layers, and prepare a polished composition for your next live channel.
            </p>
          </div>
          <div className="editor-head-actions">
            <button type="button" className="button editor-save-button">Save</button>
            <button type="button" className="button editor-preview-button" disabled>Preview</button>
            <button type="button" className="button editor-export-button" disabled>Export</button>
          </div>
        </div>

        <section className="editor-stage card">
          <div className="editor-stage-head">
            <div>
              <span className="metric-kicker">Live composition</span>
              <strong>Choose videos to preview</strong>
            </div>
            <span className="editor-stage-status">
              <span className="status-dot" />
              Preview
            </span>
          </div>

          <div className="editor-canvas editor-canvas-full">
            <div className="editor-empty">
              <img src="/__mockup/images/video-editor-empty-state.png" alt="" />
              <strong>Drag your videos to start editing</strong>
              <span>Choose a category, then add clips to build your composition.</span>
            </div>
            <div className="editor-canvas-toolbar">
              <div className="editor-canvas-zoom" aria-label="Preview zoom controls">
                <button type="button" aria-label="Zoom out">−</button>
                <span>100%</span>
                <button type="button" aria-label="Zoom in">+</button>
              </div>
              <button type="button" className="editor-canvas-button">Fullscreen</button>
            </div>
          </div>

          <div className="editor-preview-actions">
            <div>
              <strong>Select a video first</strong>
              <span>Choose a category and at least one server-ready video from the panel.</span>
            </div>
            <button type="button" className="button editor-expand-button" disabled>
              <MonitorPlay size={15} aria-hidden="true" />
              Open large preview &amp; edit
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="editor-stage-foot">
            <span><Layers size={13} aria-hidden="true" /> 0 clips selected · Long 16:9</span>
            <span><Sparkles size={13} aria-hidden="true" /> Logo, face cam, and effects follow the live signal</span>
          </div>
        </section>
      </div>
    </main>
  );
}
