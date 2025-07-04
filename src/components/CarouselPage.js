import React, { useEffect } from 'react'
import Carousel from 'react-bootstrap/Carousel';
import "bootstrap/dist/css/bootstrap.min.css";
import img1 from "./images/img3.jpg";
import img2 from "./images/img2.jpg";
import img3 from "./images/img4.jpg";

import './CarouselPage.css'

function CarouselPage() {
  useEffect(() => {
    // Force a resize event to ensure carousel renders properly
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div className="carousel-container" style={{ width: '100vw', margin: 0, padding: 0, left: 0, position: 'relative' }}>
      <Carousel fade indicators controls interval={5000}>
        <Carousel.Item>
          <img 
            className="d-block w-100 carousel-image"
            src={img1}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img 
            className="d-block w-100 carousel-image"
            src={img2}
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img 
            className="d-block w-100 carousel-image"
            src={img3}
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  )
}

export default CarouselPage