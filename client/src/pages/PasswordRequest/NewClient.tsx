import { useState } from 'react';
import styles from './PasswordRequest.module.css'
import axios from 'axios';
import { BASE_URL } from '../../middleware/requestMethods';
import { CustomInput } from '../../components';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { postNotification } from '../../redux/apiCalls';
import { BiMessageRoundedError } from 'react-icons/bi';

const NewClient = () => {

  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isExist, setIsExist] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await axios.post(`${BASE_URL}/requests/new_request`, {
        title: title,
        email: email,
        contactName: username,
        contactPhone: phone,
      });

      if (response.data.existingUser) {
        setIsExist(true);
      } else if (response.data._id) {
        const requestId = response.data._id;
        postNotification({
          type: 'customerRequest',
          forAdmin: true,
          message: `Поступил запрос на добавление нового клиента`,
          data: { requestId }
        });
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to send request', error);
    }
    setIsSending(false);
  };

  return (
<div className={styles.wrapper}>
<div className={styles.container}>
    <div className={styles.title}>
      Заявка нового клиента
    </div>
    <div className={styles.loginBox}>
      <div className={styles.p}>Введите название организации, email, имя и контактный телефон ответственного сотрудника</div>
      <form onSubmit={handleSubmit}>
      <CustomInput 
          type="text" 
          label="Название" 
          placeholder="Название" 
          required 
          getValue={setTitle}
        />
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
        <Link to='/' className={styles.link}>Вернуться на страницу авторизации</Link>
    </div>
    }
    {isExist &&
      <div className={styles.successMessage}>
        <BiMessageRoundedError className={styles.icon}/>
        <p className={styles.text}>Клиент с таким email уже существует!</p>
        <p className={styles.textLink} onClick={()=> {setIsExist(false)}}>Продолжить заявку с другим email</p>
        <Link to='/reqest_password' className={styles.link}>Запросить изменение пароля</Link>
        <Link to='/' className={styles.link}>Вернуться на страницу авторизации</Link>
        
      </div>
    }
  </div>
</div>
  )
}

export default NewClient