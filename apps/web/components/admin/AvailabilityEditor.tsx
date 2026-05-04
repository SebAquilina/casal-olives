"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ui/Toast";

interface Day { date: string; status: string; note: string | null; }

const STATUSES = ["open", "booked", "tentative", "blocked"] as const;

export function AvailabilityEditor({ initialDays }: { initialDays: Day[] }) {
  const router = useRouter();
  const [days, setDays] = useState<Day[]>(initialDays);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(date: string, status: string, note: string | null) {
    setBusy(true);
    const r = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date, status, note }),
    });
    setBusy(false);
    if (!r.ok) { showToast({ kind: "error", message: `Save failed: ${r.status}` }); return; }
    setDays((p) => p.map((d) => d.date === date ? { ...d, status, note } : d));
    setEditing(null);
    showToast({ kind: "success", message: `${date} → ${status}` });
    router.refresh();
  }

  return (
    <div className="availability-grid" style={{ marginTop: "var(--space-5)", gap: 6 }}>
      {days.map((d) => {
        const isEditing = editing === d.date;
        return (
          <div key={d.date} className={`availability-cell ${d.status}`} style={{ position: "relative", aspectRatio: "auto", padding: "0.6rem", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-ink-subtle)" }}>{d.date.slice(5)}</span>
            <span style={{ fontSize: "0.85rem", textTransform: "capitalize" }}>{d.status}</span>
            {!isEditing && (
              <button onClick={() => setEditing(d.date)} className="btn btn-sm btn-secondary" style={{ position: "absolute", inset: 0, opacity: 0, background: "transparent", border: "none" }}>
                edit
              </button>
            )}
            {isEditing && (
              <div style={{ position: "absolute", inset: -4, background: "var(--color-surface)", border: "2px solid var(--color-accent)", borderRadius: 4, padding: 4, display: "flex", flexDirection: "column", gap: 4, zIndex: 5 }}>
                <strong style={{ fontSize: "0.8rem" }}>{d.date}</strong>
                {STATUSES.map((s) => (
                  <button key={s} onClick={() => save(d.date, s, d.note)} disabled={busy} className={`btn btn-sm ${d.status === s ? "btn-primary" : "btn-secondary"}`} style={{ fontSize: "0.7rem", padding: "2px 4px" }}>
                    {s}
                  </button>
                ))}
                <button onClick={() => setEditing(null)} className="btn btn-sm btn-secondary" style={{ fontSize: "0.7rem", padding: "2px 4px" }}>cancel</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
