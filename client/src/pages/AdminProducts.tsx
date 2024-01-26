import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CustomInput, TableRow } from '../components';
import { CategoryData, ProductData } from '../data/types';
import { IoSearch } from "react-icons/io5";
import { measures } from '../data/constants';
import { getAdminData, postAdminData } from '../redux/apiCalls';
import { addCategories, addProducts, postDataSuccess } from '../redux/adminRedux';

const AdminProducts = () => {
  
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const products = useSelector((state: RootState) => state.admin.products);
  const categories = useSelector((state: RootState) => state.admin.categories);
  
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const[showCategories, setShowCategories] =useState<CategoryData[]>(categories)
  const [searchedProducts, setSelectedProducts] = useState('')

  const [showNewProductWindow, setNewProductWindow] = useState(false)
  const [showNewCategoryWindow, setNewCategoryWindow] = useState(false)
  const [newProductTitle, setNewProductTitle] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductCategory, setNewProductCategory] = useState(categories[0]?.title || '')
  const [newProductMeasure, setNewProductMeasure] = useState(measures[0] || '')
  const [newCategoryTitle, setNewCategoryTitle] = useState('')

  useEffect(() => {
    if (user?.isAdmin && user.accessToken) {
      getAdminData<ProductData[]>(dispatch, '/products', user?.accessToken, user?.isAdmin, addProducts)
    }
    setShowProducts(products);
  }, [products]);

  useEffect(() => {
    if (user?.isAdmin && user.accessToken) {
      getAdminData<CategoryData[]>(dispatch, '/categories', user?.accessToken, user?.isAdmin, addCategories)
    }
    setShowCategories(categories);
  }, [categories]);

  const handleClickToggleProductButton = () => {
    if (showNewCategoryWindow) {
      setNewCategoryWindow (false)
    }
    if (showNewProductWindow) {
      setNewProductWindow (false)
    } else {
      setNewProductWindow (true)
    }
  }

  const handleClickToggleCategoryButton = () => {
    if (showNewProductWindow) {
      setNewProductWindow (false)
    }
    if (showNewCategoryWindow) {
      setNewCategoryWindow (false)
    } else {
      setNewCategoryWindow (true)
    }
  }

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
    const data = {
      title: newProductTitle,
      category: newProductCategory,
      measure: newProductMeasure,
      price: newProductPrice
    }

    if (user?.isAdmin && user.accessToken) {
      postAdminData<ProductData[]>(dispatch, '/products/add_product', data, user?.accessToken, user?.isAdmin, postDataSuccess)
    }
    setNewProductTitle('')
    setNewProductPrice('')
    console.log("Added new product")
  }

  const addNewCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      title: newCategoryTitle,
    }

    if (user?.isAdmin && user.accessToken) {
      postAdminData<CategoryData[]>(dispatch, '/categories/add_category', data, user?.accessToken, user?.isAdmin, postDataSuccess)
    }
    setNewCategoryTitle('')
    console.log("Added new category")
  }
  
  return (
    <div className='infopage'>
      <div className="addSpace">
        <div className="formSpace">
          {showNewCategoryWindow&&
          <div className="addForm">
            <form onSubmit={e =>addNewCategory(e)} className='newProductForm'>
              <CustomInput 
                label='Название категории' 
                placeholder='Название категории' 
                getValue={setNewCategoryTitle} 
                valueProps={newCategoryTitle}
                type='text'
              />
              <button className='newDataButton'>Добавить</button>
            </form>
          </div>
            
          }
          {showNewProductWindow&&
            <div className="addForm">
              <form onSubmit={e => addNewProduct(e)} className='newProductForm'>
                <CustomInput 
                  label='Название продукта' 
                  placeholder='Название продукта' 
                  getValue={setNewProductTitle} 
                  valueProps={newProductTitle}
                  type='text'
                />
                <CustomInput 
                  label='Цена' 
                  placeholder='Цена' 
                  getValue={setNewProductPrice}
                  valueProps={newProductPrice} 
                  type='number'
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
          }
        </div>
        <div className="buttonSpace">
          <button onClick={handleClickToggleProductButton} className='addButton'>
            {showNewProductWindow? 'ЗАКРЫТЬ ФОРМУ' : 'ДОБАВИТЬ ПРОДУКТ'}
            </button>
          <button onClick={handleClickToggleCategoryButton} className='addButton2'>
            {showNewCategoryWindow? 'ЗАКРЫТЬ ФОРМУ' : 'ДОБАВИТЬ КАТЕГОРИЮ'}
          </button>
        </div>
      </div>
      <div className="tools">
        <div className="block">
          <div className="">Выбрать категорию</div>
          <select name="" id="" className='customSelect'>
            {showCategories.map(category => <option value={category.title} key={category._id}>{category.title}</option>)}
          </select>
        </div>
        <div className="block">
          <div className="">Быстрый поиск по названию продукта</div>
          <input onChange={(e) => setSelectedProducts(e.target.value)}  className='prodInput'/>
          <IoSearch className='seachIcon'/>
        </div>
      </div>
      <div className="tableSpace">
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Товар</th>
            <th>Категория</th>
            <th>Фасовка</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {showProducts.map((product) => <TableRow key={product._id} rowData={product} />)}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProducts