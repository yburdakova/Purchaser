import { FaRegEye } from 'react-icons/fa6'
import { MdAssignmentAdd, MdOutlineAddTask, MdOutlineCancel, MdOutlinePriceChange } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { InputRefs, ProductData, ProductItemProps } from '../data/types';
import { addProduct, openOrder } from '../redux/orderRedux';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useRef, useState } from 'react';
import { deleteAdminData, postAdminData } from '../redux/apiCalls';
import { postDataSuccess } from '../redux/adminRedux';

const ProductItem = ({product}: ProductItemProps) => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const inputRefs = useRef<InputRefs>({});
  
  const [openPriceFormProductId, setOpenPriceFormProductId] = useState('');
  const [newPrice, setNewPrice] = useState('');

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
  
  const handleUpdatePriceClick = () => {
    const id = product._id as string;
    if (product._id) {
      setOpenPriceFormProductId(product._id)
      setTimeout(() => {
        inputRefs.current[id]?.focus?.();
      }, 0);
    }

  }

  const handleSubmitNewPrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    product._id && handleUpdatePrice(product._id, Number(newPrice))
    setNewPrice('')
    setOpenPriceFormProductId('')
  }

  const handleClickCartButton = (product: ProductData) => {
    const productToAdd = {
      ...product,
      quantity: 1, 
      totalPrice: product.price 
    };
    
    dispatch(addProduct(productToAdd));
    dispatch(openOrder(true))
  }

  const handeDeleteProduct = () => {
    if (user?.isAdmin && user.accessToken && product._id) {
      deleteAdminData<ProductData[]>(dispatch, '/products', product._id, user?.accessToken, user?.isAdmin, postDataSuccess)
    }
  }

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
        { product._id === openPriceFormProductId &&
          <form
            className='newPriceForm'
            onSubmit={(e) => handleSubmitNewPrice(e)}
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
      {user?.isAdmin 
      ? <div className="gridCell iconColumn">
          <div data-tooltip="Изменить цену" className="icon-button" >
            <MdOutlinePriceChange
                size={27}
                className="editPriceIcon" 
                onClick={handleUpdatePriceClick} 
              />
          </div>
          <div data-tooltip="Посмотреть детали" className="inactiveIcon" >
            <FaRegEye size={24}/>
          </div>
          <div data-tooltip="Удалить продукт" className="icon-button" >
            <RiDeleteBin6Line 
                size={24}
                className="deletePriceIcon" 
                onClick={handeDeleteProduct}
            />
          </div>
        </div>
        :  <div className="gridCell iconColumn">
            <div data-tooltip="Добавить в заказ" className="icon-button" >
              <MdAssignmentAdd size={24} onClick={() => product && handleClickCartButton(product)}/>
            </div>
            <div className="inactiveIcon" data-tooltip="Посмотреть детали" >
              <FaRegEye size={24} />
            </div>
          </div>
      }
  </div>
  )
}

export default ProductItem