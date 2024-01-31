import React, { useState } from 'react'
import { CustomerData, CustomerRequest, UserData } from '../data/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { TbLockCog } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { addCustomerRequests, postDataSuccess } from '../redux/adminRedux';
import { deleteAdminData, getAdminData, postAdminData } from '../redux/apiCalls';
import { CustomInput } from '../components';
import { userRequest } from '../middleware/requestMethods';

const AdminRequests = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const requests = useSelector((state: RootState) => state.admin.customerRequests);
  const customers = useSelector((state: RootState) => state.admin.customers);
  const users = useSelector((state: RootState) => state.admin.users);
  const focusedId = useSelector((state: RootState) => state.admin.focusedId);

  const [newCustomerTitle, setNewCustomerTitle] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPassword, setNewCustomerPassword] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [newCustomerName, setNewCustomerName] = useState('')
  const [processingId, setProcessingId] = useState('')
  const [isChangePassword, setIsChangePassword] = useState(false)
  const [editingUserId, setEditingUserId] = useState('')
  
  const { passwordChangeRequests, newCustomerRequests } = requests.reduce((acc, request) => {
    const isExistingCustomer = customers.some(customer => customer.email === request.email);
    if (isExistingCustomer) {
      acc.passwordChangeRequests.push(request);
    } else {
      acc.newCustomerRequests.push(request);
    } return acc;
  }, { passwordChangeRequests: [] as CustomerRequest[], newCustomerRequests: [] as CustomerRequest[] });

  const handleDelete = (id:string) => {
    if (user?.isAdmin && user.accessToken) {
      deleteAdminData<CustomerRequest[]>(dispatch, '/requests', id, user?.accessToken, user?.isAdmin, postDataSuccess)
      getAdminData<CustomerRequest[]>(dispatch, '/requests', user.accessToken, user.isAdmin, addCustomerRequests);
    }
    
  }

  const handleAddCustomer = ( 
    id: string, 
    name: string, 
    phone: string, 
    email: string ) => {
      setIsChangePassword(false);
      setNewCustomerPhone(phone);
      setNewCustomerName(name);
      setNewCustomerEmail(email);
      setProcessingId(id);
  }

  const handleChangePassword = (
    userId: string,
    title: string, 
    email: string, 
    contactName: string, 
    phone: string, 
    processingId: string ) => {
      setIsChangePassword(true);
      setNewCustomerTitle(title);
      setNewCustomerEmail(email);
      setNewCustomerPhone(phone);
      setNewCustomerName(contactName);
      setProcessingId(processingId);
      setEditingUserId(userId); 
  }

  const addNewCustomer = async (e: React.FormEvent) => {
    
    e.preventDefault();
    console.log(processingId)
    if (isChangePassword) {
      const userData = { password: newCustomerPassword };
      const customerData = { contactName: newCustomerName, contactPhone: newCustomerPhone };
      try {
        await userRequest(user?.accessToken).put(`/users/change-password/${editingUserId}`, userData);
        const existingCustomer = customers.find(customer => customer.email === newCustomerEmail);
        if (existingCustomer && (existingCustomer.contactName !== newCustomerName || existingCustomer.contactPhone !== newCustomerPhone)) {
          await userRequest(user?.accessToken).put(`/customers/${existingCustomer._id}`, customerData);
        }
      } catch (error) {
        console.error('Failed to change password or update customer', error);
      }
    } else {
      const customerData = { title: newCustomerTitle, email: newCustomerEmail, contactName: newCustomerName, contactPhone: newCustomerPhone };
      const userData = { username: newCustomerTitle, email: newCustomerEmail, password: newCustomerPassword };
      try {
        if (user?.accessToken && user?.isAdmin){
          await postAdminData<CustomerData[], CustomerData>(dispatch, '/customers/add_customer', customerData, user.accessToken, user.isAdmin, postDataSuccess);
          await postAdminData<UserData[], UserData>(dispatch, '/auth/register', userData, user.accessToken, user.isAdmin, postDataSuccess);
        }
      } catch (error) {
        console.error('Failed to add new customer or user', error);
      }
    }

    setNewCustomerTitle('');
    setNewCustomerEmail('');
    setNewCustomerPhone('');
    setNewCustomerName('');
    setNewCustomerPassword('');
    handleDelete(processingId);
    setProcessingId('');
  }


  if ( requests.length == 0 ) {
    return (
      <div className='infopage'>
      <div className="">Запросов нет</div>
  </div>
    )
  }

  return (
    <div className='infopage'>
      <div>Запросы от новых клиентов</div>
      <div className="flexList">
        {newCustomerRequests.map(request => (
          <div key={request._id} className={focusedId === request._id? `flexListItem flexListItemFocused` : "flexListItem"}>
            <div>{request.email}</div>
            <div>{request.name}</div>
            <div>{request.phone}</div>
            <MdOutlineGroupAdd onClick={() => request._id && request.email && request.name && handleAddCustomer(request._id, request.name, request.phone, request.email)}/>
            <RiDeleteBin6Line 
                  className="deletePriceIcon" 
                  onClick={() => request._id && handleDelete(request._id)}
            />

          </div>
        ))}
      </div>
      <div>Запросы на смену пароля</div>
      <div className="flexList">
        {passwordChangeRequests.map((request) => {
          const client = users.find((customer) => customer.email === request.email)
          return (
            <div key={request._id} className={focusedId === request._id? `flexListItem flexListItemFocused` : "flexListItem"}>
              <div className="">Клиент: {client?.username}</div>
              <div> Контактное лицо: {request.name}</div>
              <div>{request.phone}</div>
              <TbLockCog 
                className="editPriceIcon" 
                onClick={() => client && client._id && client?.username && request.email && request.name && request._id && handleChangePassword(
                  client._id,
                  client?.username,
                  request.email, 
                  request.name,
                  request.phone,
                  request._id,
                )} 
              />
            </div>
        )})}
      </div>
      <div className="addForm">
        <form onSubmit={e => addNewCustomer(e)} className='newProductForm'>
          <CustomInput 
            label='Название клиента' 
            placeholder='Название клиента' 
            getValue={setNewCustomerTitle} 
            valueProps={newCustomerTitle}
            required 
            type='text'
            dark
          />
          <CustomInput 
            label='Email' 
            placeholder='Email' 
            getValue={setNewCustomerEmail}
            valueProps={newCustomerEmail} 
            type='email'
            required 
            dark
          />
          <CustomInput 
            type="password" 
            label="Пароль" 
            placeholder='Пароль' 
            required 
            dark
            valueProps={newCustomerPassword} 
            getValue={setNewCustomerPassword}
          />
          <CustomInput 
            label='Контактное лицо' 
            placeholder='Контактное лицо' 
            getValue={setNewCustomerName}
            valueProps={newCustomerName} 
            type='text'
            dark
          />
          <CustomInput 
            type="phone" 
            label="Номер телефона" 
            placeholder="Номер телефона" 
            isMask 
            required 
            dark
            valueProps={newCustomerPhone}
            getValue={setNewCustomerPhone}
          />
          <button className='newDataButton'>Добавить</button>
        </form>
      </div>
      <div className="addForm">
      </div>
    </div>
  )
}

export default AdminRequests