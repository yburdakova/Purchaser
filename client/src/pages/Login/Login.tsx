import styles from './Login.module.css'

import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'
import { CustomInput } from '../../components'

const Login = () => {

  return (
    <div className={styles.container}>
      <div className={styles.logoBox}>
        <img src={logo} alt="logo"/>
      </div>
      <div className={styles.loginBox}>
        <div className={styles.p}>Для доступа к системе введите регистрационные данные клиента</div>
        <form>
          <CustomInput type="email" label="Email" placeholder="Email" required/>
          <CustomInput type="password" label="Password" placeholder='password' required/>

          <button className={styles.button}>Войти</button>
          <Link to='/reqest_password' className="">Запросить изменение пароля</Link>
        </form> 
      </div>
    </div>
  )
}

export default Login