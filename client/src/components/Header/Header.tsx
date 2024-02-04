import { useEffect, useState } from 'react'
import { FaPowerOff } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import styles from './Header.module.css'

import { useDispatch, useSelector } from 'react-redux';
import { loginFinish } from '../../redux/userRedux';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuLinks } from '../../data/constants';
import { RootState } from '../../redux/store';
import { notificationTitles } from '../../data/constants';
import { NotificationData, NotificationType } from '../../data/types';
import { userRequest } from '../../middleware/requestMethods';
import { getAdminData } from '../../redux/apiCalls';
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
    const currentMenuItem = menuLinks.find(link => link.path === currentPath);
    setPageTitle(currentMenuItem ? currentMenuItem.title : 'Page Name');
  }, [location]);

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
  
  const toNotify = async (id: string, linkedId: string, type: NotificationType) => {
    dispatch(setFocusedId(linkedId))
    if (user && user?.accessToken && user?.isAdmin) {
      try {
        await userRequest(user.accessToken).patch(`/notifications/update_notification/${id}`, {});
        switch (type) {
          case 'customerRequest':
            navigate('/admin/requests');
            break;
          case 'newOrder':
            navigate('/admin/orders');
            break;
          case 'newProduct':
            navigate('/admin/products');
            break;
          default:
            console.log('Unknown notification type');
        }
        getAdminData<NotificationData[]>(dispatch, '/notifications/admin_notifications', user?.accessToken, user?.isAdmin, getNotifications)
        setIsNotify(false)
      } catch (error) {
        console.error('Failed to update notification', error);
      }
    }
      
  }

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
                onClick={()=> toNotify(notification._id, notification.data.requestId, notification.type)}
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