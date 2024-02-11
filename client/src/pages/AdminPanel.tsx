import { Footer, Header, MenuPanel } from '../components'
import { Outlet } from 'react-router'

const AdminPanel = () => {
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

export default AdminPanel