import './App.css'
import './Table.css'
import { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { 
  AdminPanel, 
  Login, 
  PasswordRequest, 
  Home, 
  AdminDashboard, 
  AdminOrders, 
  AdminCustomers, 
  AdminProducts, 
  AdminRequests,
  NewClient,
  UserDashboard,
  UserOrders,
  UserProducts,
  Account
} from './pages';

function App() {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const admin = user?.isAdmin;

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={ user&&admin ? <Navigate to="/admin"/> : user ? <Home /> : <Navigate to="/login"/> } />
          <Route path="/login" element ={ <Login/>} />
          <Route path="/admin" element={user&&admin ?<AdminPanel /> : <Navigate to="/"/>} >
            <Route path="" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="requests" element={<AdminRequests />} />
          </Route>
          <Route path="/user" element={user&&!admin ?<Home /> : <Navigate to="/"/>} >
            <Route path="" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="account" element={<Account />} />
            <Route path="products" element={<UserProducts />} />
            
          </Route>
          <Route path="/reqest_password" element={<PasswordRequest />} />
          <Route path="/new_customer" element={<NewClient />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
