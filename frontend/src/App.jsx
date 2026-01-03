import { useState } from "react";
import TickerForm from "./components/TickerForm";
import StockChart from "./components/StockChart";
import PredictionTable from "./components/PredictionTable";

function App() {
  const [rows] = useState([]); // placeholder for backend rows
  const [metrics] = useState(null); // placeholder for backend metrics

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
        <TickerForm />
      </section>

      <section style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "8px" }}>Metrics</h2>
        <div style={{ color: "#475569" }}>
          {/* replace with metric cards once backend is wired */}
          {metrics ? "metrics go here" : "No metrics yet."}
        </div>
      </section>

      <section style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "8px" }}>Price Chart</h2>
        <div style={{ height: "320px", border: "1px dashed #cbd5e1" }}>
          <StockChart data={rows} />
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: "8px" }}>Predictions</h2>
        <PredictionTable rows={rows} loading={false} />
      </section>
    </div>
  );
}

export default App;
