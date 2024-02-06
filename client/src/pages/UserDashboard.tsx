import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CategoryData, NotificationData, ProductData } from '../data/types';
import { getAllUsersData, getAuthUsersData } from '../redux/apiCalls';
import { getNotifications } from '../redux/notificationRedux';

const UserDashboard = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const dispatch = useDispatch();
  
  const [productList, setProductList] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [allNotifications, setAllNotifications] = useState<NotificationData[]>([])
  const [userNotifications, setUserNotifications] = useState<NotificationData[]>([])

  useEffect(()=>{
    getAllUsersData("products", setProductList)
    getAllUsersData("categories", setCategories)
    getAllUsersData('notifications/user_notifications', setAllNotifications)
    user?.accessToken && getAuthUsersData(`notifications/user_notifications/${user?._id}`, user?.accessToken, setUserNotifications)

  }, [user, allNotifications]);

  useEffect(()=>{
    const combinedNotifications = [...allNotifications, ...userNotifications];
    dispatch(getNotifications(combinedNotifications))
  }, [dispatch, allNotifications, userNotifications]);

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