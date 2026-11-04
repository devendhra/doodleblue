// src/components/ConfirmDialog.jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function ConfirmDialog({
  open,
  title,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  busy = false,
  onConfirm,
  onClose,
  children,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.querySelector("button")?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-[480px] rounded-3xl border border-gray-200 bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m-0 font-heading text-xl font-black text-gray-900">{title}</h2>
        <div className="mt-3 text-sm leading-relaxed text-gray-600 font-medium">
          {children}
        </div>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="min-h-[48px] rounded-2xl border border-gray-300 bg-white px-6 text-xs font-black uppercase tracking-wider text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`min-h-[48px] rounded-2xl px-6 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:brightness-110 disabled:opacity-50 ${
              danger ? "bg-danger-600 shadow-danger-600/30" : "bg-accent-600 shadow-accent-600/30"
            }`}
          >
            {busy ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmDialog;