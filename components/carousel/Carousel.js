import "./Carousel.less";
import React from "react";
import Slider from "react-slick";
import { StoreContext } from "../../store";

const Carousel = ({ views, slickSettings, className }) => {
    const store = React.useContext(StoreContext);

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

    React.useEffect(() => {
        if (store.isBreakpoint) {
            const slick = document.querySelectorAll(".slick-slider");
            const carouselHeight = slick[0].clientHeight;
            // console.log("Slick", carouselHeight);
            const dots = document.querySelectorAll(".carousel-dots-container");
            dots[0].style.cssText = `bottom: ${
                carouselHeight - 500 + 50
            }px`;
        }
    }, []);

    return (
        <div className={className}>
            <Slider {...slickSetting}>{views}</Slider>
            {views && (
                <div className="carousel-dots-container">
                    <div className="carousel-dots">
                        {views.map((_, index) =>
                            currentIndex === index ? (
                                <div className="carousel-dot-active"></div>
                            ) : (
                                <div className="carousel-dot"></div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carousel;
