import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

const MonthlySalesBar = ({ data }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm">
    <h3 className="font-semibold mb-4">Monthly Sales</h3>

    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          fill="#4F46E5"
          barSize={22}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

MonthlySalesBar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
};

export default MonthlySalesBar;
