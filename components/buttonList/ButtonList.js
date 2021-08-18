import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

import Button from '../button/Button';
import ListHeader from '../cardList/ListHeader';
import SlickArrow from '../cardList/SlickArrow';
import './ButtonList.less';

export default function ButtonList({className, type, header, data, ...props}) {
    let curIndex = 0;
    const useHeader = (typeof header !== 'undefined') ? true : false;

    // Inital Slick Settings
    let slickSettings = {
        className: 'buttonList buttonList-default',
        dots: false,
        infinite: false,
        initialSlide: 0,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth:true,
        touchThreshold: 10,
        prevArrow: <SlickArrow />,
        nextArrow: <SlickArrow />,
        draggable: false,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    arrows: false,
                    /*slidesToShow: 4.5,
                    slidesToScroll: 4,*/
                    speed: 300,
                },
            },
            {
                breakpoint: 479,
                settings: {
                    arrows: false,
                    /*slidesToShow: 2.25,
                    slidesToScroll: 2,*/
                    speed: 300,
                },
            },
        ],
    };

    const buttons = data.map((button, index) => (
        <div key={button.id}>
            <Button {...button} current={(props.current && props.current === (index+1)) ? true : false} />
        </div>
    ));

    return (
        <div className={`buttonList${className ? ` ${className}` : ''}`}>
            {
                type !== 'grid' ?
                    (
                        <>
                            { useHeader ? (<ListHeader label={header} />) : null}
                            <div className="buttonRow">
                                <Slider {...slickSettings}>
                                    {buttons}
                                </Slider>
                            </div>
                        </>
                    ) : (
                        <>
                            { useHeader ? (<ListHeader label={header} />) : null}
                            <div className="buttonGrid">{buttons}</div>
                        </>
                    )
            }
        </div>
    );
}
