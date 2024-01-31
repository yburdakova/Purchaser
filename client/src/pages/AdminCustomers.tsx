import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CustomerData, CustomerRequest, NotificationData, UserData } from "../data/types";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { CustomInput } from "../components";
import { PiWarningCircleBold } from "react-icons/pi";
import { addCustomerRequests, getNotifications, postDataSuccess } from "../redux/adminRedux";
import { getAdminData, postAdminData } from "../redux/apiCalls";

const AdminCustomers = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const customers = useSelector((state: RootState) => state.admin.customers);

  const [newCustomerTitle, setNewCustomerTitle] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerPassword, setNewCustomerPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user?.isAdmin && user.accessToken) {
      getAdminData<CustomerRequest[]>(dispatch, '/requests', user.accessToken, user.isAdmin, addCustomerRequests);
      getAdminData<NotificationData[]>(dispatch, '/notifications/admin_notifications', user?.accessToken, user?.isAdmin, getNotifications)
    }
  }, [dispatch, user?.isAdmin, user?.accessToken]);

  const addNewCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    const existingProduct = customers.find(customer => customer.email === newCustomerEmail);
    if (existingProduct) {
      setErrorMessage('Такой клиент уже существует');
      return;
    }

    const customerData = {
      title: newCustomerTitle,
      email: newCustomerEmail,
      contactName: newCustomerName,
      contactPhone: newCustomerPhone,
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
    setNewCustomerTitle('')
    setNewCustomerEmail('')
    setNewCustomerPhone('')
    setNewCustomerName('')

  }

  const handeDeleteProduct = (id: string) => {
    console.log(id)
  }

  return (
    <div className='infopage'>
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
              getValue={setNewCustomerPhone}
            />
            <button className='newDataButton'>Добавить</button>
          </form>
          {errorMessage ? <div className="error-message"> <PiWarningCircleBold />{errorMessage}</div> : ' '}
        </div>
        <table className='purTable'>
          <thead>
            <tr>
              <th>Название</th>
              <th>Email</th>
              <th>Контактное лицо</th>
              <th>Телефон</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody className='tableBody'>
            {customers.map((customer) => {
              
              return (
                <tr className='rowTable' key={customer._id}>
                <td>{customer.title}</td>
                <td className='b'>{customer.email}</td>
                <td>{customer.contactName}</td>
                <td>{customer.contactPhone}</td>
                <td className='iconTableCell'>
                  
                  <FaRegEye />
                  <RiDeleteBin6Line 
                    className="deletePriceIcon" 
                    onClick={() => customer._id && handeDeleteProduct(customer._id)}/>
                </td>
            </tr>
              )

            })
          }

          </tbody>
      </table>
    </div>
  );
};

export default AdminCustomers;
