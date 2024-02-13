import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CategoryData, NotificationData, ProductData } from '../data/types';
import { getAllUsersData } from '../redux/apiCalls';
import { getNotifications } from '../redux/notificationRedux';
import axios from 'axios';
import { BASE_URL, userRequest } from '../middleware/requestMethods';

const UserDashboard = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const dispatch = useDispatch();
  
  const [productList, setProductList] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    getAllUsersData("products", setProductList);
    getAllUsersData("categories", setCategories);
}, []); 

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
    <div className='infopage'>
      UserDashboard
      <div className="">Продукты{productList.length}</div>
      <div className="">Уведомления {notifications.length}</div>
      <div className="">Категории{categories.length}</div>
    </div>
  )
}

export default UserDashboard