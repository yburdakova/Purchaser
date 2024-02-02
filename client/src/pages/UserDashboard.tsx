import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CategoryData, ProductData } from '../data/types';
import { getUsersData } from '../redux/apiCalls';

const UserDashboard = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const orderProducts = useSelector((state: RootState) => state.order.products)
  
  const [productList, setProductList] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(()=>{
    getUsersData("products", setProductList)
    getUsersData("categories", setCategories)
  }, [user]);

  return (
    <div className='infopage'>
      UserDashboard
      <div className="">{productList.length}</div>
      <div className="">{categories.length}</div>
      {orderProducts.map((product) => 
        <div className="" key={product._id}>{product.title}</div>
      )}
    </div>
  )
}

export default UserDashboard