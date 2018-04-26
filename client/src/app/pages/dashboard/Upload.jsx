import { FileInputField } from 'common/forms/fields'
import { Collapse } from 'reactstrap'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

export default function Upload ({ handleSubmit, upload }) {
  const { min = 0, max = 0, skipped = 0, imported = 0 } = get(upload, 'data', {}) || {}
  return (
    <form className='upload-container' onSubmit={handleSubmit}>
      <FileInputField name='file' fieldLabel='Upload files' />
      <Collapse isOpen={!isEmpty(upload.data)}>
        <div className='file-info'>
          <div className='title-row'>
            <h4>Data details</h4>
          </div>
          <div className='file-details'>
            <FileInfo
              name='Records'
              value={`${(imported - skipped).toLocaleString('en-IN')} of ${imported.toLocaleString('en-IN')}`}
            />
            <FileInfo
              name='Min'
              value={min.toLocaleString('en-IN')}
            />
            <FileInfo
              name='Max'
              value={max.toLocaleString('en-IN')}
            />
          </div>
        </div>
      </Collapse>
    </form>
  )
}

function FileInfo ({ value, name }) {
  return (
    <div className='file-info-item'>
      <h5>{value}</h5>
      <span>{name}</span>
    </div>
  )
}
