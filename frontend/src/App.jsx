import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }

        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={<Customers />}
        />
        <Route
          path="/sales"
          element={<Sales />}
        />

      </Routes>
    </>
  )
}

export default App
