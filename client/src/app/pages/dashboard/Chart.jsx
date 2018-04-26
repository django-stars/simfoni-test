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
import isEmpty from 'lodash/isEmpty'

export default function Chart ({ chart: { data = [], fetch } }) {
  return (
    <div className='chart-container'>
      <div className='header'>
        <h1>Distribution</h1>
        <Button onClick={() => fetch()} color='secondary'>Update Chart</Button>
      </div>
      <div className='chart-wrapper'>
        { !isEmpty(data) && (
        <ResponsiveContainer width='100%' height='100%' minWidth={300} minHeight={300}>
          <BarChart
            margin={{top: 5, right: 10, left: 10, bottom: 5}}
            minHeight={250}
            minWidth={250}
            data={data}
              >
            <XAxis dataKey='name' />
            <YAxis
              dataKey='value'
              tickFormatter={YAxisFormat}
                />
            <Tooltip />
            <CartesianGrid vertical={false} yAxisId='value' stroke='#f5f5f5' />
            <Bar dataKey='value' fill='#2196f3' />
          </BarChart>
        </ResponsiveContainer>
          )
        }
      </div>
    </div>
  )
}

function YAxisFormat (tick) {
  return parseInt(tick, 10).toLocaleString('en-IN')
}
