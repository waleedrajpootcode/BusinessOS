import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import CustomerLedger from "./pages/CustomerLedger";
import SupplierLedger from "./pages/SupplierLedger";
import Sales from "./pages/Sales";
import Suppliers from "./pages/Suppliers";
import Purchases from "./pages/Purchases";
import Inventory from "./pages/Inventory";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AdminRoute from "./components/AdminRoute";
import Invoice from "./pages/Invoice";
import Users from "./pages/Users";
import BusinessSetup from "./pages/BusinessSetup";
import BusinessSettings from "./pages/BusinessSettings";
import Employees from "./pages/Employees";
import PurchaseDetails from "./pages/PurchaseDetails";
import EditPurchase from "./pages/EditPurchase";

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
          path="/customer-ledger/:id"
          element={
            <ProtectedRoute>
              <CustomerLedger />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier-ledger/:id"
          element={
            <ProtectedRoute>
              <SupplierLedger />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={<Sales />}
        />
        <Route
          path="/suppliers"
          element={<Suppliers />}
        />
        <Route
          path="/purchases"
          element={<Purchases />}
        />
        <Route
          path="/purchases/:id"
          element={
            <ProtectedRoute>
              <PurchaseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases/:id/edit"
          element={<EditPurchase />}
        />

        <Route
          path="/inventory"
          element={<Inventory />}
        />
        <Route
          path="/expenses"
          element={<Expenses />}
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Reports />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Users />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Employees />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Settings />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice/:id"
          element={<Invoice />}
        />

        <Route
          path="/business-setup"
          element={
            <ProtectedRoute>
              <BusinessSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/business-settings"
          element={
            <ProtectedRoute>
              <BusinessSettings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  )
}

export default App
