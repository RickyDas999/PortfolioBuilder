import { useState } from "react";
import TickerForm from "./components/TickerForm";
import StockChart from "./components/StockChart";
import PredictionTable from "./components/PredictionTable";

function App() {
  const [rows, setRows] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async ({ ticker, period, model }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, period, model }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Request failed");
      }
      setRows(data.rows || []);
      setMetrics(data.metrics || null);
    } catch (err) {
      setError(err.message);
      setRows([]);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter','Helvetica','Arial',sans-serif",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <header style={{ marginBottom: "16px" }}>
        <h1 style={{ margin: 0 }}>Stock Study Buddy</h1>
        <p style={{ margin: "6px 0", color: "#475569" }}>
          Educational ML demo. Not financial advice.
        </p>
      </header>

      <section style={{ marginBottom: "16px" }}>
        <TickerForm loading={loading} onSubmit={handleAnalyze} />
      </section>

      {error && (
        <div style={{ color: "#b91c1c", marginBottom: "12px" }}>{error}</div>
      )}

      <section style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "8px" }}>Metrics</h2>
        {metrics ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
            }}
          >
            {[
              { label: "Accuracy", value: metrics.accuracy },
              { label: "Precision", value: metrics.precision },
              { label: "Recall", value: metrics.recall },
              { label: "F1", value: metrics.f1 },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  background: "#f8fafc",
                }}
              >
                <div style={{ color: "#64748b", fontSize: "13px" }}>
                  {m.label}
                </div>
                <div style={{ fontWeight: 700, fontSize: "18px" }}>
                  {m.value?.toFixed ? m.value.toFixed(2) : m.value}
                </div>
              </div>
            ))}
            <div
              style={{
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "#f8fafc",
              }}
            >
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                Confusion (tp/fp/tn/fn)
              </div>
              <div style={{ fontWeight: 600 }}>
                {metrics.tp}/{metrics.fp}/{metrics.tn}/{metrics.fn}
              </div>
              <div style={{ color: "#64748b", fontSize: "12px" }}>
                Test rows: {metrics.test_rows}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: "#475569" }}>No metrics yet.</div>
        )}
      </section>

      <section style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "8px" }}>Price Chart</h2>
        <div style={{ height: "320px", border: "1px dashed #cbd5e1" }}>
          <StockChart data={rows} />
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: "8px" }}>Predictions</h2>
        <PredictionTable rows={rows} loading={loading} />
      </section>
    </div>
  );
}

export default App;
