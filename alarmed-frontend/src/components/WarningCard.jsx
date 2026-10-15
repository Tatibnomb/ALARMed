import { useState, useEffect } from "react";

const SEVERITY = {
  info: { icon: "ℹ️", label: "Información" },
  precaucion: { icon: "⚠️", label: "Precaución" },
  importante: { icon: "🟠", label: "Importante" },
  urgente: { icon: "🔴", label: "Urgente" },
};

function WarningCard({ warning }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY[warning.severity] || SEVERITY.precaucion;

  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Tarjeta compacta: una sola línea */}
      <div className={`warning-card warning-${warning.severity}`}>
        <span className="warning-icon">{sev.icon}</span>
        <span className="warning-title">{warning.title}</span>
        <button
          type="button"
          className="warning-toggle"
          onClick={() => setOpen(true)}
        >
          Ver más
        </button>
      </div>

      {/* Detalle completo en ventana flotante */}
      {open && (
        <div className="warning-overlay" onClick={() => setOpen(false)}>
          <div
            className={`warning-modal warning-${warning.severity}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="warning-modal-header">
              <div>
                <strong>
                  {sev.icon} {warning.title}
                </strong>
                <span className="warning-level">{sev.label}</span>
              </div>
              <button
                type="button"
                className="warning-close"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="warning-modal-body">
              {warning.medications?.length > 0 && (
                <p>
                  <strong>Medicamentos:</strong>{" "}
                  {warning.medications.join(" + ")}
                </p>
              )}
              <p>{warning.message}</p>
              <p>
                <strong>Recomendación:</strong> {warning.recommendation}
              </p>
              <p className="warning-meta">
                Nivel de evidencia: {warning.evidence_level}
                {warning.source ? ` · Fuente: ${warning.source}` : ""}
              </p>
              <p className="warning-meta">
                Información generada por IA. No reemplaza la consulta con tu
                médico o farmacéutico.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WarningCard;