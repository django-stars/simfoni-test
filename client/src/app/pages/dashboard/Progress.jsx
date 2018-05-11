import { PureComponent } from 'react'
import { connect } from 'react-redux'
import CircularProgressbar from 'common/widgets/CircularProgressbar'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

class Progress extends PureComponent {
  render () {
    const { companies } = this.props
    const imported = companies.length
    const displayed = companies.filter(({ is_completed }) => !is_completed).length
    if (isEmpty(companies)) return null
    return (
      <div className='proggress' style={{minHeight: '160px'}}>
        <CircularProgressbar
          percentage={parseInt((imported - displayed) * 100 / imported, 10)}
          strokeWidth={10}
          initialAnimation
          radius={40}
        />
        {/*<span>Duplicate processed <b>{parseInt(displayed / imported * 100, 10)}%</b></span>*/}
      </div>
    )
  }
}

export default connect(({ resource }) => ({
  companies: get(resource, 'companies.data', [])
}))(Progress)
