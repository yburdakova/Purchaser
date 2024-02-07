import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


const Account = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);



  return (
    <div className='infopage'>
      Account
      <div className="">{user&&user.title}</div>
      <div className="">{user&&user.isActive ? " Подключен" : "Отключен"}</div>
    </div>
  )
}

export default Account