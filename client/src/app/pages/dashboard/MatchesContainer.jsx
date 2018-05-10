import { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { connectResource } from 'common/utils/resource'
import Matches from './Matches'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

class MatchesContainer extends PureComponent {
  componentDidUpdate (prevProps) {
    if (get(this.props, 'match.params.uuid') !== get(prevProps, 'match.params.uuid')) {
      this.props.matches.fetch()
      return null
    }
  }
  render () {
    return (
      <Matches
        {...this.props}
      />
    )
  }
}

export default compose(
  withRouter,
  connect((state, props) => ({
    uuid: get(props, 'match.params.uuid')
  })),
  connectResource({
    namespace: 'matches',
    endpoint: 'companies/:uuid?/matches',
    prefetch: false,
    requestPromise: true,
    list: false
  }),
  connectResource({
    namespace: 'companies',
    endpoint: 'companies',
    prefetch: false,
    idKey: undefined
  })
)(MatchesContainer)
