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
  

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    const currentMenuItem = menuLinks.find(link => link.path === currentPath);
    setPageTitle(currentMenuItem ? currentMenuItem.title : 'Page Name');
  }, [location]);

  useEffect(() => {
    const filtredNotify = notifications.filter(notification => !notification.isRead)
    setNotifies(filtredNotify)
  },[notifications])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isNotify && target && !target.closest('#notification')) {
        setIsNotify(false);
      }
    };
  
    document.addEventListener('mousedown', handleOutsideClick);
  
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isNotify]);

  const handleClickLogout = () => {
    dispatch(loginFinish());
    navigate('/');
  }
  const handleClickNotify = () => {
    isNotify ? setIsNotify(false) : setIsNotify( true)
  };

  const toNotify = (id: string, type: NotificationType) => {
    console.log (id, type)
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
          <div id="notification" className={`${styles.notifyContainer} ${styles.fadeInDown}`}>
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