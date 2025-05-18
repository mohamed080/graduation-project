import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout'
import './App.css'
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import VerificationCode from './pages/VerificationCode';
import ResetPassword from './pages/ResetPassword';
function App() {


  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
        </Route>
        <Route>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path="/verification-code" element={<VerificationCode />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}

export default App
