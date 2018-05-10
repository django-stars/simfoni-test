import { Col } from 'reactstrap'
import SortableTable, { Company } from 'common/widgets/SortableTable'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const headers = [{
  name: 'Company names',
  key: 'name',
  formatter: Company,
  sortable: true,
  className: 'asd'
}]

export default function Companies ({ companies }) {
  if (isEmpty(get(companies, 'data', []))) {
    return <Col xs='2' />
  }
  return (
    <Col xs='2' className='companies'>
      <SortableTable
        data={get(companies, 'data', []) || []}
        headers={headers}
        minHeight={(target) => target.innerHeight - 60}
        joinToName='name'
      />
    </Col>
  )
}
