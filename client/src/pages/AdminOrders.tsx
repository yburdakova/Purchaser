
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { adminRequest } from '../redux/apiCalls';
import { OrderData } from '../data/types';
import { addOrders } from '../redux/adminRedux';
import { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { OrderItem } from '../components';


const AdminOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const orders = useSelector((state: RootState) => state.admin.orders);
  const users = useSelector((state: RootState) => state.admin.users);

  const [filter, setFilter] = useState('Все заявки');
  const [searchedCustomer, setSearchedCustomer] = useState('')

  useEffect(() => {
    loadOrders()
  }, []);

  const filterOrders = () => {
    let filteredOrders = orders;
    if (filter !== 'Все заявки') {
      filteredOrders = filteredOrders.filter(order => order.status === filter);
    }

    if (searchedCustomer) {
      const matchedUserIds = users.filter(user => user.title && user.title.toLowerCase().includes(searchedCustomer.toLowerCase())).map(user => user._id);
      filteredOrders = filteredOrders.filter(order => matchedUserIds.includes(order.userId));
    }

    return filteredOrders;
  };


  const loadOrders = async () => {
    if (user?.isAdmin && user.accessToken) {
      adminRequest<OrderData[]>(dispatch, 'get','/orders', user?.accessToken, user?.isAdmin, addOrders)
    }
  };



  return (
    <div className='infopage'>
      <div className="statusButtonsBlock">
        <button onClick={()=> setFilter('Все заявки')} >Все заявки</button>
        <button onClick={()=> setFilter('На рассмотрении')} className='orangeButton'>На рассмотрении</button>
        <button onClick={()=> setFilter('Подтверждена')} className='violetButton'>Подтверждена</button>
        <button onClick={()=> setFilter('Оплачена')} className='purpleButton'>Оплачена</button>
        <button onClick={()=> setFilter('Выполнена')} className='greenButton'>Выполнена</button>
        <button onClick={()=> setFilter('Аннулирована')} className='redButton'>Аннулирована</button>
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
      <div className="flexList scrollWrapper">
      {filterOrders().map((order) => 
        <OrderItem order={order} key={order._id} reloadOrders={loadOrders}/>
      )}
      </div>
      
    </div>
  )
}

export default AdminOrders