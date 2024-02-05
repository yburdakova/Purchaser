import React, { useEffect, useState } from 'react'
import { CustomerRequest, NotificationData, UserData } from '../data/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { RiLockPasswordLine } from 'react-icons/ri';
import { MdOutlineDoNotDisturbOn, MdOutlineGroupAdd } from 'react-icons/md';
import { addCustomerRequests, postDataSuccess } from '../redux/adminRedux';
import { adminRequest } from '../redux/apiCalls';
import { CustomInput } from '../components';
import { getNotifications, setFocusedId } from '../redux/notificationRedux';
import { formatDate } from '../middleware/formatDate';

const AdminRequests = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const requests = useSelector((state: RootState) => state.admin.customerRequests);
  const focusedId = useSelector((state: RootState) => state.notifications.focusedId);

  const [newUserRequests, setNewUserRequests] = useState<CustomerRequest[]>([])
  const [newPasswordRequests, setNewPasswordRequests] = useState<CustomerRequest[]>([])
  const [closedRequests, setClosedRequests] = useState<CustomerRequest[]>([])

  const [newCustomerTitle, setNewCustomerTitle] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPassword, setNewCustomerPassword] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [newCustomerName, setNewCustomerName] = useState('')
  const [processingId, setProcessingId] = useState('')
  const [relatedId, setRelatedId] = useState('')


  const refreshData = () => {
    if (user?.isAdmin && user.accessToken) {
      adminRequest<CustomerRequest[]>(dispatch, 'get','/requests', user.accessToken, user.isAdmin, addCustomerRequests);
      adminRequest<NotificationData[]>(dispatch, 'get','/notifications/admin_notifications', user?.accessToken, user?.isAdmin, getNotifications)
    }
  }

  useEffect(() => {
    const filteredNewUserRequests = requests.filter(request => request.type === 'newUser');
    setNewUserRequests(filteredNewUserRequests);
    const filteredNewPasswordRequests = requests.filter(request => request.type === 'newPassword');
    setNewPasswordRequests(filteredNewPasswordRequests);
    const filteredClosedRequests = requests.filter(request => request.type === 'completed' || request.type === 'rejected' );
    setClosedRequests(filteredClosedRequests)
  }, [requests]);

  const handleReject = async (id: string) => {
    console.log(id)

    if (user?.isAdmin && user.accessToken) {
      await adminRequest<CustomerRequest, { type: string }>(
        dispatch,
        'patch',
        `/requests/update-request/${id}`,
        user.accessToken,
        user.isAdmin,
        postDataSuccess,
        { type: 'rejected' }
      );
    }
    dispatch(setFocusedId(''))
    refreshData()
  }

  const cleanContacts = (e: React.FormEvent) =>{
    e.preventDefault();
    setNewCustomerPhone("");
    setNewCustomerName("");
  }
  
  const handleProcessing = ( 
    title: string,
    name: string, 
    phone: string, 
    email: string,
    id: string,
    relatedId?: string
    ) => {
      if (relatedId) {
        setRelatedId(relatedId)
      }
      setProcessingId(id)
      setNewCustomerTitle(title);
      setNewCustomerPhone(phone);
      setNewCustomerName(name);
      setNewCustomerEmail(email);
      dispatch(setFocusedId(''))
  }


  const requetProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser =  requests.find(request => request._id === processingId)?.type === "newUser"

    const newUserData = { 
      title: newCustomerTitle, 
      email: newCustomerEmail, 
      contacts: [{
        contactName: newCustomerName, 
        contactPhone: newCustomerPhone, 
      }],
      password: newCustomerPassword, 
    };

    const updateUserData = newCustomerName && newCustomerPhone
    ? {
        contacts: [{
          contactName: newCustomerName, 
          contactPhone: newCustomerPhone, 
        }],
        password: newCustomerPassword, 
      }
    : {
        password: newCustomerPassword, 
      };

    try {
      if (user?.accessToken && user?.isAdmin) {
        newUser
        ? await adminRequest<UserData[], UserData>(dispatch,  "post", '/auth/register', user.accessToken, user.isAdmin, postDataSuccess, newUserData)
        : await adminRequest<UserData[], UserData>(dispatch,  "put", `/users/${relatedId}`, user.accessToken, user.isAdmin, postDataSuccess, updateUserData);
        await adminRequest<CustomerRequest, { type: string }>(dispatch, 'patch', `/requests/update-request/${processingId}`, user.accessToken, user.isAdmin, postDataSuccess, { type: 'completed' });
      }
      
    } catch (error) {
      console.error('Failed to add new customer or user', error);
    }
    
    setNewCustomerTitle('');
    setNewCustomerEmail('');
    setNewCustomerPhone('');
    setNewCustomerName('');
    setNewCustomerPassword('');
    setRelatedId("");
    setProcessingId("");
    dispatch(setFocusedId(''))
    refreshData()
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
      {newUserRequests.length > 0 &&
        <>
        <div>Запросы от новых клиентов</div>
        <div className="flexList">
          {newUserRequests.map(request => (
            <div key={request._id} className={focusedId === request._id? `flexListItem flexListItemFocused` : "flexListItem"}>
              <div>{request.title}</div>
              <div>{request.email}</div>
              <div>{request.contactName}</div>
              <div>{request.contactPhone}</div>
              <div data-tooltip="Добавить клиента" className="icon-button" >
                <MdOutlineGroupAdd 
                  onClick={() => handleProcessing(request.title, request.contactName, request.contactPhone, request.email, request._id)}
                  size={22}
                />
              </div>
              <div data-tooltip="Отклонить запрос" className="icon-button" >
                <MdOutlineDoNotDisturbOn 
                  className="deletePriceIcon" 
                  size={22}
                  onClick={() => handleReject(request._id)}
                />
              </div>
              
            </div>
          ))}
        </div>
        </>
      }
      {newUserRequests.length > 0 &&
        <>
        <div>Запросы на смену пароля</div>
        <div className="flexList">
          {newPasswordRequests.map(request => (
              <div key={request._id} className={focusedId === request._id? `flexListItem flexListItemFocused` : "flexListItem"}>
                <div>{request.title}</div>
                <div>{request.email}</div>
                <div>{request.contactName}</div>
                <div>{request.contactPhone}</div>
                <div data-tooltip="Обновить данные" className="icon-button" >
                  <RiLockPasswordLine 
                    onClick={() => handleProcessing(request.title, request.contactName, request.contactPhone, request.email, request._id, request.data?.relatedId)}
                    size={22}
                  />
                </div>
                <div data-tooltip="Отклонить запрос" className="icon-button" >
                  <MdOutlineDoNotDisturbOn 
                    className="deletePriceIcon" 
                    size={22}
                    onClick={() => handleReject(request._id)}
                  />
                </div>
              </div>
            ))}
        </div>
        </>
      }

      <div className="addForm">
        <form onSubmit={e => requetProcessing(e)} className='newProductForm'>
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
            dark
            valueProps={newCustomerPhone}
            getValue={setNewCustomerPhone}
          />
          <button className="newDataButton" onClick={(e) =>cleanContacts(e)}>Очистить контактные данные</button>
          <button className='newDataButton'>Добавить</button>
        </form>
      </div>
      <div className="">Обработанные запросы</div>
      <div className="flexList">
        {closedRequests.map(request => (
            <div key={request._id} className={focusedId === request._id? `flexListItem flexListItemFocused` : "flexListItem"}>
              <div className="">{formatDate(request.createdAt.toString())}</div>
              <div>{request.title}</div>
              <div>{request.email}</div>
              <div>{request.contactName}</div>
              <div>{request.contactPhone}</div>
              <div className={request.type == 'rejected' ? "red" : "green"}>{request.type == 'rejected' ? "Отклонён" : "Обработан"}</div>
            </div>
          ))}
        
      </div>
    </div>
  )
}

export default AdminRequests