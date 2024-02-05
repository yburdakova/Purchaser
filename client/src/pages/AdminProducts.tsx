import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CustomInput, ProductItem} from '../components';
import { CategoryData, ProductData } from '../data/types';
import { IoSearch } from "react-icons/io5";
import { measures } from '../data/constants';
import { adminRequest } from '../redux/apiCalls';
import { addCategories, addProducts, postDataSuccess } from '../redux/adminRedux';
import { PiWarningCircleBold } from 'react-icons/pi';

const AdminProducts = () => {
  
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const products = useSelector((state: RootState) => state.admin.products);
  const categories = useSelector((state: RootState) => state.admin.categories);
  
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const[showCategories, setShowCategories] =useState<CategoryData[]>(categories)
  const [searchedProducts, setSelectedProducts] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [newProductTitle, setNewProductTitle] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductCategory, setNewProductCategory] = useState(categories[0]?.title || '')
  const [newProductMeasure, setNewProductMeasure] = useState(measures[0] || '')
  const [newCategoryTitle, setNewCategoryTitle] = useState('')

  useEffect(() => {
    setShowProducts(products);
  }, [products]);
  
  useEffect(() => {
    setShowCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (user?.isAdmin && user.accessToken && products.length === 0) {
      adminRequest<ProductData[]>(dispatch, 'get', '/products', user.accessToken, user.isAdmin, addProducts);
    }
    setShowProducts(products);
  }, [dispatch, user?.isAdmin, user?.accessToken, products]);

  useEffect(() => {
    if (user?.isAdmin && user.accessToken && categories.length === 0) {
      adminRequest<CategoryData[]>(dispatch, 'get',  '/categories', user.accessToken, user.isAdmin, addCategories);
    }
    setShowCategories(categories);
  }, [dispatch, user?.isAdmin, user?.accessToken, categories]);

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
    console.log("Selected category:", e.target.value);
    setNewProductCategory(e.target.value);
  };
  
  const handleMeasureChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    console.log("Selected measure:", e.target.value);
    setNewProductMeasure(e.target.value);
  };

  const addNewProduct = (e: React.FormEvent) => {
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
      priceHistory: [
        { price:  Number(newProductPrice)}
      ]
    }

    if (user?.isAdmin && user.accessToken) {
      adminRequest<ProductData[], ProductData>(dispatch, 'post','/products/add_product', user?.accessToken, user?.isAdmin, postDataSuccess, data)
      adminRequest<ProductData[]>(dispatch, 'get', '/products', user?.accessToken, user?.isAdmin, addProducts)
    }
    setNewProductTitle('')
    setNewProductPrice('')
    setErrorMessage('');
  }

  const addNewCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const existingCategory = categories.find(category => category.title === newCategoryTitle);
    if (existingCategory) {
      setErrorMessage('Такая категория уже существует');
      return;
    }

    const data = {
      title: newCategoryTitle,
    }

    if (user?.isAdmin && user.accessToken) {
      adminRequest<CategoryData[], CategoryData>(dispatch, 'get', '/categories/add_category', user?.accessToken, user?.isAdmin, postDataSuccess, data)
    }
    setNewCategoryTitle('')
    setErrorMessage('');
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
                  {showCategories.map(category => <option value={category.title} key={category._id}>{category.title}</option>)}
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
                <ProductItem product={product} key={product._id}/>
              )}
            </div>
          </div>
      </div>
    </div>
  )
}

export default AdminProducts