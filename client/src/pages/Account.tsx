import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { RootState } from "../redux/store";
import { getAuthUsersData } from "../redux/apiCalls";
import { changeActive } from "../redux/userRedux";
import { formatId } from "../middleware/formatId";
import { getNotifications } from "../redux/notificationRedux";
import { BASE_URL, userRequest } from "../middleware/requestMethods";
import { NotificationData } from "../data/types";


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

  useEffect(() => {
    const fetchNotifications = async () => {
        if (user?.accessToken) {
  
            const fetchAllNotifications = async () => {
                try {
                    const res = await axios.get<NotificationData[]>(`${BASE_URL}/notifications/user_notifications`);
                    return res.data;
                } catch (error) {
                    console.error(error);
                    return [];
                }
            };
  
            const fetchUserNotifications = async () => {
                try {
                    const res = await userRequest(user.accessToken).get<NotificationData[]>(`notifications/user_notifications/${user._id}`);
                    return res.data;
                } catch (error) {
                    console.error(error);
                    return [];
                }
            };
  
            const allNotifications = await fetchAllNotifications();
            const userNotifications = await fetchUserNotifications();
            dispatch(getNotifications([...allNotifications, ...userNotifications]));
        }
    };
    fetchNotifications();
  }, [user, dispatch]);

  return (
    <div className='outletContainer'>
      <div className="viewBox">
        <h2 className="">{user&&user.title}</h2>
        <div className="bottom-space">Уникальный номер клиента: {user && user._id && formatId(user._id)}</div>
        <div className="bottom-space">Статус: {active ? " Подключен" : "Отключен"}</div>
        <div className="">Ваши контакты, указанные в системе:</div>
        {user?.contacts?.map(contact => 
          <div className="contactBlock">
            <div className="">{contact.contactName}</div>
            <div className="">{contact.contactPhone}</div>
          </div>
          )}
      </div>
    </div>
  )
}

export default Account