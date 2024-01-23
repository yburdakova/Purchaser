import styles from './Login.module.css'
import CustomInput from '../../components/CustomInput/CustomInput'

const Login = () => {

  return (
    <div className={styles.container}>
      <div className="logo">LOGO</div>
      <div className="login_box">
        <div className="title">Для доступа к системе, введите регистрационные данные </div>
        <form>
          <CustomInput type="email" label="Email" placeholder="Email" required/>
          <CustomInput type="password" label="Password" placeholder='password' required/>
          <button>Войти</button>
        </form> 
      </div>
    </div>
  )
}

export default Login