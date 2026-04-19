import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const rotatingPhrases = [
  "clarity, not chaos.",
  "ownership that’s visible.",
  "tasks that actually move.",
  "chat that gets things done.",
  "alignment without meetings.",
  "progress, not busy work.",
];

export function AuthLayout() {
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [isPhraseVisible, setIsPhraseVisible] = useState(true);

  useEffect(() => {
    let timeoutId;

    const intervalId = window.setInterval(() => {
      setIsPhraseVisible(false);

      timeoutId = window.setTimeout(() => {
        setActivePhraseIndex(
          (currentIndex) => (currentIndex + 1) % rotatingPhrases.length,
        );
        setIsPhraseVisible(true);
      }, 220);
    }, 2400);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-copy">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <span className="brand-mark-dot brand-mark-dot-a" />
              <span className="brand-mark-dot brand-mark-dot-b" />
              <span className="brand-mark-dot brand-mark-dot-c" />
            </div>
            <div>
              <h1 className="brand-title">Syncora</h1>
            </div>
          </div>

          <div className="auth-message">
            <p className="auth-kicker">Project management software built for</p>
            <div className="dynamic-line" aria-live="polite">
              <span
                className={`dynamic-line-text ${isPhraseVisible ? "is-visible" : "is-hidden"}`}
              >
                {rotatingPhrases[activePhraseIndex]}
              </span>
            </div>
          </div>

          <div className="illustration-card" aria-hidden="true">
            <img
              className="auth-illustration"
              src="/auth-illustration.svg"
              alt=""
            />
          </div>

          <p className="auth-description">
            Manage projects, assign tasks, break work into subtasks, and keep
            everyone connected through team chat in one shared workspace.
          </p>
        </div>
        <div className="auth-card">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
