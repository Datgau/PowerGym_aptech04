import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseData {
  category: string;
  amount: number;
  percentage: number;
}

interface ExpensesPieChartProps {
  data: ExpenseData[];
  colors: string[];
  formatCurrency: (amount: number) => string;
}

const ExpensesPieChart: React.FC<ExpensesPieChartProps> = ({ data, colors, formatCurrency }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" fontWeight={700} mb={3} color="primary">
          Expenses by Category
        </Typography>
        <Box sx={{ 
          width: '100%', 
          flex: 1,
          minHeight: '50vh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'center'
        }}>
          {/* Pie Chart */}
          <Box sx={{ flex: 1, height: '100%', minWidth: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={180}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ 
                    borderRadius: 8, 
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          
          {/* Legend */}
          <Box sx={{ 
            flex: 0.5,
            minWidth: 250,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            justifyContent: 'center'
          }}>
            {data.map((expense, index) => (
              <Box 
                key={index}
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                sx={{ 
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: '50%',
                      backgroundColor: colors[index % colors.length]
                    }} 
                  />
                  <Typography variant="body1" fontWeight={500} fontSize="1rem">
                    {expense.category}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {expense.percentage}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpensesPieChart;
