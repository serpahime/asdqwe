'use client';

import ChartWrapper from './ChartWrapper';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LineChartData {
  date: string | number;
  revenue: number;
  orders: number;
}

interface RevenueLineChartProps {
  data: LineChartData[];
  locale: 'uk' | 'ru';
}

export default function RevenueLineChart({ data, locale }: RevenueLineChartProps) {
  const formatDate = (value: string | number) => {
    try {
      const date = typeof value === 'string' ? new Date(value) : new Date(value);
      return new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'ru-RU', {
        day: '2-digit',
        month: '2-digit',
      }).format(date);
    } catch {
      return String(value);
    }
  };

  return (
    <ChartWrapper height="h-[400px]">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            tickFormatter={formatDate}
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
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#00FFFF"
            strokeWidth={3}
            dot={{ fill: '#00FFFF', r: 5 }}
            name={locale === 'uk' ? 'Дохід' : 'Доход'}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', r: 4 }}
            name={locale === 'uk' ? 'Замовлення' : 'Заказы'}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
