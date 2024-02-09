
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, Tooltip,  ResponsiveContainer, LabelList } from 'recharts';
import { RootState } from '../redux/store';
import { ProductStatsItem } from '../data/types';

const ProductStatsBarChart = () => {

  const productStats = useSelector((state: RootState) => state.dashboard.productStats)

  return (
    <ResponsiveContainer width="40%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={productStats}
          barCategoryGap={10}
          margin={{
            top: 30,
            right: 20,
            left: 20,
            bottom: 0,
          }}
        >
        <XAxis padding={{ left: 2, right: 2 }} tickFormatter={(value) => value + 1}/>
        <Tooltip content={<CustomTooltip active payload={productStats} />} cursor={false}/>
        <Bar dataKey="quantity" fill="#33425c" activeBar={{ stroke: '#4A7BD0', strokeWidth: 2 }} radius={[10, 10, 0, 0]}>
          <LabelList dataKey="categoryTitle" position="top"/>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductStatsBarChart;

interface CustomPayload {
  active: boolean;
  payload: ProductStatsItem[];

}

const CustomTooltip: React.FC<CustomPayload> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{` ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};