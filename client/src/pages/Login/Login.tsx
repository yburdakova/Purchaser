
import { Link, useNavigate } from 'react-router-dom'
import { CustomInput } from '../../components'
import { useDispatch, useSelector } from 'react-redux'

import styles from './Login.module.css'
import logo from '../../assets/logo.svg'
import { useEffect, useState } from 'react'
import { RootState } from '../../redux/store'
import { login } from '../../redux/apiCalls'
import { resetError } from '../../redux/userRedux'

const Login = () => {

  const user = useSelector((state: RootState) => state.user.currentUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { isFetching, error } = useSelector((state: RootState) => state.user);
  
  useEffect(()=> {
    user && navigate('/')
  }, [user])

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch, email, password]);
  
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    login(dispatch, {email, password})
  }

  return (
    <div className={styles.container}>
      <div className={styles.logoBox}>
        <img src={logo} alt="logo"/>
      </div>
      <div className={styles.loginBox}>
        <div className={styles.p}>Для доступа к системе введите регистрационные данные клиента</div>
        <form onSubmit={handleSubmit}>
          <CustomInput type="email" label="Email" placeholder="Email" required getValue={setEmail}/>
          <CustomInput type="password" label="Password" placeholder='password' required getValue={setPassword}/>

          <button className={styles.button} type="submit" disabled={isFetching}>
            Войти
          </button>
          {error 
            ? <div className={`${styles.error} ${error ? styles.active : ''}`}>{error}</div> 
            : <div className={`${styles.error} ${error ? styles.active : ''}`}>Нет ошибок</div>
          }
          <Link to='/reqest_password' className={styles.link}>Запросить изменение пароля</Link>
        </form> 
      </div>
    </div>
  )
}

export default Login