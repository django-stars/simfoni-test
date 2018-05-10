import { PureComponent, Fragment } from 'react'
import { Col, Button } from 'reactstrap'
import SortableTable, { BooleanColumn, Actions } from 'common/widgets/SortableTable'
import { autobind } from 'core-decorators'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const headers = [
  {
    name: 'Matched company',
    key: 'raw_company',
    sortable: true,
    resizable: true
  },
  {
    name: 'Score',
    key: 'score',
    sortable: true,
    resizable: true
  },
  {
     name: 'Order',
     key: 'is_accepted',
     sortable: true,
     formatter: BooleanColumn,
     resizable: true
  },
  {
     name: 'Action',
     key: 'actions',
     formatter: Actions,
     width: 290,
     resizable: true
  }
]

export default class Matches extends PureComponent {

  @autobind
  accept(companies=[]) {
    return () => this.props.matches.update(companies.map(item=>({...item, is_accepted: true})), { multiple: true, endpoint: 'matches/:uuid?' })
      .then( _ => {
        this.props.companies.fetch()
        this.props.matches.fetch()
      })
  }

  @autobind
  decline(companies=[]) {
    return () => this.props.matches.delete(companies, { multiple: true, endpoint: 'matches/:uuid?' })
      .then( _ => {
        this.props.companies.fetch()
        this.props.matches.fetch()
      })
  }


  render () {
    return (
      <div className='matches'>
        <div style={{maxWidth: '100%'}}>
          <SortableTable
            data={get(this.props, 'matches.data', []) || []}
            headers={headers}
            minHeight={(target) => target.innerHeight - 110}
            joinToName='actions'
            accept={this.accept}
            decline={this.decline}
          />
        </div>
        <footer>
          Apply changes to all matched companies <i className="material-icons">arrow_forward</i>
          <Button disabled={isEmpty(get(this.props, 'matches.data', []))} color="success" onClick={this.accept(get(this.props, 'matches.data', []))}>Accept All</Button>
          <Button disabled={isEmpty(get(this.props, 'matches.data', []))} color="danger" onClick={this.decline(get(this.props, 'matches.data', []))}>Decline All</Button>
        </footer>
      </div>
    )
  }
}

