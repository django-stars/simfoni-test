import { Row } from 'reactstrap'
import UploadContainer from './UploadContainer'
import CompaniesContainer from './CompaniesContainer'

export default function Dashboard ({ children }) {
  return (
    <Row className='main'>
      <UploadContainer />
      <CompaniesContainer />
      { children }
    </Row>
  )
}
