import React from 'react';
import { Financials } from '../types';
// FIX: The TooltipProps type for custom tooltips, along with ValueType and NameType, should be imported from the main 'recharts' package, not a deep path.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps, ValueType, NameType } from 'recharts';

interface AnalysisChartProps {
  financials: Financials;
}

const formatCurrencyINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact', compactDisplay: 'short' }).format(value);
}

// FIX: The TooltipProps type from recharts requires generic arguments for value and name.
// Using ValueType and NameType imported from recharts resolves the typing issue for the custom tooltip's props.
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const fullFormat = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
    return (
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-lg">
        <p className="label font-bold text-white">{`Year ${label}`}</p>
        <p className="text-green-400">{`Revenue: ${fullFormat(payload[0].value as number)}`}</p>
        <p className="text-pink-400">{`Costs: ${fullFormat(payload[1].value as number)}`}</p>
         <p className="text-teal-400 mt-1 pt-1 border-t border-gray-600">{`Profit: ${fullFormat((payload[0].value as number) - (payload[1].value as number))}`}</p>
      </div>
    );
  }
  return null;
};


export const AnalysisChart: React.FC<AnalysisChartProps> = ({ financials }) => {
  const data = financials.projectedRevenue.map((rev, index) => ({
    year: index + 1,
    Revenue: rev,
    Costs: financials.projectedCosts[index],
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
        <XAxis dataKey="year" tick={{ fill: '#9CA3AF' }} stroke="#6B7280" />
        <YAxis tickFormatter={formatCurrencyINR} tick={{ fill: '#9CA3AF' }} stroke="#6B7280"/>
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(14, 165, 233, 0.1)'}}/>
        <Legend wrapperStyle={{ color: '#D1D5DB' }} />
        <Bar dataKey="Revenue" fill="#10B981" />
        <Bar dataKey="Costs" fill="#F472B6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
