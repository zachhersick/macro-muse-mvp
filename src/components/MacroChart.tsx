import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroChartProps {
  consumed: NutritionData;
  goals: NutritionData;
}

export function MacroChart({ consumed }: MacroChartProps) {
  const data = [
    {
      name: 'Protein',
      value: consumed.protein * 4, // 4 calories per gram
      color: 'hsl(var(--protein))',
      grams: consumed.protein
    },
    {
      name: 'Carbs',
      value: consumed.carbs * 4, // 4 calories per gram
      color: 'hsl(var(--carbs))',
      grams: consumed.carbs
    },
    {
      name: 'Fat',
      value: consumed.fat * 9, // 9 calories per gram
      color: 'hsl(var(--fat))',
      grams: consumed.fat
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold" style={{ color: data.color }}>
            {data.name}
          </p>
          <p className="text-sm">
            {data.grams}g ({Math.round(data.value)} cal)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value}: {data.find(d => d.name === value)?.grams}g
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}