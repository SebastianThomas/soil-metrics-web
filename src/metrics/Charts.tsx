import { LineChart, BarChart,  Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function LChart({data}:any) {
    return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            width={400}
            height={200}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="data" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )
}



export function BChart({data} : any) {
  const customTickFormatter = (value:number) => {
    const labels = ["Barren", "Urban / Built-up","Croplands", "Grasslands", "Open Shrublands", ""];
    return labels[value];
  };
  return (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={400}
          height={200}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}

          
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis  tickFormatter={customTickFormatter} tickCount={6} // Ensures ticks are evenly spaced
        domain={[0, 5]} // Forces ticks between 0 and 5
        allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="category" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
  );
}

