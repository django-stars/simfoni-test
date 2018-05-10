import { Component } from 'react'
import { Link } from 'common/router'

export default class Header extends Component {
  render () {
    return (
      <header>
        <Link to='dashboard' className='app_logo' />
      </header>
    )
  }
}
