import React, { useEffect, useState } from 'react'
import { CustomerRequest, NotificationData, UserData } from '../data/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { TbLockCog } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { postDataSuccess } from '../redux/adminRedux';
import { getAdminData, postAdminData } from '../redux/apiCalls';
import { CustomInput } from '../components';
import { userRequest } from '../middleware/requestMethods';
import { getNotifications } from '../redux/notificationRedux';

const AdminRequests = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const requests = useSelector((state: RootState) => state.admin.customerRequests);
  const users = useSelector((state: RootState) => state.admin.users);
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const focusedId = useSelector((state: RootState) => state.notifications.focusedId);

  const [relevantReqests, setRelevantReqests] = useState<CustomerRequest[]>([])
  const [irrelevantReqests, setIrrelevantlReqests] = useState<CustomerRequest[]>([])
  const [newCustomerTitle, setNewCustomerTitle] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPassword, setNewCustomerPassword] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [newCustomerName, setNewCustomerName] = useState('')
  const [processingId, setProcessingId] = useState('')
  const [isChangePassword, setIsChangePassword] = useState(false)
  const [editingUserId, setEditingUserId] = useState('')

  useEffect(() => {
    setRelevantReqests(requests.filter(request => !request.isProcessed))
    setIrrelevantlReqests(requests.filter(request => request.isProcessed))
  },[requests])
  
  const getNotificationIdByRequestId = (requestId: string) => {
    const notification = notifications.find(notify => notify.data?.requestId === requestId);
    console.log(notification)
    return notification?._id;
};

  
  const { passwordChangeRequests, newCustomerRequests } = relevantReqests.reduce((acc, request) => {
    const isExistingCustomer = users.some(users => users.email === request.email);
    if (isExistingCustomer) {
      acc.passwordChangeRequests.push(request);
    } else {
      acc.newCustomerRequests.push(request);
    } return acc;
  }, { passwordChangeRequests: [] as CustomerRequest[], newCustomerRequests: [] as CustomerRequest[] });

  const handleDelete = async (id:string) => {
    const notificationId = getNotificationIdByRequestId(id);
    if (user?.isAdmin && user.accessToken) {
      await userRequest(user.accessToken).patch(`/requests/update_request/${id}`, {});
      await userRequest(user.accessToken).patch(`/notifications/update_notification/${notificationId}`, {});
      getAdminData<NotificationData[]>(dispatch, '/notifications/admin_notifications', user?.accessToken, user?.isAdmin, getNotifications)
    }
    
  }

  const handleAddCustomer = ( 
    id: string, 
    title: string,
    name: string, 
    phone: string, 
    email: string ) => {
      setIsChangePassword(false);
      setNewCustomerTitle(title);
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
        const existingCustomer = users.find(users => users.email === newCustomerEmail);
        if (existingCustomer && (existingCustomer.contactName !== newCustomerName || existingCustomer.contactPhone !== newCustomerPhone)) {
          await userRequest(user?.accessToken).put(`/customers/${existingCustomer._id}`, customerData);
        }
      } catch (error) {
        console.error('Failed to change password or update customer', error);
      }
    } else {
      const userData = { 
        title: newCustomerTitle, 
        email: newCustomerEmail, 
        contactName: newCustomerName, 
        contactPhone: newCustomerPhone, 
        password: newCustomerPassword, 
        isActive: true,
        isAdmin: false
      };
      try {
        if (user?.accessToken && user?.isAdmin){
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
            <div>{request.title}</div>
            <div>{request.email}</div>
            <div>{request.contactName}</div>
            <div>{request.contactPhone}</div>
            <MdOutlineGroupAdd onClick={() => handleAddCustomer(request._id, request.title, request.contactName, request.contactPhone, request.email)}/>
            <RiDeleteBin6Line 
                  className="deletePriceIcon" 
                  onClick={() => handleDelete(request._id)}
            />

          </div>
        ))}
      </div>
      <div>Запросы на смену пароля</div>
      <div className="flexList">
        {passwordChangeRequests.map((request) => {
          const customer = users.find((customer) => customer.email === request.email)
          return (
            <div key={request._id} className={focusedId === request._id? `flexListItem flexListItemFocused` : "flexListItem"}>
              <div className="">Клиент: {customer.title}</div>
              <div> Контактное лицо: {request.contactName}</div>
              <div>{request.contactPhone}</div>
              <TbLockCog 
                className="editPriceIcon" 
                onClick={() => customer && request && handleChangePassword(
                  customer._id,
                  customer.title,
                  request.email, 
                  request.contactName,
                  request.contactPhone,
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
      <div className="">Обработанные запросы</div>
      <div className="flexList">
        {irrelevantReqests.map(request => (
          <div key={request._id} className={focusedId === request._id? `flexListItem flexListItemFocused` : "flexListItem"}>
            <div>{request.email}</div>
            <div>{request.contactName}</div>
            <div>{request.contactPhone}</div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminRequests