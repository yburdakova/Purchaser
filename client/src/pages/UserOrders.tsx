import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { OrderData } from "../data/types";
import { useEffect, useState } from "react";
import { getAuthUsersData } from "../redux/apiCalls";
import { OrderItem } from "../components";

const UserOrders = () => {

  const user = useSelector((state: RootState) => state.user.currentUser);

  const [orders, setOrders] = useState<OrderData[]>([]);

  useEffect(()=>{
    user?.accessToken && getAuthUsersData(`orders/find/${user?._id}`, user?.accessToken, setOrders)
  }, [user]);


  return (
    <div className='infopage'>
      <div className="">
        {orders.map((order) => 
          <OrderItem  order={order} key={order._id}/>
        )}
      </div>
    </div>
  )
}

export default UserOrders