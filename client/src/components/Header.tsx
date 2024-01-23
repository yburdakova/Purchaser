import React from 'react'
import { FaPowerOff } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { loginFinish } from '../redux/userRedux';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickLogout = () => {
    dispatch(loginFinish());
    navigate('/');
  }

  return (
    <header>
      <div className="logout-icon" onClick={handleClickLogout}>
        <FaPowerOff size={40} />
      </div>
    </header>
  )
}

export default Header