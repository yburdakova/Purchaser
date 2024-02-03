import styles from './MenuItem.module.css'
import { MenuItemProps } from '../../data/types'
import { Link, useLocation } from 'react-router-dom'

const MenuItem = ({title, path, icon}: MenuItemProps) => {

  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    
      <Link to={path} className={styles.link}>
        <li className={isActive? `${styles.itemContainer} ${styles.active}` : styles.itemContainer}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.title}>{title}</div>
        </li>
      </Link>
    
  )
}

export default MenuItem