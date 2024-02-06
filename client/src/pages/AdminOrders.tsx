import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const AdminOrders = () => {
  const orders = useSelector((state: RootState) => state.admin.orders);
  console.log(orders)
  return (
    <div className='infopage'>
      <div className="">AdminOrders</div>
    </div>
  )
}

export default AdminOrders