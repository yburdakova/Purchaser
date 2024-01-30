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
import { NotificationData } from '../../data/types';
import { setFocusedId } from '../../redux/adminRedux';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  

  const user = useSelector((state: RootState) => state.user.currentUser);
  const notifyQuantity = useSelector((state: RootState) => state.admin.notifyCounter);
  const notifications = useSelector((state: RootState) => state.admin.notifications);
  
  const [pageTitle, setPageTitle] = useState('Page Name');
  const [isNotify, setIsNotify] = useState(false);
  const [notifies, setNotifies] = useState <NotificationData[]>([])
  const [notifyClass, setNotifyClass] = useState(styles.fadeInDown)
  

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
    if (isNotify) {
      setNotifyClass(styles.fadeOutUp)
      setTimeout(() => {
        setIsNotify(false);
      }, 300); 
    } else {
      setNotifyClass(styles.fadeInDown)
      setTimeout(() => {
        setIsNotify(true)
      }, 300); 
    }
  }

  const toNotify = (id: string, type: string) => {
    console.log (id)
    dispatch(setFocusedId(id))
    user?.isAdmin ? (console.log('admin')) : (console.log('not admin'))
    
  }

  return (
    <header>
      <div className={styles.page_title}>{user&&user.isAdmin ? "Администратор" : "Клиент"} / {pageTitle}</div>
      <div className={styles.header_icons}>
        <div className="headerIcon bell" onClick={handleClickNotify}>
          < FaRegBell className='bell-icon'/>
          {notifyQuantity
            ? <div className={styles.notification}>
              {notifyQuantity}
            </div>
            : <div className=""></div>
          }
          
        </div>
        { isNotify &&
          <div className={`${styles.notifyContainer} ${notifyClass}`}>
          <div className={styles.notifyQuantity}>Новых уведомлений: {notifyQuantity}</div>
          {notifies.map(notification =>
            <div 
              key={notification._id} 
              className={styles.notifyItem} 
              onClick={()=> toNotify(notification._id, notification.type)}
            >
              <div className={styles.notifyIcon}>{notificationTitles[notification.type].icon}</div>
              <div className="">
                <div className={styles.notifyTitle}>{notificationTitles[notification.type].title}</div>
                <div className={styles.notifyMessage}>{notification.message}</div>
              </div>
            </div>
          )}
        </div>
        }
        
        
        <div className="headerIcon" onClick={handleClickLogout}>
          <FaPowerOff />
        </div>
      </div>
      
    </header>
  )
}

export default Header