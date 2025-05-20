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
    <div className="main-content">
      <Sidebar />
      <div className="page-content">
        <CarouselPage />
        <div id="products">
          <FeaturedProducts />
        </div>
      </div>
    </div>
  );
};

export default Home;
