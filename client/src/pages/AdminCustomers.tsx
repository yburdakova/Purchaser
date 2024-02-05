import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { UserData } from "../data/types";
import { useEffect, useState } from "react";
import { CustomInput, CustomerItem } from "../components";
import { PiWarningCircleBold } from "react-icons/pi";
import { postDataSuccess } from "../redux/adminRedux";
import { adminRequest } from "../redux/apiCalls";

const AdminCustomers = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const users = useSelector((state: RootState) => state.admin.users);

  const [customers, setCustomers] = useState<UserData[]>([])
  const [newCustomerTitle, setNewCustomerTitle] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerPassword, setNewCustomerPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const filteredUsers = users.filter(user => !user.isAdmin);
    setCustomers(filteredUsers);
  }, [users]);

  const addNewCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    const existingProduct = users.find(users => users.email === newCustomerEmail);
    if (existingProduct) {
      setErrorMessage('Такой клиент уже существует');
      return;
    }

    const userData = {
      title: newCustomerTitle,
      email: newCustomerEmail,
      password: newCustomerPassword,
      contactName: newCustomerName,
      contactPhone: newCustomerPhone,
    }

    if (user?.isAdmin && user.accessToken) {
      adminRequest<UserData[], UserData>(dispatch, 'post', '/auth/register', user?.accessToken, user?.isAdmin, postDataSuccess, userData)
    }
    setNewCustomerTitle('')
    setNewCustomerEmail('')
    setNewCustomerPhone('')
    setNewCustomerName('')

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
        <div className="gridTable">
          <div className="gridHeader tableCustomer">
            <div className="headerCell">Дата регистрации</div>
            <div className="headerCell">Название</div>
            <div className="headerCell">Email</div>
            <div className="headerCell">Контактное имя</div>
            <div className="headerCell">Контактный телефон</div>
            <div className="headerCell centerCell newPriceAnchor">Статус</div>
            <div className="headerCell iconColumn">Действия</div>
          </div>
          <div className="gridBodyWrapperAdmin">
            <div className="gridBody tableCustomer">
              {customers.map((customer) => 
                <CustomerItem customer={customer} key={customer._id}/>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
