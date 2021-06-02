import "./Carousel.css";
import React from "react";
import Slider from "react-slick";

const Carousel = ({ views, slickSettings, className }) => {
    const slickSetting = slickSettings
        ? slickSettings
        : {
              dots: true,
              infinite: false,
              initialSlide: 0,
              speed: 400,
              touchThreshold: 20,
              draggable: true,
          };

    return (
        <div className={className}>
            <Slider {...slickSetting}>{views}</Slider>
        </div>
    );
};

export default Carousel;
