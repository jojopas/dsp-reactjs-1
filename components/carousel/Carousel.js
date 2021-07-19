import "./Carousel.less";
import React from "react";
import "slick-carousel/slick/slick.css";

import Slider from "react-slick";
import { StoreContext } from "../../store";

const Carousel = ({ views, slickSettings, className }) => {
    const store = React.useContext(StoreContext);

    const [currentIndex, setIndex] = React.useState(0);
    const slickRef = React.useRef(null);
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
    slickSetting.initialSlide = currentIndex;
    React.useEffect(() => {
        if (store.isBreakpoint) {
            const slick = document.querySelector(".slick-slider");
            const carouselHeight = slick.clientHeight;
            console.log("Slick", carouselHeight);
            const dots = document.querySelector(".carousel-dots-container");
            dots.style.cssText = `bottom: ${carouselHeight - 500 + 50}px`;
        }
    }, [store.isBreakpoint]);

    React.useEffect(() => {
        console.log("SlickRef", slickRef.current?.slickGoTo);
        if (slickRef.current?.slickGoTo) {
            slickRef.current?.slickGoto(currentIndex);
        }
        
    }, [currentIndex]);

    return (
        <div className={className}>
            <Slider ref={slickRef} {...slickSetting}>
                {views}
            </Slider>
            {views && (
                <div className="carousel-dots-container">
                    <div className="carousel-dots">
                        {views.map((_, index) =>
                            currentIndex === index ? (
                                <div
                                    className="carousel-dot-active"
                                    key={`dots${index + 1}`}
                                ></div>
                            ) : (
                                <div
                                    className="carousel-dot"
                                    key={`dots${index + 1}`}
                                    onClick={() => setIndex(index)}
                                ></div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carousel;
