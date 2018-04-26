import { autobind } from 'core-decorators'
import { Component } from 'react'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format'

const propTypes = {
  inputClassName: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
}
const defaultProps = {
  inputClassName: 'input-custom',
  onBlur: ()=>{}
}

export default class CurrencyInput extends Component {
  @autobind
  handleChange({ value }, e) {
    this.props.onChange(value)
  }
  render() {
    const { inputClassName, placeholder, required,
      disabled, name, value, onBlur, onFocus } = this.props
    return (
      <NumberFormat
        className={inputClassName}
        placeholder={placeholder}
        onValueChange={this.handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        required={required}
        disabled={disabled}
        name={name}
        value={value}
        thousandSeparator="'"
      />
    )
  }
}

CurrencyInput.propTypes = propTypes
CurrencyInput.defaultProps = defaultProps
