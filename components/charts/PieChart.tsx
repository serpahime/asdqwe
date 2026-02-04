'use client';

import ChartWrapper from './ChartWrapper';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PieChartData {
  productName: string;
  revenue: number;
  [key: string]: any;
}

interface TopProductsPieChartProps {
  data: PieChartData[];
  locale: 'uk' | 'ru';
}

const COLORS = ['#00FFFF', '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];

export default function TopProductsPieChart({ data, locale }: TopProductsPieChartProps) {
  return (
    <ChartWrapper height="h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: { name?: string; percent?: number }) =>
              `${name || 'Unknown'}: ${((percent || 0) * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="revenue"
            nameKey="productName"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
            formatter={(value: number | undefined) =>
              value !== undefined
                ? [`${value} ₴`, locale === 'uk' ? 'Дохід' : 'Доход']
                : ['', '']
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
