import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { MdAssignmentAdd } from 'react-icons/md';
import { CategoryData, ProductData } from '../data/types';
import { IoClose, IoSearch } from 'react-icons/io5';
import { FaRegEye } from 'react-icons/fa6';
import { addProduct, openOrder } from '../redux/orderRedux';
import { getUsersData } from '../redux/apiCalls';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { OrderItem } from '../components';

const UserProducts = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const isOpenOrder = useSelector((state: RootState) => state.order.isOpen);
  const { products, quantity, totalPrice } = useSelector((state: RootState) => state.order);
  
  const [dbProducts, setDbProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const [showCategories, setShowCategories] = useState<CategoryData[]>(categories)
  const [searchedProducts, setSelectedProducts] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [value, setValue] = useState (1)


  useEffect(()=>{
    getUsersData("products", setDbProducts)
    getUsersData("categories", setCategories)
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


  const handleClickCartButton = (product: ProductData) => {
    const productToAdd = {
      ...product,
      quantity: 1, 
      totalPrice: product.price 
    };
    
    dispatch(addProduct(productToAdd));
    dispatch(openOrder(true))
  }

  const hadleCloseOrder = () => {
    dispatch(openOrder(false))
  }

  const increaseQuantity = () => {
  quantity > 0 && 
    setQuantity(quantity + 1);
  }

  const decreaseQuantity = () => {
    quantity > 1 && 
    setQuantity(quantity - 1);
  }

  return (
    <div className='outletContainer'>
      <div className="test">
      <div className="content">
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
                    <div data-tooltip="Добавить в заказ" className="icon-button" >
                      <MdAssignmentAdd size={24} onClick={() => product && handleClickCartButton(product)}/>
                    </div>
                    <div className="inactiveIcon" data-tooltip="Посмотреть детали" >
                      <FaRegEye size={24} />
                    </div>
                  </div>
                </div>
              )
            })
            }
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
              </tr>
            </thead>
            <tbody>
              { products.map ((product, index) => (
                  <OrderItem product={product} index={index} key={product._id}/>
              ))}
            </tbody>
          </table>
          <div className="amount">ОБЩАЯ СУММА ЗАКАЗА: {totalPrice} ₽</div>
          </div>
          <div className="orderButtons">
            <button>Очистить заказ</button>
            <button>Отправить заказ</button>
          </div>
          
        </div>
      }
      </div>
    </div>

  )
}

export default UserProducts