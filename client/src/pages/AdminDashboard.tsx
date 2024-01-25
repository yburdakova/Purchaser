import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAdminData } from '../redux/apiCalls';
import { RootState } from '../redux/store';
import { customerRequest } from '../data/types';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const requests = useSelector((state: RootState) => state.admin.customerRequests);

  useEffect(() => {
    if (user?.isAdmin && user.accessToken) {
      getAdminData(dispatch, '/requests', user?.accessToken, user?.isAdmin)
    }
  }, [dispatch]);


  
  return (
    <div className='infopage'>adminDashboard
      <div className="widgetBox">
        {requests&&
          requests.map((request: customerRequest)=>
            <div className="">{request.name}</div>
          )
        }
      </div>
    </div>
  )
}

export default AdminDashboard