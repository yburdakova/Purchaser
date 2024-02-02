import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CustomInput} from '../components';
import { CategoryData, InputRefs, ProductData } from '../data/types';
import { IoSearch } from "react-icons/io5";
import { measures } from '../data/constants';
import { deleteAdminData, getAdminData, postAdminData } from '../redux/apiCalls';
import { addCategories, addProducts, postDataSuccess } from '../redux/adminRedux';
import { MdOutlineAddTask, MdOutlineCancel, MdOutlinePriceChange } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';
import { PiWarningCircleBold } from 'react-icons/pi';

const AdminProducts = () => {
  
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const products = useSelector((state: RootState) => state.admin.products);
  const categories = useSelector((state: RootState) => state.admin.categories);
  const inputRefs = useRef<InputRefs>({});
  
  const [showProducts, setShowProducts] = useState<ProductData[]>(products)
  const[showCategories, setShowCategories] =useState<CategoryData[]>(categories)
  const [searchedProducts, setSelectedProducts] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [openPriceFormProductId, setOpenPriceFormProductId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCategoryFilterChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedCategory(e.target.value);
  };

  const [newProductTitle, setNewProductTitle] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductCategory, setNewProductCategory] = useState(categories[0]?.title || '')
  const [newProductMeasure, setNewProductMeasure] = useState(measures[0] || '')
  const [newCategoryTitle, setNewCategoryTitle] = useState('')

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
      postAdminData<ProductData[], ProductData>(dispatch, '/products/add_product', data, user?.accessToken, user?.isAdmin, postDataSuccess)
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
      postAdminData<CategoryData[], CategoryData>(dispatch, '/categories/add_category', data, user?.accessToken, user?.isAdmin, postDataSuccess)
    }
    setNewCategoryTitle('')
    setErrorMessage('');
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
    setTimeout(() => {
      inputRefs.current[id]?.focus?.();
    }, 0);
  }

  const handleSubmitNewPrice = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    handleUpdatePrice(id, Number(newPrice))
    setNewPrice('')
    setOpenPriceFormProductId('')
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
          <div className="gridHeader">
            <div className="headerCell">ID</div>
            <div className="headerCell">Товар</div>
            <div className="headerCell">Категория</div>
            <div className="headerCell centerCell">Фасовка</div>
            <div className="headerCell">Цена</div>
            <div className="headerCell centerCell">Изменение цены</div>
            <div className="headerCell iconColumn">Действия</div>
          </div>
          <div className="gridBodyWrapperAdmin">
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
                <div className="gridCell priceCell">
                  {priceDifference !== null && 
                    <div className={priceDifference > 0 ?'green pp' : 'red pp'}>
                      <div className="">{priceDifference.toFixed(2)} ₽</div>
                      <div className="iconContainer">
                        {priceDifference > 0 ? <IoIosArrowRoundUp size={22} /> : <IoIosArrowRoundDown size={22} />}
                      </div>
                    </div>
                  }
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
                        step="0.01"
                        ref={(el) => {
                          if (product._id) inputRefs.current[product._id] = el;
                        }}
                      />
                      <div className="newPriceFormButtons">
                        <button type="submit"> <MdOutlineAddTask /></button>
                        <button onClick={() => (setOpenPriceFormProductId(''), setNewPrice(''))}> <MdOutlineCancel /></button>
                      </div>
                      
                    </form>
                  }
                </div>
                <div className="gridCell iconColumn">
                <div data-tooltip="Изменить цену" className="icon-button" >
                  <MdOutlinePriceChange
                      size={27}
                      className="editPriceIcon" 
                      onClick={() => product._id && handleUpdatePriceClick(product._id)} 
                    />
                </div>
                <div data-tooltip="Посмотреть детали" className="inactiveIcon" >
                  <FaRegEye size={24}/>
                </div>
                <div data-tooltip="Удалить продукт" className="icon-button" >
                  <RiDeleteBin6Line 
                      size={24}
                      className="deletePriceIcon" 
                      onClick={() => product._id && handeDeleteProduct(product._id)}
                  />
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
  )
}

export default AdminProducts