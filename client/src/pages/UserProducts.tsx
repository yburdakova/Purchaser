import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CategoryData, ProductData } from '../data/types';
import { IoClose, IoSearch } from 'react-icons/io5';
import {  cleanOrder, openOrder } from '../redux/orderRedux';
import { getAllUsersData } from '../redux/apiCalls';
import { OrderListItem, ProductItem } from '../components';
import { formatPrice } from '../middleware/formatPrice';
import { userRequest } from '../middleware/requestMethods';

const UserProducts = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const order = useSelector((state: RootState) => state.order);
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
        dispatch(cleanOrder());
      } catch (error) {
        console.log(error);
      }
    }
    console.log("finish created order ...")
  };

  const addOrder = () => {
    console.log("Clicked ADD ORDER")
    createOrder();
  }

  return (
    <div className='outletContainer'>
      <div className="test">
      <div className="pageContent">
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
        <div className="gridTable">
          <div className="gridHeader">
            <div className="headerCell">ID</div>
            <div className="headerCell">Товар</div>
            <div className="headerCell">Категория</div>
            <div className="headerCell centerCell">Фасовка</div>
            <div className="headerCell">Цена</div>
            <div className="headerCell centerCell">Изменение цены</div>
            <div className="headerCell iconColumn">Действия</div>
          </div>
        <div className="gridBodyWrapperUser">
        <div className="gridBody">
            {showProducts.map((product) => 
              <ProductItem product={product} key={product._id}/>
            )}
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
    </div>

  )
}

export default UserProducts
