import { useEffect, useState } from 'react'
import { FaPowerOff } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import styles from './Header.module.css'

import { useDispatch, useSelector } from 'react-redux';
import { loginFinish } from '../../redux/userRedux';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuLinks, userMenuLinks } from '../../data/constants';
import { RootState } from '../../redux/store';
import { notificationTitles } from '../../data/constants';
import { NotificationData, NotificationType } from '../../data/types';
import { userRequest } from '../../middleware/requestMethods';
import { MdAssignment } from 'react-icons/md';
import { openOrder } from '../../redux/orderRedux';
import { getNotifications, setFocusedId } from '../../redux/notificationRedux';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.user.currentUser);
  const notifyQuantity = useSelector((state: RootState) => state.notifications.notifyCounter);
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const quantity = useSelector( ( state: RootState ) => state.order.quantity);  

  const [pageTitle, setPageTitle] = useState('Page Name');
  const [isNotify, setIsNotify] = useState(false);
  const [notifies, setNotifies] = useState <NotificationData[]>([])

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    const currentMenuItem = user?.isAdmin ? menuLinks.find(link => link.path === currentPath) : userMenuLinks.find(link => link.path === currentPath);
    setPageTitle(currentMenuItem ? currentMenuItem.title : 'Page Name');
  }, [location, user]);

  useEffect(() => {
    const filtredNotify = notifications.filter(notification => !notification.isRead)
    setNotifies(filtredNotify)
  },[notifications])
  
  const handleClickLogout = () => {
    dispatch(loginFinish());
    navigate('/');
  }
  const handleClickNotify = () => {
    setIsNotify(!isNotify)
  };

  const toOrderList = () => {
    if (quantity > 0) {
      dispatch(openOrder(true))
      navigate('/user/products');
    }
  }
  
  const toNotify = async (id: string, type: NotificationType, linkedId?: string) => {
    if (linkedId) {
      dispatch(setFocusedId(linkedId));
    }
    if (user && user.accessToken) {
      try {
        await userRequest(user.accessToken).patch(`/notifications/update_notification/${id}`, {});
        switch (type) {
          case 'customerRequest':
            navigate(user.isAdmin ? '/admin/requests' : '/user');
            break;
          case 'newOrder':
            navigate(user.isAdmin ? '/admin/orders' : '/user');
            break;
          case 'newProduct':
            navigate('/user/products');
            break;
          case 'orderStatusChange':
            navigate('/user/orders');
            break;
          case 'statusChange':
            navigate('/user/account');
            break; 
          case 'priceChange':
            navigate('/user/products');
            break; 
          default:
            console.log('Unknown notification type');
        }
        const path = user.isAdmin ? '/notifications/admin_notifications' : `/notifications/user_notifications/${user._id}`;
        const updatedNotifications = await userRequest(user.accessToken).get<NotificationData[]>(path);
        dispatch(getNotifications(updatedNotifications.data));
        setIsNotify(false);
      } catch (error) {
        console.error('Failed to update notification', error);
      }
    }
};


  return (
    <header>
      <div className={styles.page_title}>{user&&user.isAdmin ? "Администратор" : "Клиент"} / {pageTitle}</div>
      <div className={styles.header_icons}>
        {!user?.isAdmin &&
          <div className="headerIcon" onClick={toOrderList}>
            <MdAssignment size={26}/>
            {quantity
            ? <div className={styles.notification}>
              {quantity}
            </div>
            : <div className=""></div>
          }
          </div>
        }
        <div className="headerIcon bell" onClick={handleClickNotify}>
          < FaRegBell className='bell-icon'/>
          {notifyQuantity
            ? <div className={styles.notification}>
              {notifyQuantity}
            </div>
            : <div className=""></div>
          }
          
        </div>
        { isNotify && notifyQuantity>0 &&
          <div id="notification" className={`${styles.notifyContainer} ${styles.fadeInDown}`}>
          <div className={styles.notifyQuantity}>Новых уведомлений: {notifyQuantity}</div>
          <div className={styles.notifyList}>
            {notifies.map(notification =>
              <div 
                key={notification._id} 
                className={styles.notifyItem} 
                onClick={()=> toNotify(notification._id, notification.type, notification.data?.requestId)}
              >
                <div className={styles.notifyIcon}>{notificationTitles[notification.type].icon}</div>
                <div className="">
                  <div className={styles.notifyTitle}>{notificationTitles[notification.type].title}</div>
                  <div className={styles.notifyMessage}>{notification.message}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        }
        
        
        <div className="headerIcon" onClick={handleClickLogout} >
          <FaPowerOff />
        </div>
      </div>
      
    </header>
  )
}

export default Header