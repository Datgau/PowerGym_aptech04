import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  formatCurrency: (amount: number) => string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, formatCurrency }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" fontWeight={700} mb={3} color="primary">
          Monthly Revenue & Expenses
        </Typography>
        <Box sx={{ width: '100%', flex: 1, minHeight: '400px', height: '500px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 13 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 13 }}
                stroke="#666"
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ 
                  borderRadius: 8, 
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '13px'
                }}
              />
              <Bar dataKey="revenue" fill="#00b4ff" radius={[8, 8, 0, 0]} name="Revenue" />
              <Bar dataKey="expenses" fill="#ff5026" radius={[8, 8, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
