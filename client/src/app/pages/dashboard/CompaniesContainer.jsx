import { PureComponent } from 'react'
import { compose } from 'redux'
import { connectResource } from 'common/utils/resource'
import Companies from './Companies'
import get from 'lodash/get'

class CompaniesContainer extends PureComponent {
  render () {
    return (
      <Companies
        {...this.props}
      />
    )
  }
}

export default compose(
  connectResource({
    namespace: 'companies',
    endpoint: 'companies',
    prefetch: true
  })
)(CompaniesContainer)
