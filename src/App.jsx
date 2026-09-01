import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";

import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
  path="/admin"
  element={<AdminDashboard />}
/>
          <Route path="/checkout" element={<Checkout />} />
          <Route
  path="/admin/orders"
  element={<AdminOrders />} />
  <Route
  path="/admin/products"
  element={<AdminProducts />}
/>

          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route
  path="/orders/:id"
  element={<OrderDetails />}
/>
          <Route
 path="/product/:id"
  element={<ProductDetails />}
/>
        </Routes>

      </CartProvider>
    </BrowserRouter>
  );
}

export default App;