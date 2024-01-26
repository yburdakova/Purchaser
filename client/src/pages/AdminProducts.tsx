import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CustomInput, TableRow } from '../components';
import { ProductData } from '../data/types';
import { IoSearch } from "react-icons/io5";
import { measures } from '../data/constants';
const AdminProducts = () => {

  const products = useSelector((state: RootState) => state.admin.products);
  const categories = useSelector((state: RootState) => state.admin.categories);
  
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const [searchedProducts, setSelectedProducts] = useState('')

  const [showNewProductWindow, setNewProductWindow] = useState(true)
  const [showNewCategoryWindow, setNewCategoryWindow] = useState(true)
  const [newProductTitle, setNewProductTitle] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newCategoryTitle, setNewCategoryTitle] = useState('')

  const addNewProduct = () => {
    console.log("Added new product")
  }

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


  const addNewCategory = () => {
    console.log("Added new product")
  }
  
  return (
    <div className='infopage'>
      <div className="addSpace">
        <div className="formSpace">
          {showNewCategoryWindow&&
          <div className="addForm">
            <form onSubmit={addNewCategory} className='newProductForm'>
              <CustomInput label='Название категории' placeholder='Название категории' getValue={setNewCategoryTitle} type='text'/>
              <button className='newDataButton'>Добавить</button>
            </form>
          </div>
            
          }
          {showNewProductWindow&&
            <div className="addForm">
              <form onSubmit={addNewProduct} className='newProductForm'>
                <CustomInput label='Название продукта' placeholder='Название продукта' getValue={setNewProductTitle} type='text'/>
                <CustomInput label='Цена' placeholder='Цена' getValue={setNewProductPrice} type='number'/>
                <select name="" id="" className='customSelect'>
                  {categories.map(category => <option value={category.title} key={category._id}>{category.title}</option>)}
                </select>
                <select name="" id="" className='customSelect'>
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
      <div className="tableSpace">
        <input value={searchedProducts}/><IoSearch />
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