import { Fragment } from 'react'
import isEmpty from 'lodash/isEmpty'
import EditableGroup from './EditableGroup'
import { Button } from 'reactstrap'

export default function FormGroups ({ groups: { data = [] }, handleChange, createGroup, deleteGroup }) {
  return (
    <div className='groups-container'>
      <div className='title-row'>
        <h4>Create Grouping</h4>
        <Button color='primary' onClick={createGroup}>+ Add Group</Button>
      </div>
      <div className='groups'>
        <div className='groups-header'>
          <span>#</span>
          <span>Range</span>
          <span>From</span>
          <span>Up to</span>
        </div>
        <ul>
          {isEmpty(data) && <li className='empty-groups'>Please upload data</li> }
          {data.map((item, index) => (
            <EditableGroup
              key={item.uuid || index}
              item={item}
              index={index}
              handleChange={handleChange}
              deleteGroup={deleteGroup}
            />))}
        </ul>
      </div>
    </div>
  )
}
