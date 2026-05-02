"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Handles errors thrown inside the root layout (e.g., provider failures).
// Must include <html> and <body> because it replaces the entire layout.
export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "32px",
            textAlign: "center",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>Algo deu muito errado</h2>
          <p style={{ margin: 0, color: "#666" }}>
            {error.message || "Erro inesperado ao carregar a aplicação."}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "8px 24px",
              cursor: "pointer",
              borderRadius: "4px",
              border: "1px solid #1976d2",
              color: "#1976d2",
              background: "transparent",
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
