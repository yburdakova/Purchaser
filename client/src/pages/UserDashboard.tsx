import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { getAdminData } from '../redux/apiCalls';
import { addProducts } from '../redux/adminRedux';
import { ProductData } from '../data/types';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const products = useSelector((state: RootState) => state.admin.products);

  useEffect(() => {
    if (user?.isAdmin && user.accessToken) {
      getAdminData<ProductData[]>(dispatch, '/products', user?.accessToken, user?.isAdmin, addProducts)
    }
  }, [dispatch, user?.isAdmin, user?.accessToken]);

  return (
    <div className='infopage'>
      UserDashboard
      <div className="">{products.length}</div>
    </div>
  )
}

export default UserDashboard