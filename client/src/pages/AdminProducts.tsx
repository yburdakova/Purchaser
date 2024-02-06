import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CustomInput, ProductItem} from '../components';
import { CategoryData, ProductData } from '../data/types';
import { IoSearch } from "react-icons/io5";
import { measures } from '../data/constants';
import { adminRequest, postNotification } from '../redux/apiCalls';
import { addCategories, addProducts, postDataSuccess } from '../redux/adminRedux';
import { PiWarningCircleBold } from 'react-icons/pi';

const AdminProducts = () => {
  
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const products = useSelector((state: RootState) => state.admin.products);
  const categories = useSelector((state: RootState) => state.admin.categories);
  const response = useSelector((state: RootState) => state.admin.response);
  
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const [searchedProducts, setSearchedProducts] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [newProductTitle, setNewProductTitle] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductCategory, setNewProductCategory] = useState(categories[0]?.title || '')
  const [newProductMeasure, setNewProductMeasure] = useState(measures[0] || '')
  const [newCategoryTitle, setNewCategoryTitle] = useState('')
  const [readyNotify, setReadyNotify] = useState(false)

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(()=> {
    if (user?.isAdmin && user.accessToken && response && readyNotify) {
      postNotification({
        type: 'newProduct',
        fromUser: user._id,
        forAdmin: false,
        message: `Новый продукт "${response.title}" добавлен в базу и доступен для заказа.`,
        data: { relatedId: response._id }
    })}
  },[readyNotify])

  const loadProducts = async () => {
    if (user?.isAdmin && user.accessToken) {
      adminRequest<ProductData[]>(dispatch, 'get', '/products', user.accessToken, user.isAdmin, addProducts);
    }
  };

  const loadCategories = async () => {
    if (user?.isAdmin && user.accessToken) {
      adminRequest<CategoryData[]>(dispatch, 'get',  '/categories', user.accessToken, user.isAdmin, addCategories);
    }
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

  const handleCategoryFilterChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedCategory(e.target.value);
  };

  const handleProductTitleChange = (value: string) => {
    setNewProductTitle(value);
    if (!value) setErrorMessage('');
  };
  
  const handleCategoryTitleChange = (value: string) => {
    setNewCategoryTitle(value);
    if (!value) setErrorMessage('');
  };

  const handleCategoryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewProductCategory(e.target.value);
  };
  
  const handleMeasureChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewProductMeasure(e.target.value);
  };

  const addNewProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const existingProduct = products.find(product => product.title === newProductTitle);
    if (existingProduct) {
      setErrorMessage('Такой продукт уже существует');
      return;
    }
    const data = {
      title: newProductTitle,
      category: newProductCategory,
      measure: newProductMeasure,
      quantity: 1,
      price: Number(newProductPrice),
      priceHistory: [{ price:  Number(newProductPrice)}]
    }
    if (user?.isAdmin && user.accessToken) {
      adminRequest<ProductData[], ProductData>(dispatch, 'post','/products/add_product', user?.accessToken, user?.isAdmin, postDataSuccess, data)
      .then(() => {
        loadProducts(); 
        setReadyNotify(true)
      })}
    setNewProductTitle('')
    setNewProductPrice('')
    setErrorMessage('')
    setReadyNotify(false)
  }

  const addNewCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const existingCategory = categories.find(category => category.title === newCategoryTitle);
    if (existingCategory) {
      setErrorMessage('Такая категория уже существует');
      return;
    }
    const data = { title: newCategoryTitle }

    if (user?.isAdmin && user.accessToken) {
      adminRequest<CategoryData[], CategoryData>(dispatch, 'post', '/categories/add_category', user?.accessToken, user?.isAdmin, postDataSuccess, data)
      .then (() => loadCategories())
    }

    setNewCategoryTitle('')
    setErrorMessage('')
  }

  return (
    <div className='infopage'>
      <div className="addContainer">
        <div className="addSpace"> 
            <div className="addForm">
              <form onSubmit={e => addNewProduct(e)} className='newProductForm'>
                <CustomInput 
                  label='Название продукта' 
                  placeholder='Название продукта' 
                  getValue={handleProductTitleChange} 
                  valueProps={newProductTitle}
                  type='text'
                  dark
                />
                <CustomInput 
                  label='Цена' 
                  placeholder='Цена' 
                  getValue={setNewProductPrice}
                  valueProps={newProductPrice} 
                  type='number'
                  dark
                />
                <select 
                  name="cat" 
                  id="cat" 
                  className='customSelect extra-space-top' 
                  onChange={handleCategoryChange}
                >
                  {categories.map(category => <option value={category.title} key={category._id}>{category.title}</option>)}
                </select>
                <select 
                  name="measure" 
                  id="measure" 
                  className='customSelect extra-space-top' 
                  onChange={handleMeasureChange}
                >
                  {measures.map(measure => <option value={measure} key={measure}>{measure}</option>)}
                </select>
                <button className='newDataButton'>Добавить</button>
              </form>
            </div>
            <div className="addForm">
              <form onSubmit={e =>addNewCategory(e)} className='newProductForm'>
                <CustomInput 
                  label='Название категории' 
                  placeholder='Название категории' 
                  getValue={handleCategoryTitleChange} 
                  valueProps={newCategoryTitle}
                  type='text'
                  dark
                />
                <button className='newDataButton'>Добавить</button>
              </form>
          </div>
        </div>
        
      </div>
      {errorMessage ? <div className="error-message"> <PiWarningCircleBold />{errorMessage}</div> : ' '}
      <div className="toolBox">
          <div className="toolBlock">
            <div className="toolBlockTitle">Быстрый поиск по названию продукта</div>
            <input 
              value={searchedProducts}
              onChange={(e) => setSearchedProducts(e.target.value)}  
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
              {categories.map(category => <option value={category.title} key={category._id}>{category.title}</option>)}
            </select>
          </div>
        </div>
      <div className="gridTable">
          <div className="gridHeader tableProduct">
            <div className="headerCell">ID</div>
            <div className="headerCell">Товар</div>
            <div className="headerCell">Категория</div>
            <div className="headerCell centerCell">Фасовка</div>
            <div className="headerCell">Цена</div>
            <div className="headerCell centerCell newPriceAnchor">Изменение цены</div>
            <div className="headerCell iconColumn">Действия</div>
          </div>
          <div className="gridBodyWrapperAdmin">
            <div className="gridBody tableProduct">
              {showProducts.map((product) => 
                <ProductItem product={product} key={product._id} reloadProducts={loadProducts}/>
              )}
            </div>
          </div>
      </div>
    </div>
  )
}

export default AdminProducts