import { PureComponent } from 'react'
import { compose } from 'redux'
import { connectResource } from 'common/utils/resource'
import { Link } from 'common/router'
import { Button } from 'reactstrap'
import { navigate } from 'common/router'
import { connect } from 'react-redux'
import CustomLoader from 'common/loader/Loader'
class Header extends PureComponent {
  flush() {
    this.props.flush.create({}).then(_ => {
      this.props.navigate('root')
      this.props.companies.fetch()
    })
  }
  render () {
    return (
      <header>
        <Link to='dashboard' className='app_logo' />
        <Button color="success" onClick={this.flush.bind(this)}>Clear all</Button>
        {this.props.flush.loading === 1 && <CustomLoader />}
      </header>
    )
  }
}

export default compose(
  connectResource({
    namespace: 'flush',
    endpoint: 'flush',
    prefetch: false,
  }),
  connectResource({
    namespace: 'companies',
    endpoint: 'companies',
    prefetch: false,
  }),
  connect(null, {
    navigate,
  })
)(Header)
