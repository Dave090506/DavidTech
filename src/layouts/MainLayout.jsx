import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ cart, wishlist }) {
  const location = useLocation();

  const footerPages = ["/", "/products", "/about", "/contact"];

  const showFooter = footerPages.includes(location.pathname);
  return (
    <>
      <Navbar cart={cart} wishlist={wishlist} />

      <Outlet />

      {showFooter && <Footer />}
    </>
  );
}

export default MainLayout;
