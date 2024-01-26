import React, { useEffect, useState } from 'react'
import { FaPowerOff } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";


import { useDispatch, useSelector } from 'react-redux';
import { loginFinish } from '../redux/userRedux';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuLinks } from '../data/constants';
import { RootState } from '../redux/store';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.user.currentUser);
  const notifyQuantity = useSelector((state: RootState) => state.admin.notifyCounter);
  
  
  const [pageTitle, setPageTitle] = useState('Page Name');

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    const currentMenuItem = menuLinks.find(link => link.path === currentPath);
    setPageTitle(currentMenuItem ? currentMenuItem.title : 'Page Name');
  }, [location]);

  const handleClickLogout = () => {
    dispatch(loginFinish());
    navigate('/');
  }
  const handleClickNotify = () => {

  }

  return (
    <header>
      <div className="page_title">{user&&user.isAdmin ? "Администратор" : "Клиент"} / {pageTitle}</div>
      <div className="header_icons">
        <div className="headerIcon bell" onClick={handleClickNotify}>
          < FaRegBell className='bell-icon'/>
          {notifyQuantity
            ? <div className="notification">
              {notifyQuantity}
            </div>
            : <div className=""></div>
          }
          
        </div>
        
        <div className="headerIcon" onClick={handleClickLogout}>
          <FaPowerOff />
        </div>
      </div>
      
    </header>
  )
}

export default Header