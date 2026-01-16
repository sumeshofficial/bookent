import PropTypes from "prop-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesLineChart = ({ data }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex justify-between mb-4">
      <h3 className="font-semibold">Statistics</h3>
    </div>

    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data}>
        <XAxis dataKey="month" interval={0} tick={{ fontSize: 10 }} />
        <YAxis />
        <Tooltip />
        <Area
          type="linear"
          dataKey="sales"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.2}
        />
        <Area
          type="linear"
          dataKey="revenue"
          stroke="#93c5fd"
          fill="#93c5fd"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

SalesLineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      sales: PropTypes.number.isRequired,
      revenue: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SalesLineChart;