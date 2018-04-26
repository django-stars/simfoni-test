import { PureComponent } from 'react'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import { connectResource } from '../utils/resources'
import { TabBarIcon } from '../common/widgets'
import UploadFile from './UploadFile'
import get from 'lodash/get'

function getFileType (uri) {
  const format = uri.split('.').pop()
  switch (format) {
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    case 'xls':
      return 'application/vnd.ms-excel'
    default:
      return undefined
  }
}

class UploadContainer extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      fileName: ''
    }
    this.selectFile = this.selectFile.bind(this)
  }

  selectFile () {
    this.props.upload.setErrors({})
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()]
    }, (error, res) => {
      if (res) {
        this.setState({ fileName: res.fileName })
        let file = {
          uri: res.uri,
          type: getFileType(res.uri),
          name: res.fileName,
          size: res.fileSize
        }
        this.props.upload.create(file)
      }
    })
  }

  render () {
    return (<UploadFile {...this.props} selectFile={this.selectFile} fileName={this.state.fileName} />)
  }
}

const UploadContainerResources = connectResource({
  namespace: 'upload',
  endpoint: 'revenue',
  refresh: false,
  prefetch: true
})(UploadContainer)

UploadContainerResources.navigationOptions = {
  tabBarIcon: TabBarIcon('upload')
}

export default UploadContainerResources
