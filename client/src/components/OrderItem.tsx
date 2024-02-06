import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { MdOutlinePaid, MdPrint } from 'react-icons/md';
import { OrderData, OrderItemAdmProps } from '../data/types';
import { postDataSuccess } from '../redux/adminRedux';
import { adminRequest, postNotification } from '../redux/apiCalls';
import { formatDate } from '../middleware/formatDate';
import { AiOutlineFileAdd, AiOutlineFileDone, AiOutlineFileExcel } from 'react-icons/ai';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { useState } from 'react';
import { OrderListItem } from '.';
import { formatId } from '../middleware/formatId';

const OrderItem = ({order, reloadOrders}: OrderItemAdmProps) => {
  const dispatch = useDispatch();
  const focusedId = useSelector((state: RootState) => state.notifications.focusedId);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const users = useSelector((state: RootState) => state.admin.users);
  const customer = users.find(user => user._id === order.userId)

  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  
  
  const updateOrderStatus = (newStatus: string) => {
    const data = {
      status: newStatus
    }
    if (user?.isAdmin && user.accessToken) {
      adminRequest<OrderData[], OrderData>(dispatch, 'put', `/orders/${order._id}`, user?.accessToken, user?.isAdmin, postDataSuccess, data)
      .then (() => {
        reloadOrders && reloadOrders();
        postNotification({
          type: 'orderStatusChange',
          toUser: order.userId,
          forAdmin: false,
          message: `Статус вашей Зявки № ${order._id && formatId(order._id)} изменился. Заявка ${newStatus}. `,
      });}
      )
      
    }
  }

  const availableActions = () => {
    switch (order.status) {
      case 'На рассмотрении':
        return (
          <>
            <div data-tooltip="Подтвердить заявку" className="icon-button">
              <AiOutlineFileAdd size={24} onClick={() => updateOrderStatus("Подтверждена")} />
            </div>
            <div data-tooltip="Аннулировать" className="icon-button">
              <AiOutlineFileExcel size={24} onClick={() => updateOrderStatus("Аннулирована")} />
            </div>
          </>
        );
      case 'Подтверждена':
        return (
          <>
            <div data-tooltip="Подтвердить отплату" className="icon-button">
              <MdOutlinePaid size={24} onClick={() => updateOrderStatus("Оплачена")} />
            </div>
            <div data-tooltip="Аннулировать" className="icon-button">
              <AiOutlineFileExcel size={24} onClick={() => updateOrderStatus("Аннулирована")} />
            </div>
          </>
        );
      case 'Оплачена':
        return (
          <div data-tooltip="Подтвердить выполнение" className="icon-button">
          <AiOutlineFileDone size={24} onClick={() => updateOrderStatus("Выполнена")} />
          </div>
        )
          
      case 'Аннулирована':
        return null;
      default:
        return null;
    }
  }
  
  return (
    <div className="">
      <div className={`orderItem flexListItem ${focusedId === order._id && `flexListItem flexListItemFocused`}`}>
        <div className={`colorLabel       
          ${order.status === "На рассмотрении" ? "orangeButton" 
          : order.status === "Подтверждена" ? "violetButton" 
          : order.status === "Оплачена" ? "purpleButton" 
          : order.status === "Аннулирована" ? "redButton" 
          : order.status === "Выполнена" ? "greenButton" : "regularButton "}`}>
        </div>
        { user?.isAdmin && <div className="">"{customer?.title}"</div>}
        <div className="">Заявка № {order._id && formatId(order._id)}</div>
        <div className="">от {order.createdAt && formatDate(order.createdAt.toString())}</div>
        <div className=""> на сумму {order.amount && order.amount.toFixed(2)} ₽</div>
        <div className=""> {order.status}</div>
        <div data-tooltip="Посмотреть детали" className="icon-button" onClick={toggleDetails}>
          {showDetails ? <FaRegEyeSlash size={24}/> : <FaRegEye size={24}/> }
        </div>
        <div data-tooltip="Распечатать заявку" className="icon-button">
          <MdPrint size={24}/>
        </div>
        {user?.isAdmin && availableActions()}
      </div>
      {showDetails &&
        <div className="odredDetails">
        <div className="">Детали заявки:</div>
        <table>
          <tbody>
            {order.products && order.products.map((product, index) => 
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