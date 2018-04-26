import { connectResource } from '../utils/resources'
import Chart from './Chart'
import { TabBarIcon } from '../common/widgets'
import { compose } from 'redux'
import { connect } from 'react-redux'

class ChartContainer extends PureComponent {
  componentWillReceiveProps (nextProps) {
    if (this.props.nav.index !== nextProps.nav.index && this.props.nav.index === 2) {
      this.props.chart.fetch()
    }
  }
  render () {
    return (<Chart {...this.props} />)
  }
}

const ChartContainerConnected = compose(
  connectResource({
    namespace: 'chart',
    endpoint: 'revenue',
    prefetch: true
  }),
  connect(({nav}) => ({nav}))
)(ChartContainer)

ChartContainerConnected.navigationOptions = {
  tabBarIcon: TabBarIcon('chart')
}

export default ChartContainerConnected
