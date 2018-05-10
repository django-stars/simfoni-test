import { AppLayout } from 'layouts'
import ChartContainer from './ChartContainer'
import UploadContainer from './UploadContainer'
import FormGroupsContainer from './FormGroupsContainer'

export default function (props) {
  return (
    <AppLayout>
      <div className='form-container'>
        <UploadContainer />
        <FormGroupsContainer />
      </div>
      <ChartContainer />
    </AppLayout>
  )
}
