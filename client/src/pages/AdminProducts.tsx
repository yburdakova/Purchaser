import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CustomInput} from '../components';
import { CategoryData, ProductData } from '../data/types';
import { IoSearch } from "react-icons/io5";
import { measures } from '../data/constants';
import { deleteAdminData, getAdminData, postAdminData } from '../redux/apiCalls';
import { addCategories, addProducts, postDataSuccess } from '../redux/adminRedux';
import { MdOutlineAddTask, MdOutlineCancel, MdOutlinePriceChange } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';

const AdminProducts = () => {
  
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const products = useSelector((state: RootState) => state.admin.products);
  const categories = useSelector((state: RootState) => state.admin.categories);
  
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const[showCategories, setShowCategories] =useState<CategoryData[]>(categories)
  const [searchedProducts, setSelectedProducts] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [openPriceFormProductId, setOpenPriceFormProductId] = useState('');

  const handleCategoryFilterChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedCategory(e.target.value);
  };

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

  useEffect(() => {
    let filteredProducts = products;
  
    if (selectedCategory && selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter(product =>
        product.category === selectedCategory
      );
    }
  
    if (searchedProducts) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchedProducts.toLowerCase())
      );
    }
  
    setShowProducts(filteredProducts);
  }, [selectedCategory, searchedProducts, products]);

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
      price: Number(newProductPrice)
    }

    if (user?.isAdmin && user.accessToken) {
      postAdminData<ProductData[], ProductData>(dispatch, '/products/add_product', data, user?.accessToken, user?.isAdmin, postDataSuccess)
    }
    setNewProductTitle('')
    setNewProductPrice('')
  }

  const addNewCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      title: newCategoryTitle,
    }

    if (user?.isAdmin && user.accessToken) {
      postAdminData<CategoryData[], CategoryData>(dispatch, '/categories/add_category', data, user?.accessToken, user?.isAdmin, postDataSuccess)
    }
    setNewCategoryTitle('')
  }

  const handeDeleteProduct = (id:string) => {
    if (user?.isAdmin && user.accessToken) {
      deleteAdminData<ProductData[]>(dispatch, '/products', id, user?.accessToken, user?.isAdmin, postDataSuccess)
    }
  }

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    if (user?.isAdmin && user.accessToken) {
      const bodyObj = { newPrice };
      postAdminData<ProductData, { newPrice: number }>(
        dispatch,
        `/products/update-price/${productId}`,
        bodyObj,
        user.accessToken,
        user.isAdmin,
        postDataSuccess
      );
    }
  };
  
  const handleUpdatePriceClick = (id:string) => {
    setOpenPriceFormProductId(id)
  }

  const handleSubmitNewPrice = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    handleUpdatePrice(id, Number(newPrice))
    setNewPrice('')
    setOpenPriceFormProductId('')
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
        <div className="block">
          <div className="">Быстрый поиск по названию продукта</div>
          <input 
            value={searchedProducts}
            onChange={(e) => setSelectedProducts(e.target.value)}  
            className='prodInput'
          />
          <IoSearch className='seachIcon'/>
        </div>
      </div>
      <div className="tableSpace">
      </div>
      <table className='purTable'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Товар</th>
            <th>Категория</th>
            <th>Фасовка</th>
            <th>Цена</th>
            <th></th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody className='tableBody'>
          {showProducts.map((product) => 
            <tr className='rowTable' key={product._id}>
              <td>{product.customId}</td>
              <td>{product.title}</td>
              <td>{product.category}</td>
              <td>{product.measure}</td>
              <td >{product.price} ₽</td>
              <td className='priceCell'>
              { product._id === openPriceFormProductId &&
                <form
                  className='newPriceForm'
                  onSubmit={(e) => product._id && handleSubmitNewPrice(e, product._id)}
                >
                  <input
                    className='newPriceInput'
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                  <div className="newPriceFormButtons">
                    <button type="submit"> <MdOutlineAddTask /></button>
                    <button onClick={() => (setOpenPriceFormProductId(''), setNewPrice(''))}> <MdOutlineCancel /></button>
                  </div>
                  
                </form>
              }
              </td>
              <td className='iconTableCell'>
                <MdOutlinePriceChange 
                  className="editPriceIcon" 
                  onClick={() => product._id && handleUpdatePriceClick(product._id)} 
                />
                <FaRegEye />
                <RiDeleteBin6Line onClick={() => product._id && handeDeleteProduct(product._id)}/>
              </td>
          </tr>
          )}

        </tbody>
      </table>
    </div>
  )
}

export default AdminProducts