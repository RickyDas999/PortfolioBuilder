function TickerForm({ loading, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      ticker: formData.get("ticker") || "",
      period: formData.get("period") || "6mo",
      model: formData.get("model") || "logreg",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "10px",
        alignItems: "end",
      }}
    >
      <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
        Ticker
        <input
          style={{
            padding: "8px 10px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
          }}
          placeholder="AAPL"
          name="ticker"
          defaultValue="AAPL"
          required
        />
      </label>

      <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
        Period
        <select
          style={{
            padding: "8px 10px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
          }}
          defaultValue="6mo"
          name="period"
        >
          <option value="1mo">1 month</option>
          <option value="3mo">3 months</option>
          <option value="6mo">6 months</option>
          <option value="1y">1 year</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
        Model
        <select
          style={{
            padding: "8px 10px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
          }}
          defaultValue="logreg"
          name="model"
        >
          <option value="logreg">Logistic Regression</option>
          <option value="rf">Random Forest</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 14px",
          background: "#0ea5e9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  );
}

export default TickerForm;
