import { Link } from 'react-router-dom'
import { CustomInput } from '../../components'
import styles from './PasswordRequest.module.css'
import { useState } from 'react';

const PasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  return (
    <div className={styles.container}>
    <div className={styles.title}>
      Запрос клиентского доступа
    </div>
    <div className={styles.loginBox}>
      <div className={styles.p}>Введите Email клиента, имя и контактный телефон ответственного сотрудника</div>
      <form>
        <CustomInput type="email" label="Email" placeholder="Email" required getValue={setEmail}/>
        <CustomInput type="text" label="Имя сотрудника" placeholder="Имя сотрудника" required getValue={setUsername}/>
        <CustomInput type="phone" label="Номер телефона" placeholder="Номер телефона" isMask required getValue={setPhone}/>

        <button className={styles.button}>Отправить запрос</button>
        <Link to='/' className="">Вернуться на страницу авторизации</Link>
      </form> 
    </div>
  </div>
  )
}

export default PasswordRequest