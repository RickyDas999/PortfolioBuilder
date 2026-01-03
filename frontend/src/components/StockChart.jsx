function StockChart({ data }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
      }}
    >
      {data && data.length
        ? "Chart goes here (wire Recharts)"
        : "No data yet."}
    </div>
  );
}

export default StockChart;
