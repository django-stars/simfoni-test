import { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import { Table } from 'reactstrap'
import orderBy from 'lodash/orderBy'
import isEmpty from 'lodash/isEmpty'
import ReactDataGrid from 'react-data-grid'
import { NavLink } from 'common/router/Link'
import { autobind } from 'core-decorators'
import { Button } from 'reactstrap'

export default class SortableTable extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      minHeight: props.minHeight(window),
      sortedKey: '',
      sortedOrder: 'ASC'
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  static getDerivedStateFromProps ({ data = [] }, { sortedKey, sortedOrder } = {}) {
    return ({
      data: sortedOrder ? orderBy(data, sortedKey, sortedOrder.toLowerCase()) : data,
      sortedOrder,
      sortedKey
    })
  }

  @autobind
  handleSort(sortedKey, sortedOrder) {
    const { data } = this.props
    this.setState({
      data: sortedOrder === "NONE" ? data : orderBy(data, sortedKey, sortedOrder.toLowerCase()),
      sortedKey,
      sortedOrder: sortedOrder === "NONE" ? "" : sortedOrder
    })
  }

  @autobind
  handleWindowResize(event){
    const { minHeight } = this.props
    this.setState({
      minHeight: minHeight(event.target)
    })
  }

  @autobind
  rowGetter(i) {
    const { joinToName, data: _del, minHeight: _del1, headers: _dell3, ...rest  } = this.props
    const { data } = this.state
    if(joinToName) {
      return { ...data[i], [joinToName]: { data: data[i], props: rest } }
    }
    return data[i]
  }

  render () {
    const { headers } = this.props
    const { minHeight, data } = this.state
    return (
      <ReactDataGrid
        className="table"
        columns={headers}
        rowGetter={this.rowGetter}
        rowsCount={data.length}
        minHeight={minHeight}
        onGridSort={this.handleSort}
        headerRowHeight={25}
        rowHeight={50}
      />
    )
  }
}


export function Company ({ value: { data, props } }) {
  return (
    <NavLink to='matches' uuid={data.uuid} className="company-row">
      {data.name}
    </NavLink>
  )
}

export function BooleanColumn ({ value }) {
  return <div>{value ? 'True' : 'False'}</div>
}

export function Actions ({ value: { data, props } }) {
  return (
    <div className="actions">
      <Button color="success" onClick={props.accept([data])}>Accept</Button>
      <Button color="danger" onClick={props.decline([data])}>Decline</Button>
    </div>
  )
}
