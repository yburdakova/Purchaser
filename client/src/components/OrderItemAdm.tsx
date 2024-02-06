import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FaRegEye } from 'react-icons/fa6';
import { MdPrint } from 'react-icons/md';
import { LuFileCheck } from 'react-icons/lu';
import { OrderData, OrderItemAdmProps } from '../data/types';
import { postDataSuccess } from '../redux/adminRedux';
import { adminRequest, postNotification } from '../redux/apiCalls';

const OrderItemAdm = ({order, reloadOrders}: OrderItemAdmProps) => {
  const dispatch = useDispatch();
  const focusedId = useSelector((state: RootState) => state.notifications.focusedId);
  const user = useSelector((state: RootState) => state.user.currentUser);
  
  const handleUpdateStatus = () => {
    const data = {
      status: "Подтверждена"
    }
    if (user?.isAdmin && user.accessToken) {
      adminRequest<OrderData[], OrderData>(dispatch, 'put', `/orders/${order._id}`, user?.accessToken, user?.isAdmin, postDataSuccess, data)
      .then (() => {
        reloadOrders && reloadOrders();
        postNotification({
          type: 'orderStatusChange',
          toUser: order.userId,
          forAdmin: false,
          message: `Статус вашей Зявки № ${order._id} изменился. Заявка подтверждена. `,
      });}
      )
      
    }
  }
  
  return (
    <div className={focusedId === order._id? `flexListItem flexListItemFocused` : "flexListItem"}>
      <div className="">Заявка № {order._id}</div>
      <div className=""> на сумму {order.amount}</div>
      <div className=""> на сумму {order.status}</div>
      <div data-tooltip="Посмотреть детали" className="icon-button">
        <FaRegEye size={24}/>
      </div>
      <div data-tooltip="Распечатать заявку" className="icon-button">
        <MdPrint size={24}/>
      </div>
      <div data-tooltip="Подтвердить заявку" className="icon-button">
        <LuFileCheck size={24} onClick={handleUpdateStatus} />
      </div>
      <div className="">

      </div>
    </div>
  )
}

export default OrderItemAdm