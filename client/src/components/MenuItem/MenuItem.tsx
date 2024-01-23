import styles from './MenuItem.module.css'
import { MenuItemProps } from '../../data/types'
import { Link, useLocation } from 'react-router-dom'

const MenuItem = ({title, path, icon}: MenuItemProps) => {

  const location = useLocation();
  const isActive = location.pathname === path;


  console.log(path)
  
  return (
    <li className={isActive? `${styles.itemContainer} ${styles.active}` : styles.itemContainer}>
      <div className={styles.icon}>{icon}</div>
      <Link to={path} className={styles.link}>{title}</Link>
    </li>
  )
}

export default MenuItem