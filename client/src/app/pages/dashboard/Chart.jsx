import { Button } from 'reactstrap'
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart
} from 'recharts'

const data = [{name: 'Page A', uv: 590, pv: 800, amt: 1400},
              {name: 'Page B', uv: 868, pv: 967, amt: 1506},
              {name: 'Page C', uv: 1397, pv: 1098, amt: 989},
              {name: 'Page D', uv: 1480, pv: 1200, amt: 1228},
              {name: 'Page E', uv: 1520, pv: 1108, amt: 1100},
              {name: 'Page F', uv: 1400, pv: 680, amt: 1700}]

export default function Chart ({ chart }) {
  return (
    <div className='chart-container'>
      <div className='header'>
        <h1>Distribution</h1>
        <Button onClick={() => chart.fetch()} color='secondary'>Update Chart</Button>
      </div>
      <div className='chart-wrapper'>
        <ResponsiveContainer width='100%' height='100%' minWidth={300} minHeight={300}>
          <BarChart
            margin={{top: 5, right: 10, left: 10, bottom: 5}}
            minHeight={250}
            minWidth={250}
            data={data}
          >
            <XAxis dataKey='name' />
            <YAxis
              dataKey='pv'
              tickFormatter={YAxisFormat}
            />
            <Tooltip />
            <CartesianGrid vertical={false} yAxisId='pv' stroke='#f5f5f5' />
            <Bar dataKey='pv' fill='#2196f3' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function YAxisFormat (tick) {
  return parseInt(tick, 10).toLocaleString('en-IN')
}
