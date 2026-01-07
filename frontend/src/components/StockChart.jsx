import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function StockChart({ data }) {
  if (!data || data.length === 0) {
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
        No data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          formatter={(value, name) => {
            if (name === "pred_up") return value ? "Up" : "Down";
            if (name === "prob_up") return `${(value * 100).toFixed(1)}%`;
            return value;
          }}
        />
        <Line
          type="monotone"
          dataKey="close"
          name="Close"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="step"
          dataKey="pred_up"
          name="Pred Up"
          stroke="#f97316"
          strokeWidth={1.5}
          dot={false}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default StockChart;
