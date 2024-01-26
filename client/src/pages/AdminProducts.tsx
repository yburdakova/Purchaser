import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { TableRow } from '../components';
import { ProductData } from '../data/types';
import { IoSearch } from "react-icons/io5";

const AdminProducts = () => {

  const products = useSelector((state: RootState) => state.admin.products);
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const [searchedProducts, setSelectedProducts] = useState('')
  
  return (
    <div className='infopage'>
      <div className="">
        <button>ДОБАВИТЬ ПРОДУКТ</button>
        <button>ДОБАВИТЬ КАТЕГОРИЮ</button>
      </div>
      <div className="">
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
          {showProducts.map((product) => <TableRow key={product._id} product={product} />)}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProducts