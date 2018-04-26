import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectResource } from '../utils/resources'
import { TabBarIcon } from '../common/widgets'
import Groups from './Groups'
import get from 'lodash/get'


class FormGroupsContainer extends PureComponent {
  constructor(props){
    super(props)
    this.createGroup = this.createGroup.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.deleteGroup = this.deleteGroup.bind(this)
  }

  createGroup() {
    this.props.groups.setData(this.props.groups.data.concat({}))
  }

  handleChange(item={}, index){
    const action = item.uuid ? this.props.groups.update : this.props.groups.create
    action(item, { requestPromise: true })
      .then(resp=>{
        this.props.groups.setData(this.props.groups.data.map((data, _index)=> _index === index ? resp : data))
      })
  }

  deleteGroup({ index, uuid }){
    if(!uuid) {
      return this.props.groups.setData(this.props.groups.data.filter((_, _index)=> _index !== index))
    }
    this.props.groups.remove({uuid}, { requestPromise: true })
      .then(_=>{
        this.props.groups.setData(this.props.groups.data.filter(item=> item.uuid !== uuid))
      })
  }

  render () {
    return (
      <Groups
        {...this.props} 
        createGroup={this.createGroup}
        deleteGroup={this.deleteGroup}
        handleChange={this.handleChange}
      />
    )
  }
}

const FormGroupsContainerConnected = compose(
  connectResource({
    namespace: 'groups',
    endpoint: 'revenue-groups/:uuid?',
    idKey: 'uuid',
    refresh: false,
    list: true
  }),
  connect(({ resource }) => ({upload: get(resource, 'upload.data', {})})),
)(FormGroupsContainer)

FormGroupsContainerConnected.navigationOptions = {
  tabBarIcon: TabBarIcon('groups')
}

export default FormGroupsContainerConnected
  