import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminRequest } from '../redux/apiCalls';
import { RootState } from '../redux/store';
import { CategoryData, CustomerRequest, NotificationData, OrderData, ProductData, TransformedDataItem, UserData } from '../data/types';
import { addCategories, addCustomerRequests, addOrders, addProducts, addUsers} from '../redux/adminRedux';
import { getNotifications } from '../redux/notificationRedux';
import { calculateTopProducts } from '../redux/admDachboardThunk';
import { LineChartComponent } from '../components';
import { PiStarBold } from 'react-icons/pi';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';

const AdminDashboard = () => {
  const dispatch: ThunkDispatch<RootState, void, Action> = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const topProducts = useSelector((state: RootState) => state.admdashboard.favoriteProducts);
  const products = useSelector((state: RootState) => state.admin.products);

  const [productForChart, setProductForChart] = useState('')
  const [chartData, setChartData] = useState<TransformedDataItem[]>([])

  const hadleClickSetChartProduct = (product: string) => {
    setProductForChart(product)
  }

  const setDataChart = () => {
    const oneOfTopProduct = products.find(product => product.title === productForChart);
    const priceData = oneOfTopProduct?.priceHistory;
    const transformedData = priceData ? priceData.map(item => {
        const date = item.date ? new Date(item.date) : new Date();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(2)}`;
        return {
            date: formattedDate,
            price: item.price,
        };
    }) : [];
    setChartData(transformedData);
}

  useEffect(() => {
    setDataChart()
  },[productForChart])

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
    setProductForChart(topProducts[0])
  }, [dispatch]);

  
  return (
    <div className='outletContainer'>
      <div className="viewBox">
      <div className="dashboardPanel">
      <div className="widgetBox">
        {topProducts.length > 0 
          ? <div className="">
              <div className="bottom-space">Ваши самые популярные продукты:</div>
              {topProducts&&
                topProducts.map((product)=>
                  <div className="textBlock bottom-space cursor uppercase" key={product} onClick={() => hadleClickSetChartProduct(product)}>
                    <PiStarBold size={26} color={productForChart === product ? "#4A7BD0" : "#B1B4B8"}/>
                    <div className="">{product}</div>
                  </div>
                )
              }
            </div>
          : <div className="">Недостаточно данных</div>
        }
        </div>
        <div className="widgetBox">
        {topProducts.length > 0 
          ? <div className="">
              <div className="bottom-space">Изменение цены для продукта "{productForChart}"</div>
              <LineChartComponent date={chartData}/>
            </div>
          : <div className="">Недостаточно данных</div>
        }
        
        </div>
      </div>
      
      </div>
    </div>
  )
}

export default AdminDashboard