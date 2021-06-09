import "./Carousel.less";
import React from "react";
import Slider from "react-slick";

const Carousel = ({ views, slickSettings, className }) => {
    const [currentIndex, setIndex] = React.useState(0);
    const slickSetting = slickSettings
        ? slickSettings
        : {
              dots: false,
              infinite: false,
              speed: 400,
              slidesToShow: 1,
              slidesToScroll: 1,
          };
    slickSetting.afterChange = (idx) => setIndex(idx);
    return (
        <div className={className}>
            <Slider {...slickSetting}>{views}</Slider>
            {views && <div className="carousel-dots-container">
                <div className="carousel-dots">
                    {views.map((_, index) =>
                        currentIndex === index ? (
                            <div className="carousel-dot-active"></div>
                        ) : (
                            <div className="carousel-dot"></div>
                        )
                    )}
                </div>
            </div> }
        </div>
    );
};

export default Carousel;
