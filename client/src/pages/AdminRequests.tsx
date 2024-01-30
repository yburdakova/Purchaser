import React from 'react'
import { CustomerRequest } from '../data/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { TbLockCog } from 'react-icons/tb';

const AdminRequests = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const requests = useSelector((state: RootState) => state.admin.customerRequests);
  const customers = useSelector((state: RootState) => state.admin.customers);

  const { passwordChangeRequests, newCustomerRequests } = requests.reduce((acc, request) => {
    const isExistingCustomer = customers.some(customer => customer.email === request.email);
    if (isExistingCustomer) {
      acc.passwordChangeRequests.push(request);
    } else {
      acc.newCustomerRequests.push(request);
    } return acc;
  }, { passwordChangeRequests: [] as CustomerRequest[], newCustomerRequests: [] as CustomerRequest[] });


  const handleUpdatePasswordClick = (email: string) => {
    console.log(email)
  }

  return (
    <div className='infopage'>AdminRequests
      <div>Запросы от новых клиентов</div>
      {newCustomerRequests.map(request => (
        <div key={request._id} className="flex">
          <div>{request.name}</div>
          <div>{request.phone}</div>
        </div>
      ))}
      <div>Запросы на смену пароля</div>
      {passwordChangeRequests.map((request) => {
        const client = customers.find((customer) => customer.email === request.email)
        return (
          <div key={request._id} className="flex">
            <div className="">Клиент {client?.title}</div>
            <div>{request.name}</div>
            <div>{request.phone}</div>
            <TbLockCog 
              className="editPriceIcon" 
              onClick={() => request._id && handleUpdatePasswordClick(request.email)} 
            />
          </div>
        )})}
    </div>
  )
}

export default AdminRequests