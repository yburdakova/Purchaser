import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';
import { MdAssignmentAdd, MdOutlinePriceChange } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaRegEye } from 'react-icons/fa6';
import { CategoryData, ProductData } from '../data/types';
import { addCategories, addProducts } from '../redux/adminRedux';
import { getAdminData } from '../redux/apiCalls';
import { IoSearch } from 'react-icons/io5';

const UserProducts = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const products = useSelector((state: RootState) => state.admin.products);
  const categories = useSelector((state: RootState) => state.admin.categories);
  
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const[showCategories, setShowCategories] = useState<CategoryData[]>(categories)
  const [searchedProducts, setSelectedProducts] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('');

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
      <table className='purTable'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Товар</th>
            <th>Категория</th>
            <th>Фасовка</th>
            <th>Цена</th>
            <th>Изменение цены</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody className='tableBody'>
          {showProducts.map((product) => {
            
            let priceDifference = null;
            if (product.priceHistory.length >= 2) {
              const latestPrice = product.priceHistory[product.priceHistory.length - 1].price;
              const previousPrice = product.priceHistory[product.priceHistory.length - 2].price;
              priceDifference = latestPrice - previousPrice;
            }
            
            return (
              <tr className='rowTable' key={product._id} id={product._id}>
              <td>{product.customId}</td>
              <td className='b'>{product.title}</td>
              <td>{product.category}</td>
              <td>{product.measure}</td>
              <td>{product.price.toFixed(2)} ₽</td>
              <td className='priceCell'>
                {priceDifference !== null && 
                  <div className={priceDifference > 0 ?'green pp' : 'red pp'}>
                    <div className="">{priceDifference.toFixed(2)} ₽</div>
                  </div>
                }
              </td>
              <td className='iconTableCell'>
                <MdAssignmentAdd
                  className="editPriceIcon" 
                />
              </td>
          </tr>
            )
          })
        }
        </tbody>
      </table>
    </div>
  )
}

export default UserProducts