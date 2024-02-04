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

  const [newUserRequests, setNewUserRequests] = useState<CustomerRequest[]>([])
  const [newPasswordRequests, setNewPasswordRequests] = useState<CustomerRequest[]>([])

  const [newCustomerTitle, setNewCustomerTitle] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPassword, setNewCustomerPassword] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [newCustomerName, setNewCustomerName] = useState('')
  const [processingId, setProcessingId] = useState('')
  const [isChangePassword, setIsChangePassword] = useState(false)
  const [editingUserId, setEditingUserId] = useState('')

  useEffect(() => {
    const filteredNewUserRequests = requests.filter(request => request.type === 'newUser');
    setNewUserRequests(filteredNewUserRequests);
    const filteredNewPasswordRequests = requests.filter(request => request.type === 'newPassword');
    setNewPasswordRequests(filteredNewPasswordRequests);
  }, [requests]);

  const getNotificationIdByRequestId = (requestId: string) => {
    const notification = notifications.find(notify => notify.data?.requestId === requestId);
    console.log(notification)
    return notification?._id;
};

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

  // const handleChangePassword = (
  //   userId: string,
  //   title: string, 
  //   email: string, 
  //   contactName: string, 
  //   phone: string, 
  //   processingId: string ) => {
  //     setIsChangePassword(true);
  //     setNewCustomerTitle(title);
  //     setNewCustomerEmail(email);
  //     setNewCustomerPhone(phone);
  //     setNewCustomerName(contactName);
  //     setProcessingId(processingId);
  //     setEditingUserId(userId); 
  // }

  const addNewCustomer = async (e: React.FormEvent) => {
    
    e.preventDefault();
    console.log(processingId)
      const userData = { 
        title: newCustomerTitle, 
        email: newCustomerEmail, 
        contacts: [
          {
            contactName: newCustomerName, 
            contactPhone: newCustomerPhone, 
          }
        ],
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
        {newUserRequests.map(request => (
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
        {newPasswordRequests.map(request => (
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
        
        
      </div>
    </div>
  )
}

export default AdminRequests