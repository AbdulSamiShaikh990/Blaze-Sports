import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CarouselPage from "../CarouselPage"; // ✅ Hero Section (Carousel)
import Sidebar from "../Sidebar";
import FeaturedProducts from "./FeaturedProducts";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we have a scrollTo parameter in the location state
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      // Clear the scrollTo parameter from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="main-content" style={{ width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
      <Sidebar />
      <div className="page-content" style={{ width: '100vw', margin: 0, padding: 0, left: 0, position: 'relative' }}>
        <CarouselPage />
        <div id="products">
          <FeaturedProducts />
        </div>
      </div>
    </div>
  );
};

export default Home;
