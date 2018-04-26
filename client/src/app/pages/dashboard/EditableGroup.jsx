import { autobind } from 'core-decorators'
import { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { CurrencyInput, TextInput } from 'common/forms'
import { Button } from 'reactstrap'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import get from 'lodash/get'

export default class EditableGroup extends PureComponent {
  constructor (props) {
    super(props)
    const initial = isEmpty(props.item) ? { name: '' } : props.item
    this.state = {
      error: false,
      ...initial
    }
  }

  onChange (name, value) {
    this.setState({[name]: value})
  }

  @autobind
  validate() {
    const { name, revenue_from, revenue_to, uuid } = this.state
    if(name && ( revenue_from || revenue_to ) && !isEqual(this.state, this.props.item)) {
      this.props.handleChange(this.state, this.props.index, ()=>this.setState({ error: true }))
    }
  }

  @autobind
  deleteGroup(){
    const { index, item: { uuid }} = this.props
    this.props.deleteGroup({ index, uuid })
  }

  @autobind
  clearErrors(){
    this.setState({error: false})
  }

  render () {
    const { name, revenue_from, revenue_to, error } = this.state
    const { index, deleteGroup } = this.props
    return (
      <li className={`edit-row ${error ? 'error' : ''}`}>
        <div>{index+1}</div>
        <div>
          <TextInput
            onChange={this.onChange.bind(this, 'name')}
            value={name}
            onBlur={this.validate}
            onFocus={this.clearErrors}
          />
        </div>
        <div>
          <CurrencyInput
            onChange={this.onChange.bind(this, 'revenue_from')}
            value={revenue_from}
            onBlur={this.validate}
            onFocus={this.clearErrors}
          />
        </div>
        <div>
          <CurrencyInput
            onChange={this.onChange.bind(this, 'revenue_to')}
            value={revenue_to}
            onBlur={this.validate}
            onFocus={this.clearErrors}
          />
        </div>
        <Button color='primary' onClick={this.deleteGroup}>-</Button>
      </li>
    )
  }
}

EditableGroup.propTypes = {
  item: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    revenue_from: PropTypes.string,
    revenue_to: PropTypes.string,
  }),
  deleteGroup: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
}

EditableGroup.defaultProps = {
  item: {}
}

