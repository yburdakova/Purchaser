import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TransformedDataItem } from '../data/types';

interface LineChartComponent {
  date: TransformedDataItem[]
}
const LineChartComponent: React.FC<LineChartComponent> = ({ date }) => {

  

  const stat = {
    opacity: {
      uv: 1,
      pv: 1,
    },
  }

  const { opacity } = stat;

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width={500}
          height={300}
          data={date}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >

          <XAxis />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" strokeOpacity={opacity.pv} stroke="#4A7BD0" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChartComponent