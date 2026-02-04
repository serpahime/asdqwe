'use client';

import ChartWrapper from './ChartWrapper';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BarChartData {
  productName: string;
  revenue: number;
  [key: string]: any;
}

interface RevenueBarChartProps {
  data: BarChartData[];
  locale: 'uk' | 'ru';
}

export default function RevenueBarChart({ data, locale }: RevenueBarChartProps) {
  return (
    <ChartWrapper height="h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="productName"
            stroke="#9CA3AF"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 10 }}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#9CA3AF' }}
            formatter={(value: number | undefined) =>
              value !== undefined
                ? [`${value} ₴`, locale === 'uk' ? 'Дохід' : 'Доход']
                : ['', '']
            }
          />
          <Bar dataKey="revenue" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
