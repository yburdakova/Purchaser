import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { getAuthUsersData } from "../redux/apiCalls";
import { changeActive } from "../redux/userRedux";
import { formatId } from "../middleware/formatId";

const Account = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const active = useSelector((state: RootState) => state.user.isActive);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (user?.accessToken && user._id) {
        try {
          const isActive = await getAuthUsersData<boolean>(`/users/status/${user._id}`, user.accessToken);
          dispatch(changeActive(isActive));
        } catch (error) {
          console.error("Error fetching user status", error);
        }
      }
    };
    fetchUserStatus();
  }, [user, dispatch]);

  return (
    <div className='outletContainer'>
      <div className="viewBox">
        <div className="">{user&&user.title}</div>
        <div className="">Уникальный номер клиента: {user && user._id && formatId(user._id)}</div>
        <div className="">Статус: {active ? " Подключен" : "Отключен"}</div>
      </div>
    </div>
  )
}

export default Account