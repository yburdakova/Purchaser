import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NotificationData, OrderData, ProductData } from '../data/types';
import { getAllUsersData, getAuthUsersData } from '../redux/apiCalls';
import { getNotifications } from '../redux/notificationRedux';
import axios from 'axios';
import { BASE_URL, userRequest } from '../middleware/requestMethods';
import { calculateOrdersStat, calculateProductStat, getOrders, getProducts } from '../redux/custDashboardRedux';
import { CustomActiveShapePieChart, ProductStatsBarChart } from '../components';

const UserDashboard = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const [productList, setProductList] = useState<ProductData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    getAllUsersData("products", setProductList);
    user?.accessToken && getAuthUsersData(`orders/find/${user?._id}`, user?.accessToken, setOrders)
}, []); 

useEffect(() => {
  dispatch(getProducts(productList));
  dispatch(calculateProductStat());
  dispatch(getOrders(orders));
  dispatch(calculateOrdersStat());
},[dispatch, productList, orders])

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


  return (
    <div className='outletContainer'>
      <div className="viewBox">
        <div className="dashboardPanel">
          <div className="widgetBox">
            <div className="">Всего продуктов в базе: {productList.length}, из них</div>
              <ProductStatsBarChart type="products"/>
            </div>
          <div className="widgetBox">
            <div className="">В вашей истории заявок: {orders.length} . Статистика статуса заявок: </div>
            <CustomActiveShapePieChart/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
