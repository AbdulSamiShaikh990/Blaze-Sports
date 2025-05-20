import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import "bootstrap/dist/css/bootstrap.min.css";
import img1 from "./images/img3.jpg";
import img2 from "./images/img2.jpg";
import img3 from "./images/img4.jpg";

import './CarouselPage.css'

function CarouselPage() {
  return (
    <div className="carousel-container">
      <Carousel>
        <Carousel.Item>
          <img style={{height:'65vh'}}
            className="d-block w-100"
            src={img1}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img style={{height:'65vh'}}
            className="d-block w-100"
            src={img2}
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img style={{height:'65vh'}}
            className="d-block w-100"
            src={img3}
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  )
}

export default CarouselPage