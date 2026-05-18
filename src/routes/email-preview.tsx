import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { confirmationEmail, adminNotificationEmail } from "@/lib/email-templates";

export const Route = createFileRoute("/email-preview")({
  component: EmailPreview,
});

const SAMPLE = {
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "9876543210",
  program: "CPA",
  message: "I'm interested in the CPA program and would like to know more about the schedule and fees.",
};

function EmailPreview() {
  const [active, setActive] = useState<"confirmation" | "admin">("confirmation");

  const html =
    active === "confirmation"
      ? confirmationEmail(SAMPLE)
      : adminNotificationEmail(SAMPLE);

  return (
    <div style={{ fontFamily: "sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: "#1B3A6B", alignItems: "center" }}>
        <span style={{ color: "#C9A84C", fontWeight: 700, marginRight: 12 }}>Email Preview</span>
        {(["confirmation", "admin"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              background: active === t ? "#C9A84C" : "rgba(255,255,255,0.15)",
              color: active === t ? "#1B3A6B" : "#fff",
            }}
          >
            {t === "confirmation" ? "Confirmation (User)" : "Notification (Admin)"}
          </button>
        ))}
      </div>

      {/* Preview iframe */}
      <iframe
        srcDoc={html}
        style={{ flex: 1, border: "none", background: "#e8ecf4" }}
        title="Email Preview"
      />
    </div>
  );
}

