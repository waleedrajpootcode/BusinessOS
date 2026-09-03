import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
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
import AdminRoute from "./components/AdminRoute";
import Invoice from "./pages/Invoice";
import Users from "./pages/Users";
import BusinessSetup from "./pages/BusinessSetup";
import BusinessSettings from "./pages/BusinessSettings";
import Employees from "./pages/Employees";
import PurchaseDetails from "./pages/PurchaseDetails";
import EditPurchase from "./pages/EditPurchase";
import AIAdvisor from "./pages/AIAdvisor";
import AIAssistantWidget from "./components/ai/AIAssistantWidget";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Business Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-advisor"
          element={
            <ProtectedRoute>
              <AIAdvisor />
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
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
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
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Suppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          }
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
          element={
            <ProtectedRoute>
              <EditPurchase />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
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

        {/* Public Customer Invoice */}
        <Route
          path="/invoice/:id"
          element={<Invoice />}
        />

        {/* Protected Business Setup */}
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

      {/* Global AI Assistant */}
      <ProtectedRoute>
        <AIAssistantWidget />
      </ProtectedRoute>
    </>
  );
}

export default App;