import { autobind } from 'core-decorators'
import { PureComponent } from 'react'
import { compose } from 'redux'
import { connectResource } from 'common/utils/resource'
import FormGroups from './FormGroups'


class FormGroupsContainer extends PureComponent {

  @autobind
  createGroup() {
    this.props.groups.setData(this.props.groups.data.concat({}))
  }

  @autobind
  handleChange(item={}, index, onError){
    console.log({item, index})
    const action = item.uuid ? this.props.groups.update : this.props.groups.create
    action(item, { requestPromise: true })
      .then(resp=>{
        this.props.groups.setData(this.props.groups.data.map((data, _index)=> _index === index ? resp : data))
      })
      .catch(onError)
  }

  @autobind
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
      <FormGroups
        {...this.props} 
        createGroup={this.createGroup}
        deleteGroup={this.deleteGroup}
        handleChange={this.handleChange}
      />
    )
  }
}

export default compose(
  connectResource({
    namespace: 'groups',
    endpoint: 'revenue-groups/:uuid?',
    idKey: 'uuid',
    refresh: false,
    list: true
  }),
)(FormGroupsContainer)
  