import { useEffect, useState } from 'react'
import { CustomerItemProps, ToggleStatusData, UserData } from '../data/types'
import { formatDate } from '../middleware/formatDate'
import { FaRegEye } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi';
import { adminRequest, postNotification } from '../redux/apiCalls';
import { postDataSuccess } from '../redux/adminRedux';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const CustomerItem = ({customer}: CustomerItemProps) => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const [actualContactName, setActualContactName] = useState('');
  const [actualPhoneNumber, setActualPhoneNumber] = useState('');

useEffect(() => {
  if (customer.contacts && customer.contacts.length > 0) {
    const lastIndex = customer.contacts.length - 1;
    setActualContactName(customer.contacts[lastIndex].contactName);
    setActualPhoneNumber(customer.contacts[lastIndex].contactPhone);
  }
},[customer])

const handeDelete = () => {

}

const inactivate = (id: string) => {
  if (user?.isAdmin && user.accessToken) {
    adminRequest<UserData[], ToggleStatusData>(dispatch, 'patch', `/switch-status/${id}`, user?.accessToken, user?.isAdmin, postDataSuccess, { isActive: false })
  }
  postNotification({
    toUser: id,
    type: 'statusChange',
    forAdmin: false,
    message: `Ваш статус клиента был изменен на "Отключен". Вы не можете формировать заявки.`,
  });
}

const activate = (id: string) => {
  if (user?.isAdmin && user.accessToken) {
    adminRequest<UserData[], ToggleStatusData>(dispatch, 'patch', `/switch-status/${id}`, user?.accessToken, user?.isAdmin, postDataSuccess, { isActive: true })
  }
  postNotification({
    toUser: id,
    type: 'statusChange',
    forAdmin: false,
    message: `Ваш статус клиента был изменен на "Подключен". Вы можете формировать заявки.`,
  });
}

  return (
    <div className="gridRow" key={customer._id} id={customer._id}>
      <div className="gridCell">{formatDate(customer.createdAt?.toString())}</div>
      <div className="gridCell">{customer.title}</div>
      <div className="gridCell">{customer.email}</div>
      <div className="gridCell">{actualContactName}</div>
      <div className="gridCell">{actualPhoneNumber}</div>
      <div className={`gridCell centerCell ${customer.isActive ? "green" : "red"}`}>{customer.isActive ? "Подключен" : "Отключен"}</div>
      <div className="gridCell iconColumn">
        { !customer.isActive
          ? <div data-tooltip="Подключить клиента" className="icon-button">
              <BiToggleLeft size={30} onClick={() => customer._id && inactivate(customer._id)}/>
            </div>
          : <div data-tooltip="Отключить клиента" className="icon-button" >
              <BiToggleRight size={30} onClick={() => customer._id && activate(customer._id)}/>
            </div>
        }
        <div data-tooltip="Детали" className="inactiveIcon" >
          <FaRegEye size={24}/>
        </div>
        <div data-tooltip="Удалить продукт" className="icon-button" >
          <RiDeleteBin6Line 
              size={24}
              className="deletePriceIcon" 
              onClick={handeDelete}
          />
        </div>
      </div>
  </div>
  )
}

export default CustomerItem