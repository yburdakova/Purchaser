
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { OrderItemAdm } from '../components';
import { adminRequest } from '../redux/apiCalls';
import { OrderData } from '../data/types';
import { addOrders } from '../redux/adminRedux';
import { useEffect } from 'react';


const AdminOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const orders = useSelector((state: RootState) => state.admin.orders);

  useEffect(() => {
    loadOrders()
  }, []);
  
  const loadOrders = async () => {
    if (user?.isAdmin && user.accessToken) {
      adminRequest<OrderData[]>(dispatch, 'get','/orders', user?.accessToken, user?.isAdmin, addOrders)
    }
  };

  return (
    <div className='infopage'>
      <div className="">AdminOrders</div>
      <div className="flexList">
      {orders && orders.map((order) => 
        <OrderItemAdm order={order} key={order._id} reloadOrders={loadOrders}/>
      )}
      </div>
      
    </div>
  )
}

export default AdminOrders