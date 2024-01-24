import React, { useState } from 'react'
import { FaPowerOff } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";


import { useDispatch } from 'react-redux';
import { loginFinish } from '../redux/userRedux';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifyCounter, setNotifyCounter] = useState(0)

  const handleClickLogout = () => {
    dispatch(loginFinish());
    navigate('/');
  }

  return (
    <header>
      <div className="headerIcon" onClick={handleClickLogout}>
        < FaRegBell />
        <div className="notification">
          {notifyCounter}
        </div>
      </div>
      
      <div className="headerIcon" onClick={handleClickLogout}>
        <FaPowerOff />
      </div>
    </header>
  )
}

export default Header