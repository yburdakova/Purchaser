import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminRequest } from '../redux/apiCalls';
import { RootState } from '../redux/store';
import { CategoryData, CustomerRequest, NotificationData, OrderData, ProductData, UserData } from '../data/types';
import { addCategories, addCustomerRequests, addOrders, addProducts, addUsers} from '../redux/adminRedux';
import { getNotifications } from '../redux/notificationRedux';
import { calculateTopProducts } from '../redux/admDachboardThunk';
import { LineChartComponent } from '../components';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const topProducts = useSelector((state: RootState) => state.admdashboard.favoriteProducts);
  // const users = useSelector((state: RootState) => state.admin.users);

  useEffect(() => {
    if (user?.isAdmin && user.accessToken) {
      adminRequest<CustomerRequest[]>(dispatch, 'get','/requests', user.accessToken, user.isAdmin, addCustomerRequests);
      adminRequest<UserData[]>(dispatch, 'get','/users', user?.accessToken, user?.isAdmin, addUsers)
      adminRequest<ProductData[]>(dispatch, 'get','/products', user?.accessToken, user?.isAdmin, addProducts)
      adminRequest<CategoryData[]>(dispatch, 'get', '/categories', user?.accessToken, user?.isAdmin, addCategories)
      adminRequest<NotificationData[]>(dispatch, 'get','/notifications/admin_notifications', user?.accessToken, user?.isAdmin, getNotifications)
      adminRequest<OrderData[]>(dispatch, 'get','/orders', user?.accessToken, user?.isAdmin, addOrders)
    }
  }, [dispatch, user?.isAdmin, user?.accessToken]);

  useEffect(() => {
    dispatch(calculateTopProducts());
  }, [dispatch]);

  
  return (
    <div className='outletContainer'>
      <div className="viewBox">
      <div className="dashboardPanel">
      <div className="widgetBox">
        <div className="bottom-space">Продукты, которые заказывают чаще других:</div>
          {topProducts&&
            topProducts.map((product, index)=>
              <div className="textBlock" key={product}>
                <div className="">{ index +1 }</div>
                <div className="">{product}</div>
              </div>
            )
          }
        </div>
        <div className="widgetBox">
        <div className="bottom-space">Изменение цены:</div>
        <LineChartComponent/>
        </div>
      </div>
      
      </div>
    </div>
  )
}

export default AdminDashboard