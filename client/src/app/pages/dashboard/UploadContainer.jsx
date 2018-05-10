import { PureComponent } from 'react'
import { autobind } from 'core-decorators'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router'
import { connectFormResource, connectResource } from 'common/utils/resource'
import Upload from './Upload'
import get from 'lodash/get'


class UploadContainer extends PureComponent {

  @autobind
  onSubmit(params, dispatch) {
    return this.props.upload.create(params)
      .then((data)=>{
        this.props.companies.fetch()
        this.props.history.replace('/')
      })
  }

  render () {
    return (
      <Upload
        {...this.props}
        onSubmit={this.onSubmit}
      />
    )
  }
}

export default compose(
  connectFormResource({
    namespace: 'upload',
    endpoint: 'companies/upload',
    refresh: false,
    prefetch: false
  }, { form: 'upload' }),
  reduxForm({
    form: 'upload'
  }),
  withRouter,
  connectResource({
    namespace: 'companies',
    endpoint: 'companies',
    prefetch: false,
    idKey: undefined
  })
)(UploadContainer)
