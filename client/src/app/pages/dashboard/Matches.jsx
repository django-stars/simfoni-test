import { PureComponent, Fragment } from 'react'
import { Col, Button } from 'reactstrap'
import SortableTable, { BooleanColumn, Actions, Score } from 'common/widgets/SortableTable'
import Loader from 'react-loader-spinner'
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
    resizable: true,
    formatter: Score
  },
  {
     name: 'Order',
     key: 'correct_order',
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

  constructor(props){
    super(props)
    this.state = {
      loading: 0
    }
  }

  @autobind
  accept(companies=[]) {
    return (event) => {
      this.setState({loading: (event.target.className || '').includes('withloader') ? 1 : 0}, ()=>{
        this.props.currentMatch.update(companies.map(item=>({...item, is_accepted: true})), { multiple: true, endpoint: 'matches/:uuid?' })
          .then( _ => {
            this.setState({loading: 0})
            this.props.companies.fetch()
            this.props.matches.fetch().then(resp => {
              if(!resp || !resp.length) {
                this.props.navigate('root')
              }
            })
            .catch(error => {
              this.props.navigate('root')
            })
          })
      })
    }
  }

  @autobind
  decline(companies=[]) {
    return (event) => {
      this.setState({loading: (event.target.className || '').includes('withloader') ? -1 : 0}, ()=>{
        this.props.currentMatch.remove(companies, { multiple: true, endpoint: 'matches/:uuid?' })
          .then( _ => {
            this.setState({loading: 0})
            this.props.companies.fetch().then(comp => {
              if(comp.find(item=> item.uuid === this.props.match.params.uuid)) {
                this.props.matches.fetch()
              } else {
                this.props.navigate('root')
              }
            })
          })
      })
    }
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
            defaultSortKey="score"
          />
        </div>
        <footer>
          Apply changes to all matched companies <i className="material-icons">arrow_forward</i>
          <Button
            className="withloader"
            disabled={isEmpty(get(this.props, 'matches.data', [])) || !!this.state.loading}
            color="success" onClick={this.accept(get(this.props, 'matches.data', []))}
          >
            Accept All{this.state.loading === 1 && <Loader type='Oval' color='#fff' height='14' width='14' />}
          </Button>
          <Button
            className="withloader"
            disabled={isEmpty(get(this.props, 'matches.data', [])) || !!this.state.loading}
            color="danger" onClick={this.decline(get(this.props, 'matches.data', []))}
          >
            Decline All{this.state.loading === -1 && <Loader type='Oval' color='#fff' height='14' width='14' />}
          </Button>
        </footer>
      </div>
    )
  }
}

