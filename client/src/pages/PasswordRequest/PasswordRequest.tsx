import { Link } from 'react-router-dom'
import { IoCheckmarkDoneSharp } from "react-icons/io5";

import { CustomInput } from '../../components'
import styles from './PasswordRequest.module.css'
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../middleware/requestMethods';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const PasswordRequest = () => {
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const users = useSelector((state: RootState) => state.admin.users);

  const sendNotification = async (email: string, requestId: string) => {
    const user = users.find(user => user.email === email);
    // const user = users.find(user => user.email === email || user.phone === phone);

    const message = user
      ? `Клиент ${user.username} запрашивает смену пароля`
      : 'Поступил запрос на доступ к системе от нового клиента';

    try {
      await axios.post(`${BASE_URL}/notifications/add_notification`, {
        type: 'customerRequest',
        message: message,
        data: { requestId }
      });
    } catch (error) {
      console.error('Failed to send notification', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await axios.post(`${BASE_URL}/requests/send_request`, {
        email: email,
        name: username,
        phone: phone,
      });
      const requestId = response.data._id; 
      console.log(requestId)
      sendNotification(email, requestId);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to send request', error);
    }
    setIsSending(false);
  };

  return (
<div className={styles.wrapper}>
<div className={styles.container}>
    <div className={styles.title}>
      Запрос клиентского доступа
    </div>
    <div className={styles.loginBox}>
      <div className={styles.p}>Введите Email клиента, имя и контактный телефон ответственного сотрудника</div>
      <form onSubmit={handleSubmit}>
        <CustomInput 
          type="email" 
          label="Email" 
          placeholder="Email" 
          required 
          getValue={setEmail}
        />
        <CustomInput 
          type="text" 
          label="Имя сотрудника" 
          placeholder="Имя сотрудника" 
          required 
          getValue={setUsername}
        />
        <CustomInput 
          type="phone" 
          label="Номер телефона" 
          placeholder="Номер телефона" 
          isMask 
          required 
          getValue={setPhone}
        />
        <button className={styles.button} disabled={isSending}>Отправить запрос</button>
        <Link to='/' className={styles.link}>Вернуться на страницу авторизации</Link>
      </form> 
    </div>
    {isSubmitted &&
      <div className={styles.successMessage}>
        <p className={styles.text}>Спасибо!</p>
        <p className={styles.text}> Запрос успешно отправлен. </p>
        <p className={styles.text}>Администратор системы свяжется с вами в ближайшее время.</p>
        <IoCheckmarkDoneSharp className={styles.icon}/>
    </div>
    }
    
  </div>
</div>
  )
}

export default PasswordRequest