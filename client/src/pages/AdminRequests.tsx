import React, { useEffect, useState } from 'react'
import { CustomerData, CustomerRequest, UserData } from '../data/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { TbLockCog } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { postDataSuccess } from '../redux/adminRedux';
import { postAdminData } from '../redux/apiCalls';

const AdminRequests = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const requests = useSelector((state: RootState) => state.admin.customerRequests);
  const customers = useSelector((state: RootState) => state.admin.customers);
  const focusedId = useSelector((state: RootState) => state.admin.focusedId);

  const [newCustomerTitle, setNewCustomerTitle] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPassword, setNewCustomerPassword] = useState('')
  const [isActiveItem, setIsActiveItem] = useState('')

  useEffect(() =>{
    
  },[focusedId, requests])

console.log(focusedId);

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

  const handleDelete = (id:string) => {
    console.log (id)
  }

  const handleAddCustomer = (id:string, name: string, phone: string) => {

    const customerData = {
      title: newCustomerTitle,
      email: newCustomerEmail,
      contactName: name,
      contactPhone: phone,
    }

    const userData ={
      username: newCustomerTitle,
      email: newCustomerEmail,
      password: newCustomerPassword
    }

    if (user?.isAdmin && user.accessToken) {
      postAdminData<CustomerData[], CustomerData>(dispatch, '/customers/add_customer', customerData, user?.accessToken, user?.isAdmin, postDataSuccess)
      postAdminData<UserData[], UserData>(dispatch, '/auth/register', userData, user?.accessToken, user?.isAdmin, postDataSuccess)
    }
  }

  return (
    <div className='infopage'>
      <div>Запросы от новых клиентов</div>
      {newCustomerRequests.map(request => (
        <div key={request._id} className={focusedId === request._id? `flexListItem flexListItemFocused` : "flexListItem"}>
          <div>{request.name}</div>
          <div className="">{request._id}</div>
          <div>{request.phone}</div>
          <MdOutlineGroupAdd onClick={() => request._id && handleAddCustomer( request._id, request.name, request.phone)}/>
          <RiDeleteBin6Line onClick={() => request._id && handleDelete(request._id)}
          />
        </div>
      ))}
      <div>Запросы на смену пароля</div>
      {passwordChangeRequests.map((request) => {
        const client = customers.find((customer) => customer.email === request.email)
        return (
          <div key={request._id} className={focusedId === request._id? `flexListItem flexListItemFocused` : "flexListItem"}>
            <div className="">Клиент: {client?.title}</div>
            <div> Контактное лицо: {request.name}</div>
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