import { Link } from 'react-router-dom'
import { CustomInput } from '../../components'
import styles from './PasswordRequest.module.css'

const PasswordRequest = () => {
  return (
    <div className={styles.container}>
    <div className={styles.title}>
      Запрос пароля клиента
    </div>
    <div className={styles.loginBox}>
      <div className={styles.p}>Введите Email клиента, имя и контактный телефон ответственного сотрудника</div>
      <form>
        <CustomInput type="email" label="Email" placeholder="Email" required/>
        <CustomInput type="text" label="Имя сотрудника" placeholder="Email" required/>
        <CustomInput type="phone" label="Номер телефона" placeholder="Email" required/>

        <button className={styles.button}>Отправить запрос</button>
        <Link to='/' className="">Вернуться на страницу авторизации</Link>
      </form> 
    </div>
  </div>
  )
}

export default PasswordRequest