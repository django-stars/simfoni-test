import { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { connectFormResource } from 'common/utils/resource'
import Upload from './Upload'
import get from 'lodash/get'

class UploadContainer extends PureComponent {
  render () {
    return (
      <Upload
        {...this.props}
      />
    )
  }
}

export default compose(
  connectFormResource({
    namespace: 'upload',
    endpoint: 'revenue',
    refresh: false,
    prefetch: false
  }, { form: 'upload' }),
  reduxForm({
    form: 'upload',
    onChange: (values, dispatch, props) => {
      if (!values.file) return
      props.onSubmit({file: values.file})
    }
  })
)(UploadContainer)
