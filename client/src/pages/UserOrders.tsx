import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { NotificationData, OrderData } from "../data/types";
import { useEffect, useState } from "react";
import { getAuthUsersData } from "../redux/apiCalls";
import { OrderItem } from "../components";
import { BASE_URL, userRequest } from "../middleware/requestMethods";
import { getNotifications } from "../redux/notificationRedux";
import axios from "axios";

const UserOrders = () => {

  const user = useSelector((state: RootState) => state.user.currentUser);
  // const focusedId = useSelector((state: RootState) => state.notifications.focusedId);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filter, setFilter] = useState('Все заявки');
  const dispatch = useDispatch();
  
  useEffect(()=>{
    user?.accessToken && getAuthUsersData(`orders/find/${user?._id}`, user?.accessToken, setOrders)
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
        if (user?.accessToken) {
  
            const fetchAllNotifications = async () => {
                try {
                    const res = await axios.get<NotificationData[]>(`${BASE_URL}/notifications/user_notifications`);
                    return res.data;
                } catch (error) {
                    console.error(error);
                    return [];
                }
            };
  
            const fetchUserNotifications = async () => {
                try {
                    const res = await userRequest(user.accessToken).get<NotificationData[]>(`notifications/user_notifications/${user._id}`);
                    return res.data;
                } catch (error) {
                    console.error(error);
                    return [];
                }
            };
  
            const allNotifications = await fetchAllNotifications();
            const userNotifications = await fetchUserNotifications();
            dispatch(getNotifications([...allNotifications, ...userNotifications]));
        }
    };
    fetchNotifications();
  }, [user, dispatch]);

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
              <OrderItem order={order} key={order._id}/>
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default UserOrders

