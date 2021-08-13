import "./Carousel.less";
import React from "react";
import "slick-carousel/slick/slick.css";

import Slider from "react-slick";
import { StoreContext } from "../../store";
import SlickArrow from "../cardList/SlickArrow";
import InlineSVG from "../InlineSVG";

const Carousel = ({ views, slickSettings, className }) => {
    const store = React.useContext(StoreContext);

    const [currentIndex, setIndex] = React.useState(0);
    const slickRef = React.useRef(null);
    let slickGoto;
    const slickSetting = slickSettings
        ? slickSettings
        : {
              dots: false,
              infinite: false,
              speed: 400,
            //   autoplaySpeed: 4000,
            //   autoplay: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              pauseOnHover: true,
              arrows: false,
              touchThreshold: 20,
              //   prevArrow: <SlickArrow />,
              //   nextArrow: <SlickArrow />,
          };
    slickSetting.afterChange = (idx) => setIndex(idx);
    // React.useEffect(() => {
    //     if (store.isBreakpoint) {
    //         const slick = document.querySelector(".slick-slider");
    //         const carouselHeight = slick.clientHeight;
    //         // console.log("Slick", carouselHeight);
    //         const dots = document.querySelector(".carousel-dots-container");
    //         if (dots) {
    //             dots.style.cssText = `bottom: ${carouselHeight -  20}px`;
    //         }
    //     }
    // }, [store.isBreakpoint]);

    return (
        <div className={className}>
            <Slider ref={slickRef} {...slickSetting}>
                {views}
            </Slider>
            {views && (
                <div className="carousel-dots-container">
                    <div className="carousel-dots">
                        <div
                            className="right-arrow left"
                            onClick={() => {
                                slickRef.current.slickGoTo(currentIndex - 1);
                            }}
                        >
                            <InlineSVG type="arrow" />
                        </div>
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
                                    onClick={() => {
                                        slickRef.current.slickGoTo(index);
                                    }}
                                ></div>
                            )
                        )}
                        <div
                            className="right-arrow"
                            onClick={() => {
                                slickRef.current.slickGoTo(currentIndex + 1);
                            }}
                        >
                            <InlineSVG type="arrow" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carousel;
