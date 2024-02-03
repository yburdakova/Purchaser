import { useState } from 'react'
import { formatPrice } from '../middleware/formatPrice'
import { formatDate } from '../middleware/formatDate'
import { OrderItemProps } from '../data/types'
import { OrderListItem } from '.'

const OrderItem = ({order}: OrderItemProps) => {

  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  
  return (
    <div className="orderPageItem">
    <div className="orderSummary">
      <div className="">Заказ № {order._id && order._id.slice(-8)}</div>
      <div className="">На сумму: {formatPrice(order.amount)}  ₽</div>
      <div className="">от {order.createdAt && formatDate(order.createdAt.toString())}</div>
      <div className="">{order.status}</div>
      <button onClick={toggleDetails}>{showDetails ? "Скрыть" : "Показать"} детали заявки</button>
    </div>
    {showDetails &&
      <div className="odredDetails">
      <div className="">Детали заявки:</div>
      <table>
        <tbody>
          {order.products.map((product, index) => 
            <OrderListItem product={product} index={index} key={`${product._id}_${product.quantity}`} createdOrder/>
          )}
        </tbody>
      </table>
      </div>
    }
    
  </div>
  )
}

export default OrderItem