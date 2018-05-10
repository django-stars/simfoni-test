import { PureComponent } from 'react'
import PropTypes from 'prop-types'

class CircularProgressbar extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    if (this.props.initialAnimation) {
      this.initialTimeout = setTimeout(() => {
        this.requestAnimationFrame = window.requestAnimationFrame(() => {
          this.setState({
            percentage: this.props.percentage
          })
        })
      }, 0)
    }
  }

  static getDerivedStateFromProps ({ percentage }, prevState) {
    return ({
      percentage: prevState.percentage === undefined ? 0 : percentage
    })
  }

  componentWillUnmount () {
    clearTimeout(this.initialTimeout)
    window.cancelAnimationFrame(this.requestAnimationFrame)
  }

  getPathDescription () {
    const { radius, strokeWidth} = this.props
    const r = radius - strokeWidth / 2
    const rotation = this.props.counterClockwise ? 1 : 0
    return `
      M ${radius},${radius}
      m 0,-${r}
      a ${r},${r} ${rotation} 1 1 0,${2 * r}
      a ${r},${r} ${rotation} 1 1 0,-${2 * r}
    `
  }

  getPathStyles () {
    const diameter = Math.PI * 2 * (this.props.radius - this.props.strokeWidth / 2)
    const truncatedPercentage = Math.min(Math.max(this.state.percentage, 0), 100)
    const dashoffset = ((100 - truncatedPercentage) / 100) * diameter
    return {
      strokeDasharray: `${diameter}px ${diameter}px`,
      strokeDashoffset: `${this.props.counterClockwise ? -dashoffset : dashoffset}px`
    }
  }

  render () {
    const { percentage, strokeWidth, radius } = this.props
    const pathDescription = this.getPathDescription()
    return (
      <div height={radius * 2} width={radius * 2}>
        <svg
          className='CircularProgressbar'
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          width={radius * 2}
          height={radius * 2}
          style={{
            minWidth: radius * 2,
            minHeight: radius * 2
          }}
        >
          <path
            d={pathDescription}
            strokeWidth={strokeWidth}
            fillOpacity={0}
            className='CircularProgressbar-trail'
          />
          <path
            d={pathDescription}
            strokeWidth={strokeWidth}
            fillOpacity={0}
            style={this.getPathStyles()}
            className='CircularProgressbar-path'
          />
          <text
            x={radius}
            y={radius}
            className='CircularProgressbar-text'
          >
            {parseInt(percentage, 10)}%
          </text>
        </svg>
      </div>
    )
  }
}

CircularProgressbar.propTypes = {
  percentage: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number,
  initialAnimation: PropTypes.bool,
  counterClockwise: PropTypes.bool
}

CircularProgressbar.defaultProps = {
  strokeWidth: 8,
  initialAnimation: false
}

export default CircularProgressbar
