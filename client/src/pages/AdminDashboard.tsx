import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAdminData } from '../redux/apiCalls';
import { RootState } from '../redux/store';
import { CategoryData, CustomerRequest, ProductData, UserData } from '../data/types';
import { addCategories, addCustomerRequests, addProducts, addUsers } from '../redux/adminRedux';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const requests = useSelector((state: RootState) => state.admin.customerRequests);
  const users = useSelector((state: RootState) => state.admin.users);
  const products = useSelector((state: RootState) => state.admin.products);

  useEffect(() => {
    if (user?.isAdmin && user.accessToken) {
      getAdminData<CustomerRequest[]>(dispatch, '/requests', user.accessToken, user.isAdmin, addCustomerRequests);
      getAdminData<UserData[]>(dispatch, '/users', user?.accessToken, user?.isAdmin, addUsers)
      getAdminData<ProductData[]>(dispatch, '/products', user?.accessToken, user?.isAdmin, addProducts)
      getAdminData<CategoryData[]>(dispatch, '/categories', user?.accessToken, user?.isAdmin, addCategories)
    }
  }, [dispatch, user?.isAdmin]);


  
  return (
    <div className='infopage'>
      <div className="widgetBox">
        {requests&&
          requests.map((request)=>
            <div className="" key={request._id}>{request.name}</div>
          )
        }
      </div>
      <div className="widgetBox">
        {users&&
          users.map((user)=>
            <div className="" key={user._id}>{user.username}</div>
          )
        }
      </div>
      <div className="widgetBox">
        {products&&
          products.map((product)=>
            <div className="" key={product._id}>{product.title}</div>
          )
        }
      </div>
    </div>
  )
}

export default AdminDashboard