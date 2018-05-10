import { Fragment } from 'react'
import { FileInputField } from 'common/forms/fields'
import { Col, Button } from 'reactstrap'
import Loader from 'react-loader-spinner'
import Progress from './Progress'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import CustomLoader from 'common/loader/Loader'

export default function Upload ({ handleSubmit, upload, pristine, submitting, onSubmit }) {
  const { min = 0, max = 0, skipped = 0, imported = 0 } = get(upload, 'data', {}) || {}
  return (
    <Col xs='1' className='sidebar'>
      {upload.loading === 1 && <CustomLoader />}
      <form className='upload-container' onSubmit={handleSubmit(onSubmit)}>
        <FileInputField name='file' fieldLabel='Data details' />
        <div className='file-info-pannnel'>
          {
            !pristine && <Button className='btn-bg' color='primary' disabled={submitting}>
              <span>Start process</span>
              {submitting && <Loader type='Oval' color='#1a98f8' height='19' width='19' />}
            </Button>
          }
          {
            !(isEmpty(get(upload, 'data'))) && (
              <Fragment>
                <InfoItem title='Total' value={get(upload, 'data.imported')} />
                <InfoItem title='Normalized' value={get(upload, 'data.normalized')} />
                <InfoItem title='Duplicate' value={get(upload, 'data.duplicate')} />
              </Fragment>
            )
          }
          <Progress />
        </div>
      </form>
    </Col>
  )
}

function InfoItem ({ title, value}) {
  return (
    <div className='info-item'>
      <h4>{title}</h4>
      <h3>{value}</h3>
    </div>
  )
}
