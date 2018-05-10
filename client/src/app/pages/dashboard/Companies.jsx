import { Col } from 'reactstrap'
import SortableTable, { Company } from 'common/widgets/SortableTable'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import Loader from 'react-loader-spinner'

const headers = [{
  name: 'Company names',
  key: 'name',
  formatter: Company,
  sortable: true
}]

export default function Companies ({ companies = {} }) {
  if (isEmpty(companies.data) && Array.isArray(companies.data) && companies.loading !== 1) {
    return null
  }
  return (
    <Col xs='2' className='companies'>
      <SortableTable
        data={(get(companies, 'data', []) || []).filter(item => item.is_completed)}
        headers={headers}
        minHeight={(target) => target.innerHeight - 60}
        joinToName='name'
        emptyRowsView={companies.loading === 1 ? () => <Loader type='Oval' color='#fff' height='50' width='50' /> : null}
    />
    </Col>
  )
}
