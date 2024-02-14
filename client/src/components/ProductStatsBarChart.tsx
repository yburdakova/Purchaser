import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, Tooltip,  ResponsiveContainer, LabelList } from 'recharts';
import { RootState } from '../redux/store';
import { OrderStatsItem, ProductStatsBarChartProps, ProductStatsItem } from '../data/types';
import { useEffect, useState } from 'react';

const ProductStatsBarChart: React.FC<ProductStatsBarChartProps> = ({ type }) => {

  const productStats = useSelector((state: RootState) => state.custdashboard.productStats)
  const ordersStats = useSelector((state: RootState) => state.custdashboard.ordersStats)

  const [data, setData] = useState<ProductStatsItem[] | OrderStatsItem[]>([]);
  const [dataKey, setDataKey] = useState("");

  useEffect(() => {
    switch (type) {
      case 'products':
        setData(productStats);
        setDataKey("categoryTitle")
        break;
      case 'orders':
        setData(ordersStats);
        setDataKey("statusTitle")
        break;
      default:
        console.log('Unknown data type');
    }
  }, [type, productStats, ordersStats]);

  return (
    <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={data}
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
          <LabelList dataKey={dataKey} position="top" fontSize={12}/>
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