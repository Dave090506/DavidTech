import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function AuthLayout({ cart, wishlist }) {
  return (
    <>
      <Navbar cart={cart} wishlist={wishlist} />

      <Outlet />
    </>
  );
}

export default AuthLayout;
