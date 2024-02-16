import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Pie, PieChart, Sector } from 'recharts'
// eslint-disable-next-line
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.statusTitle}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey + (cos >= 0 ? 1 : -1) * 12}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${(percent * 100).toFixed()}%`}
      </text>
    </g>
  );
};

const CustomActiveShapePieChart = () => {
  const ordersStats = useSelector((state: RootState) => state.custdashboard.ordersStats)
  const [activeIndex, setActiveIndex] = useState(0);
  
  const onPieEnter = useCallback(
    // eslint-disable-next-line
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <PieChart width={600} height={400} >
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={ordersStats}
        cx={300}
        cy={200}
        innerRadius={100}
        outerRadius={140}
        fill="#4A7BD0"
        dataKey="quantity"
        onMouseEnter={onPieEnter}
      />
    </PieChart>
  );
};

export default CustomActiveShapePieChart