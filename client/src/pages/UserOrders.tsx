import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { OrderData } from "../data/types";
import { useEffect, useState } from "react";
import { getAuthUsersData } from "../redux/apiCalls";
import { OrderItem } from "../components";

const UserOrders = () => {

  const user = useSelector((state: RootState) => state.user.currentUser);
  // const focusedId = useSelector((state: RootState) => state.notifications.focusedId);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filter, setFilter] = useState('Все заявки');

  useEffect(()=>{
    user?.accessToken && getAuthUsersData(`orders/find/${user?._id}`, user?.accessToken, setOrders)
  }, [user]);

  const filterOrders = () => {
    let filteredOrders = orders;
    if (filter !== 'Все заявки') {
      filteredOrders = filteredOrders.filter(order => order.status === filter);
    }
    return filteredOrders;
  };

  return (
    <div className='outletContainer'>
      <div className="viewBox">
        <div className="toolBox">
          <div className="statusButtonsBlock">
            <button onClick={()=> setFilter('Все заявки')} >Все заявки</button>
            <button onClick={()=> setFilter('На рассмотрении')} className='orangeButton'>На рассмотрении</button>
            <button onClick={()=> setFilter('Подтверждена')} className='violetButton'>Подтверждена</button>
            <button onClick={()=> setFilter('Оплачена')} className='purpleButton'>Оплачена</button>
            <button onClick={()=> setFilter('Выполнена')} className='greenButton'>Выполнена</button>
            <button onClick={()=> setFilter('Аннулирована')} className='redButton'>Аннулирована</button>
          </div>
        </div>
        <div className="pageinfo">
          <div className="scrollWrapper customerOrderHeight">
          {filterOrders().map((order) => 
              <OrderItem order={order} key={order._id} />
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default UserOrders