import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { MdAssignmentAdd } from 'react-icons/md';
import { CategoryData, ProductData } from '../data/types';
import { addCategories, addProducts } from '../redux/adminRedux';
import { getAdminData } from '../redux/apiCalls';
import { IoSearch } from 'react-icons/io5';
import { FaRegEye } from 'react-icons/fa6';

const UserProducts = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const products = useSelector((state: RootState) => state.admin.products);
  const categories = useSelector((state: RootState) => state.admin.categories);
  
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const[showCategories, setShowCategories] = useState<CategoryData[]>(categories)
  const [searchedProducts, setSelectedProducts] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [orderList, setSelectedOrderList] = useState<ProductData[]>([])
  const quantity = 1

  useEffect(() => {
    if (user?.isAdmin && user.accessToken && products.length === 0) {
      getAdminData<ProductData[]>(dispatch, '/products', user.accessToken, user.isAdmin, addProducts);
    }
    setShowProducts(products);
  }, [dispatch, user?.isAdmin, user?.accessToken, products]);

  useEffect(() => {
    if (user?.isAdmin && user.accessToken && categories.length === 0) {
      getAdminData<CategoryData[]>(dispatch, '/categories', user.accessToken, user.isAdmin, addCategories);
    }
    setShowCategories(categories);
  }, [dispatch, user?.isAdmin, user?.accessToken, categories]);

  const handleCategoryFilterChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedCategory(e.target.value);
  };
  useEffect(() => {
    let filteredProducts = products;

    if (selectedCategory && selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    if (searchedProducts) {
      filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchedProducts.toLowerCase()));
    }

    setShowProducts(filteredProducts);
  }, [selectedCategory, searchedProducts, products]);

const addProductToOrder =(product: ProductData) => {
  setSelectedOrderList([... orderList, product])
}

  return (
    <div className='infopage'>
      <div className="tools">
      <div className="block">
          <div className="">Быстрый поиск по названию продукта</div>
          <input 
            value={searchedProducts}
            onChange={(e) => setSelectedProducts(e.target.value)}  
            className='prodInput'
          />
          <IoSearch className='seachIcon'/>
        </div>
        <div className="block">
          <div className="">Выбрать категорию</div>
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
      <div className="content">
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
        <div className="gridBody">
          {showProducts.map((product) => {
            let priceDifference = null;
            if (product.priceHistory.length >= 2) {
            const latestPrice = product.priceHistory[product.priceHistory.length - 1].price;
            const previousPrice = product.priceHistory[product.priceHistory.length - 2].price;
            priceDifference = latestPrice - previousPrice;
            }

            return (
              <div className="gridRow" key={product._id} id={product._id}>
                <div className="gridCell">{product.customId}</div>
                <div className="gridCell b">{product.title}</div>
                <div className="gridCell">{product.category}</div>
                <div className="gridCell centerCell">{product.measure}</div>
                <div className="gridCell b">{product.price.toFixed(2)} ₽</div>
                <div className="gridCell">
                  {priceDifference !== null && 
                    <div className={priceDifference > 0 ?'green pp' : 'red pp'}>
                      <div className="">{priceDifference.toFixed(2)} ₽</div>
                    </div>
                  }
                </div>
                <div className="gridCell iconColumn">
                  <MdAssignmentAdd size={24} onClick={() => product && addProductToOrder(product)}/>
                  <FaRegEye size={24}/>
                </div>
              </div>
            )
          })
          }
        </div>
      </div>
      { orderList.length > 0 &&
        <div className="orderContainer">
          <div className="b">Заказ</div>
          {orderList.map(orderListItem => 
            <div className='orderItem'>
              <div className="">{orderListItem.title}</div>
              <div className="">{orderListItem.price}</div>
              <div className="">{quantity}</div>
              <div className="">{orderListItem.measure}</div>
              <div className="">{orderListItem.price * quantity}</div>
            </div>
          )}
          <button>Отправить заказ</button>
        </div>
      }

      </div>
      
    </div>

  )
}

export default UserProducts