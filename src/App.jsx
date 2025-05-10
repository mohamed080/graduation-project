import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout'
import './App.css'
import Home from './pages/Home';

function App() {


  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
