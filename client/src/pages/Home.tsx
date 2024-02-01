import { Footer, Header, MenuPanel } from '../components'
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const Home = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  
  console.log(user)
  return (
    <div className="pageWrapper">
    <MenuPanel/>
    <div className="pageContainer">
      <Header/>
      <Outlet/> 
      <Footer/>
    </div>
    
  </div>
  )
}

export default Home