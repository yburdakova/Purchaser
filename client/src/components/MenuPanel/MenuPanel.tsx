import styles from './MenuPanel.module.css'
import { menuLinks } from "../../data/constants.tsx"
import logo from '../../assets/logo.svg'
import { MenuItemProps } from '../../data/types.ts'
import { MenuItem } from '../index.ts'

const MenuPanel = () => {
  return (
    <div className={styles.menuContainer}>
      <div className={styles.logoBox}><img src={logo} alt="LOGO"/></div>
      <div className={styles.title}>Меню администратора</div>
      <nav className="menu">
        <ul>
          {menuLinks.map((link:MenuItemProps) => <MenuItem title={link.title} key={link.title} icon={link.icon} path={`/admin/${link.path}`}/>)}
        </ul>
      </nav>
    </div>
  )
}

export default MenuPanel