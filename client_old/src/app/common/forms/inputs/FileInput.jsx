import { PureComponent } from 'react'
import Dropzone from 'react-dropzone'
import { autobind } from 'core-decorators'

export default class FileInput extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      fileName: ''
    }
  }
  @autobind
  handleUpload(_, __, event ) {
    const files = event.nativeEvent.target.files
    this.setState({
      fileName: files[0].name
    });
    this.props.input.onChange(files[0])
  }

  render() {
    const { fileName } = this.state
    return (
      <label className='file-input-label'>
        <div className='title-row'>
          <h4>{this.props.fieldLabel}</h4>
          {fileName && <span>{fileName}</span>}
        </div>
        <Dropzone
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          maxSize={10485760}
          multiple={false}
          onDrop={this.handleUpload}
          style={{}}
          className="file-selector"
        >
           <button type='button'>Upload file</button>
        </Dropzone>
      </label>
    )
  }
}
