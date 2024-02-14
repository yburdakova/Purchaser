import { Footer, Header, MenuPanel } from '../components'
import { Outlet } from 'react-router-dom';

const Home = () => {

  return (
    <div className="pageWrapper">
      <MenuPanel/>
      <div className="contentContainer">
        <Header/>
        <Outlet/> 
        <Footer/>
      </div>
    </div>
  )
}

export default Home