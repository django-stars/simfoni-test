import { Col } from 'reactstrap'
import SortableTable, { Company } from 'common/widgets/SortableTable'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import CustomLoader from 'common/loader/Loader'

const headers = [{
  name: 'Company names',
  key: 'name',
  formatter: Company,
  sortable: true,
  className: 'asd'
}]

export default function Companies ({ companies }) {
  if(companies.loading === 1){
    return <CustomLoader />
  }

  if(isEmpty(get(companies, 'data', []))) {
    return null
  }
  return (
    <Col xs='2' className='companies'>
    {companies.loading === 1 && <CustomLoader />}
      <SortableTable
        data={get(companies, 'data', []).filter(item => item.is_completed) || []}
        headers={headers}
        minHeight={(target) => target.innerHeight - 60}
        joinToName='name'
      />
    </Col>
  )
}
