import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {  NotificationData, ProductData } from '../data/types';
import { getAllUsersData } from '../redux/apiCalls';
import { getNotifications } from '../redux/notificationRedux';
import axios from 'axios';
import { userRequest } from '../middleware/requestMethods';
import { calculateProductStat, getProducts } from '../redux/dashboardRedux';
import { ProductStatsBarChart } from '../components';

const UserDashboard = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  // const productStats = useSelector((state: RootState) => state.dashboard.productStats)
  const dispatch = useDispatch();
  const [productList, setProductList] = useState<ProductData[]>([]);


  useEffect(() => {
    getAllUsersData("products", setProductList);

}, []); 

  useEffect(() => {
    dispatch(getProducts(productList))
    dispatch(calculateProductStat());
  },[productList])

useEffect(() => {
  const fetchNotifications = async () => {
      if (user?.accessToken) {

          const fetchAllNotifications = async () => {
              try {
                  const res = await axios.get<NotificationData[]>(`http://localhost:5000/api/notifications/user_notifications`);
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
    <div className='infopage'>
      
      <div className="">На общую сумму: {notifications.length}</div>
      <div className="">В этом месяце: {notifications.length}</div>

      <div className="">Всего заявок: {productList.length}</div>
      <div className="">На общую сумму: {notifications.length}</div>
      <div className="">В этом месяце: {notifications.length}</div>
      <div className="wigetBox">
        <div className="">Всего продуктов в базе: {productList.length}</div>
        <ProductStatsBarChart />
      </div>

    </div>
  )
}

export default UserDashboard