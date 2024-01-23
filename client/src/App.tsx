import './App.css'
import { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminPanel, Login, PasswordRequest, Home } from './pages';

function App() {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const admin = user?.isAdmin;

  console.log(user, admin)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element ={ user && admin ?  <Navigate to="/admin"/> : user ? <Home /> :  <Navigate to="/login"/>} />
        <Route path="/reqest_password" element={<PasswordRequest/>} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
