import { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { connectResource } from 'common/utils/resource'
import Matches from './Matches'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { navigate } from 'common/router'

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
        navigate={this.props.navigate}
      />
    )
  }
}

export default compose(
  withRouter,
  connect((state, props) => ({
    uuid: get(props, 'match.params.uuid')
  }), {
    navigate,
  }),
  connectResource({
    namespace: 'matches',
    endpoint: 'companies/:uuid?/matches',
    list: false,
    refresh: true,
  }),
  connectResource({
    namespace: 'currentMatch',
    endpoint: 'companies/:uuid?/matches',
    prefetch: false,
  }),
  connectResource({
    namespace: 'companies',
    endpoint: 'companies',
    prefetch: false,
    idKey: undefined
  })
)(MatchesContainer)
