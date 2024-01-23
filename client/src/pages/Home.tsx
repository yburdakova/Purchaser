import React from 'react'
import { Header } from '../components'
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  
  console.log(user)
  return (
    <div>Home - page for clients
      <Header/>
    </div>
  )
}

export default Home