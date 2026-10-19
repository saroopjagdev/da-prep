"use client";

/** Opens the browser's print dialog (which also offers Save as PDF). */
export default function PrintButton({ className = "btn btn-secondary", children = "Print or save as PDF" }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      {children}
    </button>
  );
}
