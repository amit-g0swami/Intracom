"use client";

import * as React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../../../lib/utils';

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[];
  height?: number | string;
}

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#9333ea', '#0284c7'];

export function LineChart({ data, height = 300, className, ...props }: ChartProps & { dataKeyX?: string, dataKeyY?: string }) {
  const xKey = props.dataKeyX ?? (Object.keys(data[0] ?? {})[0]);
  const yKey = props.dataKeyY ?? (Object.keys(data[0] ?? {})[1]);

  return (
    <div className={cn('w-full', className)} style={{ height }} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey={xKey} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => String(value)} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#111827', fontWeight: 500 }}
          />
          <Line type="monotone" dataKey={yKey} stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({ data, height = 300, className, ...props }: ChartProps & { dataKeyX?: string, dataKeyY?: string }) {
  const xKey = props.dataKeyX ?? (Object.keys(data[0] ?? {})[0]);
  const yKey = props.dataKeyY ?? (Object.keys(data[0] ?? {})[1]);

  return (
    <div className={cn('w-full', className)} style={{ height }} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey={xKey} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey={yKey} fill="#2563eb" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChart({ data, height = 300, className, ...props }: ChartProps & { nameKey?: string, dataKey?: string }) {
  const nKey = props.nameKey ?? (Object.keys(data[0] ?? {})[0]);
  const vKey = props.dataKey ?? (Object.keys(data[0] ?? {})[1]);

  return (
    <div className={cn('w-full', className)} style={{ height }} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey={vKey}
            nameKey={nKey}
            stroke="none"
          >
            {data.map((_entry, index) => (
              // eslint-disable-next-line @typescript-eslint/no-deprecated
              <Cell key={`cell-${String(index)}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
