import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { OrderData } from "../data/types";
import { useEffect, useState } from "react";
import { getAuthUsersData} from "../redux/apiCalls";
import { formatDate } from "../middleware/formatDate";
import { formatPrice } from "../middleware/formatPrice";
import { OrderListItem } from "../components";

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
          <div className="orderPageItem" key={order._id}>
            <div className="orderSummary">
              <div className="">Заказ № {order._id}</div>
              <div className="">На сумму: {formatPrice(order.amount)}  ₽</div>
              <div className="">от {order.createdAt && formatDate(order.createdAt.toString())}</div>
              <div className="">{order.status}</div>
              <button>Показать детали заявки</button>
            </div>
            <div className="odredDetails">
              <div className="">Детали заявки:</div>
              <table>
                <tbody>
                  {order.products.map((product, index) => 
                    <OrderListItem product={product} index={index} key={`${product._id}_${product.quantity}`} createdOrder/>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserOrders