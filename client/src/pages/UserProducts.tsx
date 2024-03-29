import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CategoryData, NotificationData, ProductData } from '../data/types';
import { IoClose, IoSearch } from 'react-icons/io5';
import {  cleanOrder, openOrder } from '../redux/orderRedux';
import { getAllUsersData, getAuthUsersData, postNotification } from '../redux/apiCalls';
import { OrderListItem, ProductItem } from '../components';
import { formatPrice } from '../middleware/formatPrice';
import { BASE_URL, userRequest } from '../middleware/requestMethods';
import { changeActive } from '../redux/userRedux';
import { getNotifications } from '../redux/notificationRedux';
import axios from 'axios';

const UserProducts = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const order = useSelector((state: RootState) => state.order);
  const focusedId = useSelector((state: RootState) => state.notifications.focusedId);
  const isOpenOrder = useSelector((state: RootState) => state.order.isOpen);
  const { products, totalPrice } = useSelector((state: RootState) => state.order);


  const [dbProducts, setDbProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const [showCategories, setShowCategories] = useState<CategoryData[]>(categories)
  const [searchedProducts, setSelectedProducts] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')


  useEffect(()=>{
    getAllUsersData("products", setDbProducts)
    getAllUsersData("categories", setCategories)
  }, [user]);

  useEffect(() => {
    setShowCategories(categories);
  }, [dispatch, user?.isAdmin, user?.accessToken, categories]);

  const handleCategoryFilterChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedCategory(e.target.value);
  };

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
    let filteredProducts = dbProducts;

    if (selectedCategory && selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    if (searchedProducts) {
      filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchedProducts.toLowerCase()));
    }

    setShowProducts(filteredProducts);
  }, [selectedCategory, searchedProducts, dbProducts]);


  const hadleCloseOrder = () => {
    dispatch(openOrder(false))
  }

  const handleEmptyOrder = () => {
    dispatch(cleanOrder())
    dispatch(openOrder(false))
  }

  const createOrder = async () => {
    console.log("create order ...")
    if (user) {
      const currentOrder = {
        userId: user._id,
        products: order.products.map((item: ProductData) => ({
          productId: item._id,
          quantity: item.quantity,
          title: item.title,
          price: item.price,
          measure: item.measure
        })),
        amount: order.totalPrice,
      };

      try {
        console.log(currentOrder);
        const res = await userRequest(user.accessToken).post("/orders", currentOrder);
        console.log(res.data);
        const requestId = res.data._id;
        postNotification ({
          fromUser: user?._id,
          type: 'newOrder',
          forAdmin: true,
          message: `Поступила новая заявка от клиента ${user?.title} на сумму ${order.totalPrice} ₽`,
          data: {requestId}
        })
      } catch (error) {
        console.log(error);
      }
    }
    console.log("finish created order ...")
  };

  const addOrder = () => {
    createOrder();
    dispatch(cleanOrder());
  }

  return (
    <div className='outletContainer'>
      <div className="viewBox">
        <div className="toolBox">
          <div className="toolBlock">
            <div className="toolBlockTitle">Быстрый поиск по названию продукта</div>
            <input 
              value={searchedProducts}
              onChange={(e) => setSelectedProducts(e.target.value)}  
              className='searchInput'
            />
            <IoSearch className='searchIcon'/>
          </div>
          <div className="toolBlock">
            <div className="toolBlockTitle">Выбрать категорию</div>
            <select 
              name="categoryFilter" 
              id="categoryFilter" 
              className='customSelect' 
              onChange={handleCategoryFilterChange}
            >
            <option value="all">Все категории</option>
              {showCategories.map(category => <option value={category.title} key={category._id}>{category.title}</option>)}
            </select>
          </div>
        </div>
        <div className="pageinfo">
          <div className="gridTable">
            <div className="gridHeader tableProduct">
              <div className="headerCell">ID</div>
              <div className="headerCell">Товар</div>
              <div className="headerCell">Категория</div>
              <div className="headerCell centerCell">Фасовка</div>
              <div className="headerCell">Цена</div>
              <div className="headerCell centerCell">Изменение цены</div>
              <div className="headerCell iconColumn">Действия</div>
            </div>
            <div className="scrollWrapper customerProductHeight">
              <div className={`gridBody tableProduct ${isOpenOrder && "sixcolumn"}`}>
                {showProducts.map((product) => 
                  <ProductItem product={product} focused={focusedId === product._id} key={product._id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      { isOpenOrder &&
        <div className={`orderContainer slideInFromRight`}>
          <div className="orderTitle">заказ</div>
          <div className="closeIcon">
            <IoClose size={20} onClick={hadleCloseOrder}/>
          </div>
          <div className="orderList">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Продукт</th>
                <th>Цена</th>
                <th></th>
                <th>Кол-во</th>
                <th></th>
                <th>Сумма</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {products.map((product, index) => (
                <OrderListItem product={product} index={index} key={`${product._id}_${product.quantity}`} />
            ))}
            </tbody>
          </table>
          <div className="amount">ОБЩАЯ СУММА ЗАКАЗА: {formatPrice(totalPrice)} ₽</div>
          </div>
          <div className="orderButtons">
            <button onClick={handleEmptyOrder}>Очистить заказ</button>
            <button onClick={addOrder}>Отправить заказ</button>
          </div>
          
        </div>
      }
    </div>
  )
}

export default UserProducts
