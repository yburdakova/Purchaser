import styles from './MenuPanel.module.css'
import { menuLinks, userMenuLinks } from "../../data/constants.tsx"
import logo from '../../assets/logo.svg'
import { MenuItemProps } from '../../data/types.ts'
import { MenuItem } from '../index.ts'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store.ts'

const MenuPanel = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);

  const menuItems = user?.isAdmin ? menuLinks : userMenuLinks
  const accessPath = user?.isAdmin ? "/admin" : "/user"
  
  return (
    <div className={styles.menuContainer}>
      <div className={styles.logoBox}><img src={logo} alt="LOGO"/></div>
      <div className={styles.title}>{`Меню ${user?.isAdmin ? 'администратора' : ' клиента'}`}</div>
      <nav className="menu">
        <ul>
          {menuItems.map((link:MenuItemProps) => 
            <MenuItem title={link.title} key={link.title} icon={link.icon} path={`${accessPath}/${link.path}`}/>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default MenuPanel