import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { UserData } from "../data/types";
import { useEffect, useState } from "react";
import { CustomInput, CustomerItem } from "../components";
import { PiWarningCircleBold } from "react-icons/pi";
import { addUsers, postDataSuccess } from "../redux/adminRedux";
import { adminRequest } from "../redux/apiCalls";
import { IoSearch } from "react-icons/io5";

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
  const [searchedCustomer, setSearchedCustomer] = useState('')
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    const filteredUsers = users.filter(user => !user.isAdmin);
    setCustomers(filteredUsers);
  }, [users]);


  useEffect(() => {
    let filteredCustomers = users.filter(user => !user.isAdmin);
    if (searchedCustomer) {
      filteredCustomers = filteredCustomers.filter(customer => customer.title && customer.title.toLowerCase().includes(searchedCustomer.toLowerCase()));
    }
    setCustomers(filteredCustomers);
  }, [searchedCustomer, users]);

  const loadCustomers = async () => {
    if (user?.isAdmin && user.accessToken) {
      adminRequest<UserData[]>(dispatch, 'get','/users', user?.accessToken, user?.isAdmin, addUsers)
    }
  };

  const addNewCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    const existingProduct = users.find(users => users.email === newCustomerEmail);
    if (existingProduct) {
      setErrorMessage('Такой клиент уже существует');
      return;
    }

    const newUserData = { 
      title: newCustomerTitle, 
      email: newCustomerEmail, 
      contacts: [{
        contactName: newCustomerName, 
        contactPhone: newCustomerPhone, 
      }],
      password: newCustomerPassword, 
    };
    console.log ('Отправляемые данные:', newUserData)
    if (user?.isAdmin && user.accessToken) {
      await adminRequest<UserData[], UserData>(dispatch,  "post", '/auth/register', user.accessToken, user.isAdmin, postDataSuccess, newUserData)
        .then (()=> {loadCustomers()})
    }
    setNewCustomerTitle('')
    setNewCustomerEmail('')
    setNewCustomerPhone('')
    setNewCustomerName('')
    setNewCustomerPassword('')
    
  }

  return (
    <div className='outletContainer'>
      <div className="viewBox">
        <div className="addForm bottom-space">
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
        <div className="toolBox">
          <div className="toolBlock">
            <div className="toolBlockTitle">Быстрый поиск по названию клиента</div>
            <input 
              value={searchedCustomer}
              onChange={(e) => setSearchedCustomer(e.target.value)}  
              className='searchInput'
            />
            <IoSearch className='searchIcon'/>
          </div>
      </div>
          <div className="gridTable">
            <div className="gridHeader tableCustomer">
              <div className="headerCell">Дата регистрации</div>
              <div className="headerCell">Название</div>
              <div className="headerCell">Email</div>
              <div className="headerCell">Контактное имя</div>
              <div className="headerCell">Телефон</div>
              <div className="headerCell centerCell newPriceAnchor">Статус</div>
              <div className="headerCell iconColumn">Действия</div>
            </div>
            <div className="scrollWrapper admCustomersHeight">
              <div className="gridBody tableCustomer">
                {customers.map((customer) => 
                  <CustomerItem customer={customer} key={customer._id} reloadCustomers={loadCustomers}/>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
