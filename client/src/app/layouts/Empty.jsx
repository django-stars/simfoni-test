import { connect } from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

function Empty ({ text }) {
  return (
    <div className='empty'>
      <h4>{text}</h4>
    </div>
  )
}

export default connect(({resource}) => ({
  text: isEmpty(get(resource, 'companies.data')) ? 'Please click "Start process" button' : 'please select company'
}))(Empty)
