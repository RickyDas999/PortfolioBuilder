function PredictionTable({ rows, loading }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!rows || rows.length === 0) {
    return <div style={{ color: "#475569" }}>No results yet.</div>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "600px",
        }}
      >
        <thead>
          <tr style={{ textAlign: "left", background: "#f1f5f9" }}>
            {["Date", "Close", "Pred Up", "Prob Up", "Actual Up"].map((h) => (
              <th
                key={h}
                style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date}>
              <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}>
                {row.date}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}>
                {row.close}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}>
                {row.pred_up}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}>
                {row.prob_up}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}>
                {row.actual_up}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PredictionTable;
