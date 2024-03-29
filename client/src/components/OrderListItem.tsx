import  { useEffect, useState } from 'react'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti'
import { OrderListItemProps } from '../data/types'
import { useDispatch } from 'react-redux';
import { deleteProduct, updateProductQuantity } from '../redux/orderRedux';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { formatPrice } from '../middleware/formatPrice';

const OrderListItem = ({product, index, createdOrder}: OrderListItemProps) => {
  
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.quantity);
  const max  = 1000;

useEffect(() => {
  dispatch(updateProductQuantity({ productId: product._id, quantity: quantity }));
}, [product._id, quantity, dispatch])

  const handleClickIncrease = () => {
    if (quantity && quantity < max) {
      setQuantity(quantity + 1);
    }
  };

  const handleClickDecrease = () => {
    if (quantity && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleDelete = () => {
    dispatch(deleteProduct(({ productId: product._id })));
  };

  return (
    <tr key={product._id}>
      <td>{index + 1}.</td>
      <td>{product.title}</td>
      <td>{formatPrice(product.price)} ₽</td>
      <td>x</td>
      <td className='costBox'>
        {createdOrder
        ? <div className="">{product.quantity} {product.measure}</div>
        : <div className="quantityBox">
            <input type="text" className="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}/>
            <div className="priceButtons">
              <div className="priceButtonsIcon">
                <TiArrowSortedUp size={20} onClick={handleClickIncrease}/>
              </div>
              <div className="priceButtonsIcon">
                <TiArrowSortedDown size={20} onClick={handleClickDecrease}/>
              </div>
              
            </div>
          </div>
        }
      </td>
      <td> = </td>
      <td> {formatPrice(product.price * quantity)} ₽</td>
      <td>
        {createdOrder 
        ? " "
        :<div className="orderItemDel">
          <RiDeleteBin6Line size={24} onClick={handleDelete}/>
        </div>}
      </td>
  </tr>
  )
}

export default OrderListItem