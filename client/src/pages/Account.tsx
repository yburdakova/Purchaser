import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


const Account = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);

  return (
    <div className='infopage'>
      Account
      <div className="">{user&&user.username}</div>
    </div>
  )
}

export default Account