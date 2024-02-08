import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RootState } from '../redux/store';

const ProductStatsBarChart = () => {

  const productStats = useSelector((state: RootState) => state.dashboard.productStats)
  return (
    <ResponsiveContainer width="40%" height={300}>
      <BarChart
        data={productStats}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="categoryTitle" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#4A7BD0" animationDuration={500} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductStatsBarChart;
